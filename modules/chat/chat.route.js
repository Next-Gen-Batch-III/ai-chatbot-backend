import { Router } from "express";
import chatController from "./chat.controller.js";
import { chatRequestSchema, getChatByIdSchema } from "./chat.schema.js";
import validateSchema from "../../middlewares/validateSchema.js";

const router = Router();



/**
 * @swagger
 * /api/chat:
 *   post:
 *     summary: Get stream of AI response for a given prompt and create a new chat session if chatId is not provided.
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
 * /api/chat/{chatId}:
 *   post:
 *     summary: Continue an existing chat session with a new prompt
 *     tags:
 *       - Chat
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: chatId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The unique ID of the existing chat session
 *         example: "064c3b77-d33a-4e9a-a2d7-2dfe99436722"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChatRequest'
 *     responses:
 *       200:
 *         description: Stream of AI response.
 *       403:
 *         description: User does not have permission to access this chat session.
 *       404:
 *         description: Chat session not found.
 */
router.post("/:chatId",validateSchema(chatRequestSchema), chatController.getAIResponse);


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
 *   get:
 *     summary: Retrieve a specific chat session by its ID.
 *     tags:
 *       - Chat
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: chatId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The unique ID of the chat session to retrieve.
 *         example: "064c3b77-d33a-4e9a-a2d7-2dfe99436722"
 *     responses:
 *       200:
 *         description: The requested chat session.
 *       404:
 *         description: Chat session not found.
 *       500:
 *         description: An error occurred while fetching the chat session.
 */
router.get("/:chatId", validateSchema(getChatByIdSchema), chatController.getChatById);


export default router;