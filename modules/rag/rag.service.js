import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { PrismaClient, Prisma } from '@prisma/client'; // 👈 Add 'Prisma' here
import { AppError, NotFoundError } from "../../errors/index.js";
import embed from "../../configs/embed.js";
import fileService from "../file/file.service.js";
import prisma from "../../configs/db.js";


class RAGService {

  async generateEmbedding({ text, inputType }) {
    let response;

    try {
      response = await embed.models.embedContent({
        model: "gemini-embedding-2",
        contents: text,
        config: {
          taskType:
            inputType === "query" ? "RETRIEVAL_QUERY" : "RETRIEVAL_DOCUMENT",
          outputDimensionality: 768,
        },
      });
    } catch (error) {
      throw new AppError(
        `Embedding Server error: ${error.message || "Unknown error"}`,
        502,
      );
    }

    const embedding = response.embeddings?.[0]?.values;

    if (!Array.isArray(embedding)) {
      throw new AppError(
        "Embedding Server error",
        502,
      );
    }

    if (embedding.length !== 768) {
      throw new AppError(
        "Embedding dimension mismatch",
        502,
      );
    }

    return embedding;
  }

  async processFileEmbedding(fileId) {
    try {
      const file = await fileService.getFileById(fileId);
      if (!file) {
        throw new NotFoundError("File not found.");
      }

      await fileService.updateFileStatus(fileId, "PROCESSING");

      this.createEmbedding(fileId).catch((error) => this.handleEmbeddingFailure(fileId, error));
    } catch (error) {
      console.error("Error in RAGService.processFileEmbedding:", error);
      throw error;
    }
  }

  async handleEmbeddingFailure(fileId, error) {
    console.error(`Error during embedding creation for file ${fileId}:`, error);

    const reason = error?.message || "An unexpected error occurred during embedding.";

    try {
      await fileService.updateFileStatus(fileId, "FAILED", reason);
    } catch (updateError) {
      console.error(`Failed to record FAILED status for file ${fileId}:`, updateError);
    }
  }

  async createEmbedding(fileId) {
    try {
      const content = await fileService.getFileContent(fileId);
      if (!content || content.trim() === "") {
        throw new NotFoundError("File content is empty.");
      }

      const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 2000,
        chunkOverlap: 200,
        separators: ["\n\n", "\n", " ", ""],
      });
      const chunks = await textSplitter.splitText(content);

      for(const chunk of chunks) {
        const embedding = await this.generateEmbedding({ text: chunk, inputType: "document" });

        await prisma.$executeRaw`INSERT INTO file_chunks (id, file_id, content, embedding) VALUES (gen_random_uuid(), ${fileId}, ${chunk}, ${JSON.stringify(embedding)}::vector)`;
      }
        await prisma.file.update({
          where: { id: fileId },
          data: { status: "EMBEDED" },
        });
    } catch (error) {
      console.error("Error in RAGService.createEmbeding:", error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError("An unexpected error occurred while creating embedding.", 500);
    }
  }

  async getContext(prompt) {
    try {
      const embedding = await this.generateEmbedding({ text: prompt, inputType: "query" });

      const vectorString = `[${embedding.join(",")}]`;

      const results = await prisma.$queryRaw`
          SELECT  
            content, 
            1 - (embedding <=> ${Prisma.sql`${vectorString}::vector`}) AS similarity
          FROM "file_chunks"
          WHERE (1 - (embedding <=> ${Prisma.sql`${vectorString}::vector`})) >= 0.65
          ORDER BY similarity DESC
          LIMIT 2;
        `;
      return results.map(result => result.content);
    } catch (error) {
      console.error("Error in RAGService.getContext:", error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError("An unexpected error occurred while retrieving context.", 500);
    }
  }
}

export default new RAGService();

