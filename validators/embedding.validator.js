import { z } from "zod";

export const embeddingRequestSchema = z.object({
  text: z
    .string()
    .trim()
    .min(1, "Text is required")
    .max(30000, "Text is too long"),

  inputType: z.enum(["document", "query"]),

  title: z
    .string()
    .trim()
    .max(300)
    .optional(),
});