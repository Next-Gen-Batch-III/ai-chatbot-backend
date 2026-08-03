import { GoogleGenAI } from "@google/genai";
import { env } from "../configs/env.js";

const ai = new GoogleGenAI({
  apiKey: env.geminiApiKey,
});

class EmbeddingProviderError extends Error {
  constructor(cause) {
    super(`Embedding provider request failed: ${cause.message}`);
    this.name = "EmbeddingProviderError";
    this.statusCode = 502;
  }
}

export async function generateEmbedding({ text, inputType, title }) {
  let response;

  try {
    response = await ai.models.embedContent({
      model: env.embeddingModel,
      contents: text,
      config: {
        taskType:
          inputType === "query" ? "RETRIEVAL_QUERY" : "RETRIEVAL_DOCUMENT",
        ...(inputType === "document" && title ? { title } : {}),
        outputDimensionality: env.embeddingDimension,
      },
    });
  } catch (error) {
    throw new EmbeddingProviderError(error);
  }

  const embedding = response.embeddings?.[0]?.values;

  if (!Array.isArray(embedding)) {
    const error = new Error("Embedding provider returned no embedding vector");
    error.statusCode = 502;
    throw error;
  }

  if (embedding.length !== env.embeddingDimension) {
    const error = new Error(
      `Embedding provider returned ${embedding.length} dimensions; expected ${env.embeddingDimension}`,
    );
    error.statusCode = 502;
    throw error;
  }

  return embedding;
}
