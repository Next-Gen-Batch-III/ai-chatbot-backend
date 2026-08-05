import { Router } from "express";
import messageController from "./message.controller.js";
import { messageRequestSchema } from "./message.schema.js";
import validateSchema from "../../middlewares/validateSchema.js";

const router = Router({ mergeParams: true });


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
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/ChatNotFound'
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StreamErrorEvent'
 *             example:
 *               type: "error"
 *               message: "An internal server error occurred."
 *               status: 500
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
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MessageItem'
 *             example:
 *               - id: "8bc44d5a-c620-410f-b47f-99efb67f16bb"
 *                 type: "USER_INPUT"
 *                 content: "Explain quantum computing in simple terms"
 *               - id: "31930f87-a2b0-487f-8606-79389bcf0dc5"
 *                 type: "MODEL_OUTPUT"
 *                 content: "Quantum computing uses qubits that can represent multiple states at once."
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/ChatNotFound'
 *       500:
 *         description: An error occurred while fetching messages.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "An internal server error occurred while fetching messages."
 */
router.get("/", messageController.getAllMessages);

export default router;