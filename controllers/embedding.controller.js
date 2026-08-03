import { generateEmbedding } from "../services/embedding.service.js";
import { embeddingRequestSchema } from "../validators/embedding.validator.js";
import { env } from "../configs/env.js";

export async function createEmbedding(req, res, next) {
  try {
    const validation = embeddingRequestSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        message: "Invalid request",
        errors: validation.error.issues,
      });
    }

    const embedding = await generateEmbedding(
      validation.data,
    );

    return res.status(200).json({
      embedding,
      dimension: embedding.length,
      model: env.embeddingModel,
    });
  } catch (error) {
    next(error);
  }
}
