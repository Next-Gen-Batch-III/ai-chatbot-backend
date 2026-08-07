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

export const getChatSchema = z.object({
    query: z.object({
        projectId: z.union([z.string().uuid(), z.literal('null')]).optional(),
        limit: z.coerce.number().int().positive().max(100).default(20),
        cursor: z.string().datetime().optional(),
    }),
})
/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateChatRequest:
 *       type: object
 *       required:
 *         - chatId
 *         - title
 *         - projectId
 *       properties:
 *         title:
 *           type: string
 *           description: The new title for the chat session.
 *           example: "My Updated Chat Title"
 *         projectId:
 *           type: string
 *           format: uuid
 *           description: The UUID of the project to which the chat is assigned. Use `null` to unassign.
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 */
export const updateChatSchema = z.object({
    params: z.object({
        chatId: z.string().uuid("Invalid chatId format"),
    }),
    body: z.object({
        title: z.string().min(1, "Title cannot be empty"),
        projectId: z.union([z.string().uuid(), z.literal('null')]).optional(),
    }),
});

export const deleteChatSchema = z.object({
    params: z.object({
        chatId: z.string().uuid("Invalid chatId format"),
    }),
});



