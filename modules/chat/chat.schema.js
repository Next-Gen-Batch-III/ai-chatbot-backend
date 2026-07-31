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

export const getChatByIdSchema = z.object({
    params: z.object({
        chatId: z.string().uuid("Invalid chatId format"),
    }),
});



