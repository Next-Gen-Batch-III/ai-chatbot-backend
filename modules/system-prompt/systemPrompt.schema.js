


/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateSystemPromptRequest:
 *       type: object
 *       required:
 *       - systemPrompt
 *       properties:
 *         systemPrompt:
 *           type: string
 *           description: The new system prompt to set.
 *           example: "You are a helpful assistant."
 */
export const updateSystemPromptSchema = z.object({
    body: z.object({
        systemPrompt: z.string().min(1, "System prompt cannot be empty"),
    }),
});