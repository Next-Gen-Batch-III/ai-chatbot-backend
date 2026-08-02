import { z } from "zod";

const MAX_FILE_SIZE = 20 * 1024 * 1024;
const ACCEPTED_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];

export const uploadDocumentSchema = z.object({
  file: z
    .custom((file) => file !== undefined && file !== null, {
      message: "Please attach a file using the form field 'file'.",
    })
    .refine(
      (file) => file?.size <= MAX_FILE_SIZE,
      `File size must be less than 20MB.`
    )
    .refine(
      (file) => ACCEPTED_MIME_TYPES.includes(file?.mimetype),
      "Only .pdf, .docx, and .txt files are allowed."
    ),
});