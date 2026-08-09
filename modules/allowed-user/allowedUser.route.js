import { Router } from "express";
import validateSchema from "../../middlewares/validateSchema.js";
import authenticate from "../../middlewares/authenticate.js";
import checkRole from "../../middlewares/checkRole.js";
import allowedUserController from "./allowedUser.controller.js";
import {
  createAllowedUserSchema,
  updateAllowedUserSchema,
  deleteAllowedUserSchema,
  resetAllowedUserSchema,
  verifyEmailSchema,
} from "./allowedUser.schema.js";

const router = Router();

/**
 * @swagger
 * /api/allowed-users/verify:
 *   post:
 *     summary: Check if an email is on the allowed list.
 *     description: Returns whether the given email exists in the allowed-users list and is currently active. No authentication required.
 *     tags:
 *       - Allowed Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VerifyEmailRequest'
 *     responses:
 *       200:
 *         description: Email verification result.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                       format: email
 *                     isAllowed:
 *                       type: boolean
 *             example:
 *               data:
 *                 email: "user@example.com"
 *                 isAllowed: true
 *       400:
 *         description: Validation error (invalid email format).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       field:
 *                         type: string
 *                       message:
 *                         type: string
 *             example:
 *               message: "Validation error"
 *               errors:
 *                 - field: "body.email"
 *                   message: "Invalid email format"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "An unexpected error occurred while checking the email."
 */
router.post(
  "/verify",
  validateSchema(verifyEmailSchema),
  allowedUserController.isEmailAllowed,
);

router.use(authenticate);
router.use(checkRole(["ADMIN"]));

/**
 * @swagger
 * /api/allowed-users:
 *   post:
 *     summary: Add a new email to the allowed-users list.
 *     description: Creates a new allowed-user record with `isActive` set to `true`. The email is trimmed and lowercased before storage. Requires ADMIN role.
 *     tags:
 *       - Allowed Users
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAllowedUserRequest'
 *     responses:
 *       201:
 *         description: Allowed user created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/AllowedUser'
 *             example:
 *               data:
 *                 id: 2
 *                 email: "newuser@example.com"
 *                 isActive: true
 *                 createdAt: "2024-01-01T00:00:00.000Z"
 *                 updatedAt: "2024-01-01T00:00:00.000Z"
 *       400:
 *         description: Validation error (invalid email format).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       field:
 *                         type: string
 *                       message:
 *                         type: string
 *             example:
 *               message: "Validation error"
 *               errors:
 *                 - field: "body.email"
 *                   message: "Invalid email format"
 *       401:
 *         description: Unauthorized, missing or invalid token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "Unauthorized"
 *       403:
 *         description: Forbidden, insufficient role.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "Forbidden"
 *       409:
 *         description: Email already exists in the allowed-users list.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 code:
 *                   type: string
 *             examples:
 *               userAlreadyExists:
 *                 summary: Email is already active
 *                 value:
 *                   message: "User with email newuser@example.com already exists and is active."
 *                   code: "USER_ALREADY_EXISTS"
 *               userInactive:
 *                 summary: Email exists but is inactive
 *                 value:
 *                   message: "User with email newuser@example.com already exists."
 *                   code: "USER_INACTIVE"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "An unexpected error occurred while adding the user"
 */
router.post(
  "/",
  validateSchema(createAllowedUserSchema),
  allowedUserController.createAllowedUser,
);

/**
 * @swagger
 * /api/allowed-users/{allowedUserId}/reset:
 *   post:
 *     summary: Reset an allowed user's account data.
 *     description: >
 *       Runs a transaction that deletes the linked `User` record (matched by email)
 *       and resets `isActive` to `true` on the `AllowedUser` record, allowing the
 *       email to register again from scratch. Requires ADMIN role.
 *     tags:
 *       - Allowed Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: allowedUserId
 *         required: true
 *         description: The integer ID of the allowed user to reset.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Allowed user data reset successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "Allowed user data has been reset."
 *       401:
 *         description: Unauthorized, missing or invalid token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "Unauthorized"
 *       403:
 *         description: Forbidden, insufficient role.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "Forbidden"
 *       404:
 *         description: Allowed user not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "Allowed user with ID 1 not found."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "An unexpected error occurred while resetting allowed user data."
 */
router.post(
  "/:allowedUserId/reset",
  validateSchema(resetAllowedUserSchema),
  allowedUserController.resetAllowedUserData,
);

/**
 * @swagger
 * /api/allowed-users:
 *   get:
 *     summary: Retrieve all allowed users.
 *     description: Returns a list of all allowed-user records. Requires ADMIN role.
 *     tags:
 *       - Allowed Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of allowed users retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/AllowedUser'
 *             example:
 *               data:
 *                 - id: 1
 *                   email: "user@example.com"
 *                   isActive: true
 *                   createdAt: "2024-01-01T00:00:00.000Z"
 *                   updatedAt: "2024-01-01T00:00:00.000Z"
 *                 - id: 2
 *                   email: "another@example.com"
 *                   isActive: true
 *                   createdAt: "2024-02-01T00:00:00.000Z"
 *                   updatedAt: "2024-03-01T00:00:00.000Z"
 *       401:
 *         description: Unauthorized, missing or invalid token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "Unauthorized"
 *       403:
 *         description: Forbidden, insufficient role.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "Forbidden"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "An unexpected error occurred while fetching users."
 */
router.get("/", allowedUserController.getAllowedUsers);

/**
 * @swagger
 * /api/allowed-users/{allowedUserId}:
 *   patch:
 *     summary: Update the active status of an allowed user.
 *     description: Activates or deactivates an allowed user by setting `isActive`. Requires ADMIN role.
 *     tags:
 *       - Allowed Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: allowedUserId
 *         required: true
 *         description: The integer ID of the allowed user to update.
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateAllowedUserRequest'
 *     responses:
 *       200:
 *         description: Allowed user status updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/AllowedUser'
 *             example:
 *               data:
 *                 id: 1
 *                 email: "user@example.com"
 *                 isActive: false
 *                 createdAt: "2024-01-01T00:00:00.000Z"
 *                 updatedAt: "2024-06-01T00:00:00.000Z"
 *       400:
 *         description: Validation error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       field:
 *                         type: string
 *                       message:
 *                         type: string
 *             example:
 *               message: "Validation error"
 *               errors:
 *                 - field: "body.isActive"
 *                   message: "Required"
 *       401:
 *         description: Unauthorized, missing or invalid token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "Unauthorized"
 *       403:
 *         description: Forbidden, insufficient role.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "Forbidden"
 *       404:
 *         description: Allowed user not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "Allowed user with ID 1 not found."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "An unexpected error occurred while updating the allowed user status."
 */
router.patch(
  "/:allowedUserId",
  validateSchema(updateAllowedUserSchema),
  allowedUserController.updateAllowedUserStatus,
);

/**
 * @swagger
 * /api/allowed-users/{allowedUserId}:
 *   delete:
 *     summary: Deactivate an allowed user.
 *     description: Soft-deletes an allowed user by setting `isActive` to `false`. The record is not removed from the database. Requires ADMIN role.
 *     tags:
 *       - Allowed Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: allowedUserId
 *         required: true
 *         description: The integer ID of the allowed user to deactivate.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       204:
 *         description: Allowed user deactivated successfully.
 *       401:
 *         description: Unauthorized, missing or invalid token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "Unauthorized"
 *       403:
 *         description: Forbidden, insufficient role.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "Forbidden"
 *       404:
 *         description: Allowed user not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "Allowed user with ID 1 not found."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "An unexpected error occurred while deleting the allowed user."
 */
router.delete(
  "/:allowedUserId",
  validateSchema(deleteAllowedUserSchema),
  allowedUserController.deleteAllowedUser,
);

export default router;
