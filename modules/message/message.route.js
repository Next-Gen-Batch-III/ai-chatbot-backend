import { Router } from "express";
import messageController from "./message.controller.js";
import { messageRequestSchema } from "./message.schema.js";
import validateSchema from "../../middlewares/validateSchema.js";

const router = Router();


/**
 * @swagger
 * /api/chats/{chatId}/messages:
 *   post:
 *     summary: Get stream of AI response for a given prompt and create a new message in the specified chat session.
 *     tags:
 *       - Messages
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: chatId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           description: The unique ID of the chat session
 *           example: "064c3b77-d33a-4e9a-a2d7-2dfe99436722"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MessageRequest'
 *     responses:
 *       200:
 *         description: Stream of AI response.
 *       403:
 *         description: User does not have permission to access this chat session.
 *       404:
 *         description: Chat session not found.
 */
router.post("/", validateSchema(messageRequestSchema), messageController.getAIResponse);

/**
 * @swagger
 * /api/chats/{chatId}/messages:
 *   get:
 *     summary: Retrieve all messages for a specific chat session.
 *     tags:
 *       - Messages
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: chatId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           description: The unique ID of the chat session
 *           example: "064c3b77-d33a-4e9a-a2d7-2dfe99436722"
 *     responses:
 *       200:
 *         description: A list of messages for the specified chat session.
 *       403:
 *         description: User does not have permission to access this chat session.
 *       404:
 *         description: Chat session not found.
 *       500:
 *         description: An error occurred while fetching messages.
 */
router.get("/", messageController.getAllMessages);

export default router;