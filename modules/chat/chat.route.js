import { Router } from "express";

import chatController from "./chat.controller.js";
import { chatRequestSchema, updateChatSchema, deleteChatSchema } from "./chat.schema.js";
import validateSchema from "../../middlewares/validateSchema.js";
import messageRoutes from "../message/message.route.js";

const router = Router();



/**
 * @swagger
 * /api/chats:
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
 *         description: Server-Sent Events stream of AI response chunks.
 *         headers:
 *           Content-Type:
 *             description: SSE content type.
 *             schema:
 *               type: string
 *               example: text/event-stream
 *           Cache-Control:
 *             schema:
 *               type: string
 *               example: no-cache
 *           Connection:
 *             schema:
 *               type: string
 *               example: keep-alive
 *         content:
 *           text/event-stream:
 *             schema:
 *               type: string
 *               description: |
 *                 SSE frames where each frame starts with "data:" followed by a JSON payload and then a blank line.
 *             examples:
 *               streamExample:
 *                 value: |
 *                   data: {"type":"thought","content":"thinking...","chatId":"064c3b77-d33a-4e9a-a2d7-2dfe99436722"}
 *
 *                   data: {"type":"text","content":"Hello!","chatId":"064c3b77-d33a-4e9a-a2d7-2dfe99436722"}
 *
 *                   data: {"type":"end","chatId":"064c3b77-d33a-4e9a-a2d7-2dfe99436722","chatTitle":"My chat"}
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *               
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post("/", validateSchema(chatRequestSchema) , chatController.getAIResponse);

/**
 * @swagger
 * /api/chats:
 *   get:
 *     summary: Retrieve all chat sessions for the authenticated user.
 *     tags:
 *       - Chat
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of chat sessions.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ChatSummary'
 *             example:
 *               chat: 
 *                 -  "id": "064c3b77-d33a-4e9a-a2d7-2dfe99436722"
 *                    "title": "My First Chat"
 *                    "lastMessageAt": "2023-10-01T12:34:56Z"
 *                    "isPinned": true
 *                 -  "id": "064c3b77-d33a-4e9a-a2d7-2dfe99436723"
 *                    "title": "My Second Chat"
 *                    "lastMessageAt": "2023-10-02T12:34:56Z"
 *                    "isPinned": false
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         description: An error occurred while fetching chats.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "An error occurred while fetching chats."
 */
router.get("/", chatController.getAllChats);

/**
 * @swagger
 * /api/chats/{chatId}:
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChatUpdateResponse'
 *             example:
 *               chatId: "064c3b77-d33a-4e9a-a2d7-2dfe99436722"
 *               title: "My Updated Chat Title"
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/ChatNotFound'
 *       500:
 *         description: An error occurred while updating the chat session.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "An error occurred while updating the chat."
 */
router.patch("/:chatId", validateSchema(updateChatSchema), chatController.updateChat);

/** 
 * @swagger
 * /api/chats/{chatId}/toggle-pin:
 *   patch:
 *     summary: Toggle the pinned status of a chat session.
 *     tags:
 *       - Chat
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *     - in: path
 *       name: chatId
 *       required: true
 *       description: The unique ID of the chat session to toggle pin status.
 *       schema:
 *         type: string
 *         format: uuid
 *         example: "064c3b77-d33a-4e9a-a2d7-2dfe99436722"
 *     responses:
 *       200:
 *         description: The updated chat session with the new pinned status.
 *         content:
 *           application/json: 
 *             schema:
 *               $ref: '#/components/schemas/ChatUpdateResponse'
 *             example:
 *               chatId: "064c3b77-d33a-4e9a-a2d7-2dfe99436722"
 *               title: "My Updated Chat Title"
 *               isPinned: true
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
*/
router.patch("/:chatId/toggle-pin", chatController.togglePinChat);

/**
 * @swagger
 * /api/chats/{chatId}:
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
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/ChatNotFound'
 *       500:
 *         description: An error occurred while deleting the chat session.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "An error occurred while deleting the chat."
 */
router.delete("/:chatId", validateSchema(deleteChatSchema), chatController.deleteChat);

router.use("/:chatId/messages", messageRoutes);


export default router;