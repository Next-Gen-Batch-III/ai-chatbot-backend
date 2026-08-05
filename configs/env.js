import dotenv from "dotenv";

dotenv.config();

const geminiApiKey =
  process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_STUDIO_API_KEY;

if (!geminiApiKey) {
  throw new Error(
    "GEMINI_API_KEY or GOOGLE_AI_STUDIO_API_KEY is required",
  );
}

const embeddingModel = process.env.EMBEDDING_MODEL || "gemini-embedding-2";
const embeddingDimension = Number(process.env.EMBEDDING_DIMENSION || 768);

if (embeddingModel !== "gemini-embedding-2") {
  throw new Error("EMBEDDING_MODEL must be gemini-embedding-2");
}

if (embeddingDimension !== 768) {
  throw new Error("EMBEDDING_DIMENSION must be 768");
}

export const env = {
  port: Number(process.env.PORT) || 3001,
  geminiApiKey,
  embeddingModel,
  embeddingDimension,
};
