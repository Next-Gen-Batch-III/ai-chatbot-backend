import { Router } from "express";

import chatController from "./chat.controller.js";
import { chatRequestSchema, updateChatSchema, deleteChatSchema, getChatSchema } from "./chat.schema.js";
import validateSchema from "../../middlewares/validateSchema.js";
import messageRoutes from "../message/message.route.js";
import { aiRateLimiter } from "../../middlewares/rateLimit.js";

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
 *                   data: {"type":"start","chatId":"064c3b77-d33a-4e9a-a2d7-2dfe99436722","chatTitle":"My chat"}
 * 
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
router.post("/",  validateSchema(chatRequestSchema), aiRateLimiter, chatController.getAIResponse);

/**
 * @swagger
 * /api/chats:
 *   get:
 *     summary: Retrieve chat sessions for the authenticated user.
 *     description: >
 *       Fetches a paginated list of chats. Allows filtering by project assignment:
 *       - Omitted: Returns all chats (both standalone and project-bound).
 *       - `null`: Returns standalone chats only (not assigned to any project).
 *       - `<uuid>`: Returns chats assigned to a specific project.
 *     tags:
 *       - Chat
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: projectId
 *         required: false
 *         description: Filter chats by project. Pass a project UUID, the literal string `"null"`, or omit to fetch all.
 *         schema:
 *           oneOf:
 *             - type: string
 *               format: uuid
 *             - type: string
 *               enum: ["null"]
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *           minimum: 1
 *           maximum: 100
 *         description: Number of chats to fetch per page.
 *       - in: query
 *         name: cursor
 *         schema:
 *           type: string
 *           format: date-time
 *         description: ISO timestamp cursor from previous response for pagination (`nextCursor`).
 *     responses:
 *       200:
 *         description: A paginated list of chat sessions.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 chats:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ChatSummary'
 *                 nextCursor:
 *                   type: string
 *                   format: date-time
 *                   nullable: true
 *                   description: Cursor for the next page. Returns `null` when there are no more chats to fetch.
 *             example:
 *               chats:
 *                 - id: "064c3b77-d33a-4e9a-a2d7-2dfe99436722"
 *                   title: "My First Chat"
 *                   lastMessageAt: "2026-08-01T12:34:56Z"
 *                   isPinned: true
 *                 - id: "064c3b77-d33a-4e9a-a2d7-2dfe99436723"
 *                   title: "My Second Chat"
 *                   lastMessageAt: "2026-07-30T10:15:00Z"
 *                   isPinned: false
 *               nextCursor: "2026-07-30T10:15:00Z"
 *       400:
 *         description: Invalid query parameters (e.g., malformed UUID or cursor date).
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
router.get("/", validateSchema(getChatSchema), chatController.getAllChats);

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
 *               isPinned: true
 *               lastMessageAt: "2023-10-02T12:34:56Z"
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
 *               lastMessageAt: "2023-10-02T12:34:56Z"
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