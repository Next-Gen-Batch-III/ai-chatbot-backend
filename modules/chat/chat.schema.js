import { z } from "zod";

export const chatRequestSchema = z.object({
    body: z.object({
        prompt: z.string().min(1, "Prompt cannot be empty"),
    }),
    params: z.object({
        chatId: z.string().uuid().optional(),
    }),
});

export const getAllChatSchema = z.object({
    query: z.object({
        useId: z.string()
    })
});


