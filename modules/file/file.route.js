import { Router } from "express";
import multer from "multer";
import validateSchema from "../../middlewares/validateSchema.js";
import checkRole from "../../middlewares/checkRole.js";
import { uploadFileSchema, deleteFileSchema } from "./file.schema.js";
import fileController from "./file.controller.js";
import RAGRoute from "../rag/rag.route.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

/**
 * @swagger
 * /api/files:
 *   post:
 *     summary: Upload a document file.
 *     tags:
 *       - Files
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: File uploaded successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     title:
 *                       type: string
 *                     fileUrl:
 *                       type: string
 *                       format: uri
 *                     fileSize:
 *                       type: integer
 *                     fileType:
 *                       type: string
 *                     status:
 *                       type: string
 *             example:
 *               data:
 *                 id: "4a6b1f8e-7d1c-4d65-bb02-0f4df9cc2f67"
 *                 title: "sample.pdf"
 *                 fileUrl: "https://example.supabase.co/storage/v1/object/public/documents/1700000000000_sample.pdf"
 *                 fileSize: 245811
 *                 fileType: "application/pdf"
 *                 status: "PENDING"
 *       400:
 *         description: Bad request, invalid file or schema validation error.
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
 *                 - field: "file"
 *                   message: "Please attach a file using the form field 'file'."
 *       401:
 *         description: Unauthorized, missing or invalid JWT token.
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
 *         description: Forbidden, user does not have the required role.
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
 *                 error:
 *                   type: string
 *             example:
 *               error: "An error occurred while uploading the file."
 */
router.post("/", upload.single("file"), validateSchema(uploadFileSchema), fileController.uploadFile);

/**
 * @swagger
 * /api/files:
 *   get:
 *     summary: Retrieve all uploaded files.
 *     tags:
 *       - Files
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of uploaded files.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       title:
 *                         type: string
 *                       fileUrl:
 *                         type: string
 *                         format: uri
 *                       fileSize:
 *                         type: integer
 *                       fileType:
 *                         type: string
 *                       status:
 *                         type: string
 *             example:
 *               data:
 *                 - id: "4a6b1f8e-7d1c-4d65-bb02-0f4df9cc2f67"
 *                   title: "sample.pdf"
 *                   fileUrl: "https://example.supabase.co/storage/v1/object/public/documents/1700000000000_sample.pdf"
 *                   fileSize: 245811
 *                   fileType: "application/pdf"
 *                   status: "PENDING"
 *       401:
 *         description: Unauthorized, missing or invalid JWT token.
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
 *         description: Forbidden, user does not have the required role.
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
 *                 error:
 *                   type: string
 *             example:
 *               error: "An error occurred while fetching files."
 */
router.get("/", fileController.getFile);


/**
 * @swagger
 * /api/files/{fileId}:
 *   delete:
 *     summary: Delete an uploaded file.
 *     tags:
 *       - Files
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: fileId
 *         required: true
 *         description: The unique ID of the file to delete.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       204:
 *         description: File deleted successfully.
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
 *                 - field: "params.fileId"
 *                   message: "Invalid file ID format."
 *       401:
 *         description: Unauthorized, missing or invalid JWT token.
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
 *         description: Forbidden, user does not have the required admin role.
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
 *         description: File not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: "File not found."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: "An error occurred while deleting the file."
 */
router.delete("/:fileId", validateSchema(deleteFileSchema), fileController.deleteFile);

router.use("/:fileId/embedding", RAGRoute);

export default router;
