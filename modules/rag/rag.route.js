import { Router } from "express";
import RAGController from "./rag.controller.js";
import { embeddingRequestSchema } from "./rag.schema.js"
import validateSchema from "../../middlewares/validateSchema.js";

const router = Router({ mergeParams: true });

/**
 * @swagger
 * /api/files/{fileId}/embedding:
 *   post:
 *     summary: Start embedding generation for an uploaded file.
 *     tags:
 *       - RAG
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: fileId
 *         required: true
 *         description: The unique ID of the file to embed.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       202:
 *         description: Embedding process started successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "Embedding process started for file 1."
 *       400:
 *         description: Validation error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       field:
 *                         type: string
 *                       message:
 *                         type: string
 *             example:
 *               message: "Validation error"
 *               errors:
 *                 - field: "params.fileId"
 *                   message: "Invalid file ID format."
 *       401:
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "Unauthorized"
 *       403:
 *         description: Forbidden.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "Forbidden"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: "An internal server error occurred while creating embedding."
 */
router.post("/", validateSchema(embeddingRequestSchema), RAGController.createEmbedding);

export default router;
