import { z } from "zod";

/**
 * @swagger
 * components:
 *   schemas:
 *     FileEmbeddingRequest:
 *       type: object
 *       required:
 *         - fileId
 *       properties:
 *         fileId:
 *           type: integer
 *           description: The unique ID of the file to embed.
 *           example: 1
 */
export const embeddingRequestSchema = z.object({
    params: z.object({
    fileId: z.coerce.number().int().positive("Invalid file ID format."),
    }),
});