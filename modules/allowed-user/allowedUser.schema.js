import { z } from "zod";

/**
 * @swagger
 * components:
 *   schemas:
 *     AllowedUser:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         email:
 *           type: string
 *           format: email
 *           example: "user@example.com"
 *         isActive:
 *           type: boolean
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2024-01-01T00:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2024-01-01T00:00:00.000Z"
 *
 *     CreateAllowedUserRequest:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: "newuser@example.com"
 *
 *     VerifyEmailRequest:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: "user@example.com"
 *
 *     UpdateAllowedUserRequest:
 *       type: object
 *       required:
 *         - isActive
 *       properties:
 *         isActive:
 *           type: boolean
 *           example: false
 */
export const verifyEmailSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email format"),
  }),
});

export const createAllowedUserSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email format"),
  }),
});

export const updateAllowedUserSchema = z.object({
  params: z.object({
    allowedUserId: z.coerce.number().int().positive("Invalid userId format"),
  }),
  body: z.object({
    isActive: z.boolean(),
  }),
});

export const resetAllowedUserSchema = z.object({
  params: z.object({
    allowedUserId: z.coerce.number().int().positive("Invalid userId format"),
  }),
});

export const deleteAllowedUserSchema = z.object({
  params: z.object({
    allowedUserId: z.coerce.number().int().positive("Invalid userId format"),
  }),
});
