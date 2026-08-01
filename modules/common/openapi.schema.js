/**
 * @swagger
 * components:
 *   schemas:
 *     ValidationErrorItem:
 *       type: object
 *       properties:
 *         field:
 *           type: string
 *         message:
 *           type: string
 *     ValidationErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         errors:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ValidationErrorItem'
 *       example:
 *         message: "Validation error"
 *         errors:
 *           - field: "body.prompt"
 *             message: "Prompt cannot be empty"
 *
 *     UnauthorizedResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *       example:
 *         message: "Unauthorized"
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *
 *     StreamErrorEvent:
 *       type: object
 *       properties:
 *         type:
 *           type: string
 *           example: "error"
 *         message:
 *           type: string
 *         status:
 *           type: integer
 *       example:
 *         type: "error"
 *         message: "An internal server error occurred."
 *         status: 500
 *
 *     ChatSummary:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         title:
 *           type: string
 *         lastMessageAt:
 *           type: string
 *           format: date-time
 *
 *     ChatUpdateResponse:
 *       type: object
 *       properties:
 *         chatId:
 *           type: string
 *           format: uuid
 *         title:
 *           type: string
 *       example:
 *         chatId: "064c3b77-d33a-4e9a-a2d7-2dfe99436722"
 *         title: "My Updated Chat Title"
 *
 *     MessageItem:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         type:
 *           type: string
 *           enum: [USER_INPUT, MODEL_OUTPUT]
 *         content:
 *           type: string
 *
 *   responses:
 *     ValidationError:
 *       description: Validation error.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ValidationErrorResponse'
 *
 *     Unauthorized:
 *       description: Unauthorized. User is not authenticated.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UnauthorizedResponse'
 *
 *     Forbidden:
 *       description: User does not have permission to access this resource.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorResponse'
 *           example:
 *             error: "You do not have permission to access this chat."
 *
 *     ChatNotFound:
 *       description: Chat session not found.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorResponse'
 *           example:
 *             error: "Chat not found."
 *
 *     InternalServerError:
 *       description: Internal server error.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorResponse'
 *           example:
 *             error: "An internal server error occurred."
 */
export const openApiComponentsLoaded = true;
