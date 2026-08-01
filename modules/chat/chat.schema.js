import { z } from "zod";



/**
 * @swagger
 * components:
 *   schemas:
 *     ChatRequest:
 *       type: object
 *       required:
 *         - prompt
 *       properties:
 *         prompt:
 *           type: string
 *           description: The prompt to send to the AI model.
 *           example: "Explain quantum computing in simple terms"
 */
export const chatRequestSchema = z.object({
    body: z.object({
        prompt: z.string().min(1, "Prompt cannot be empty"),
    }),
    params: z.object({
        chatId: z.string().uuid().optional(),
    }),
});

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateChatRequest:
 *       type: object
 *       required:
 *         - chatId
 *         - title
 *       properties:
 *         title:
 *           type: string
 *           description: The new title for the chat session.
 *           example: "My Updated Chat Title"
 */
export const updateChatSchema = z.object({
    params: z.object({
        chatId: z.string().uuid("Invalid chatId format"),
    }),
    body: z.object({
        title: z.string().min(1, "Title cannot be empty"),
    }),
});

export const deleteChatSchema = z.object({
    params: z.object({
        chatId: z.string().uuid("Invalid chatId format"),
    }),
});



