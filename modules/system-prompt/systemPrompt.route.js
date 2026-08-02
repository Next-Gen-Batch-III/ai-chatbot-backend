import { Router } from "express";
import systemPromptController from "./systemPrompt.controller.js";


const router = Router();


/**
 * @swagger
 * /api/system-prompt:
 *   get:
 *     summary: Get the current system prompt.
 *     tags:
 *       - System Prompt
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved the current system prompt.
 *         content:
 *           application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  systemPrompt:
 *                    type: string
 *                    description: The current system prompt.
 *                    example: "You are a helpful assistant."
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       500:
 *         description: An error occurred while fetching the system prompt.            
 */
router.get("/", systemPromptController.getSystemPrompt);


/**
 * @swagger
 * /api/system-prompt:
 *   patch:
 *     summary: Update the system prompt.
 *     tags:
 *       - System Prompt
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateSystemPromptRequest'
 *     responses:
 *       200:
 *         description: Successfully updated the system prompt.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 systemPrompt:
 *                   type: string
 *                   description: The updated system prompt.
 *                   example: "You are a helpful assistant."
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       500:
 *         description: An error occurred while updating the system prompt.
 */
router.patch("/", systemPromptController.updateSystemPrompt);

export default router;