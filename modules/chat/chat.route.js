import { Router } from "express";

import chatController from "./chat.controller.js";
import { chatRequestSchema, updateChatSchema, deleteChatSchema } from "./chat.schema.js";
import validateSchema from "../../middlewares/validateSchema.js";
import messageRoutes from "../message/message.route.js";

const router = Router();



/**
 * @swagger
 * /api/chat:
 *   post:
 *     summary: Get stream of AI response and create a new chat session.
 *     tags:
 *       - Chat
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChatRequest'
 *     responses:
 *       200:
 *         description: Stream of AI response.
 */
router.post("/", validateSchema(chatRequestSchema) , chatController.getAIResponse);

/**
 * @swagger
 * /api/chat:
 *   get:
 *     summary: Retrieve all chat sessions for the authenticated user.
 *     tags:
 *       - Chat
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of chat sessions.
 *       500:
 *         description: An error occurred while fetching chats.
 */
router.get("/", chatController.getAllChats);

/**
 * @swagger
 * /api/chat/{chatId}:
 *   patch:
 *     summary: Update the title of an existing chat session.
 *     tags:
 *       - Chat
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: chatId
 *         required: true
 *         description: The unique ID of the chat session to update.
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "064c3b77-d33a-4e9a-a2d7-2dfe99436722"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateChatRequest'
 *     responses:
 *       200:
 *         description: The updated chat session.
 *       403:
 *         description: User does not have permission to update this chat session.
 *       404:
 *         description: Chat session not found.
 *       500:
 *         description: An error occurred while updating the chat session.
 */
router.patch("/:chatId", validateSchema(updateChatSchema), chatController.updateChat);

/**
 * @swagger
 * /api/chat/{chatId}:
 *   delete:
 *     summary: Delete an existing chat session.
 *     tags:
 *       - Chat
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: chatId
 *         required: true
 *         description: The unique ID of the chat session to delete.
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "064c3b77-d33a-4e9a-a2d7-2dfe99436722"
 *     responses:
 *       204:
 *         description: Chat session deleted successfully.
 *       403:
 *         description: User does not have permission to delete this chat session.
 *       404:
 *         description: Chat session not found.
 *       500:
 *         description: An error occurred while deleting the chat session.
 */
router.delete("/:chatId", validateSchema(deleteChatSchema), chatController.deleteChat);

router.use("/:chatId/messages", messageRoutes);


export default router;