import projectController from "./project.controller.js";
import { Router } from "express";
import validateSchema from "../../middlewares/validateSchema.js";
import { createProjectSchema, updateProjectSchema, deleteProjectSchema } from "./project.schema.js";

const router = Router();

/**
 * @swagger
 * /api/projects:
 *   post:
 *     summary: Create a new project.
 *     tags:
 *       - Projects
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: "My New Project"
 *     responses:
 *       201:
 *         description: Project created successfully.
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
 *                     userId:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *             example:
 *               data:
 *                 id: "064c3b77-d33a-4e9a-a2d7-2dfe99436722"
 *                 title: "My New Project"
 *                 userId: "user_2tXyZ1..."
 *                 createdAt: "2026-08-07T12:00:00Z"
 *                 updatedAt: "2026-08-07T12:00:00Z"
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
 *                 - field: "body.title"
 *                   message: "Title cannot be empty"
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
 *               error: "An error occurred while creating the project."
 */
router.post("/", validateSchema(createProjectSchema), projectController.createProject);

/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Retrieve all projects for the authenticated user.
 *     tags:
 *       - Projects
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user projects retrieved successfully.
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
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *             example:
 *               data:
 *                 - id: "064c3b77-d33a-4e9a-a2d7-2dfe99436722"
 *                   title: "My New Project"
 *                   createdAt: "2026-08-07T12:00:00Z"
 *                   updatedAt: "2026-08-07T12:00:00Z"
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
 *               error: "An error occurred while fetching projects."
 */
router.get("/", projectController.getAllProjects);

/**
 * @swagger
 * /api/projects/{projectId}:
 *   patch:
 *     summary: Update an existing project title.
 *     tags:
 *       - Projects
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         description: The unique ID of the project to update.
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "064c3b77-d33a-4e9a-a2d7-2dfe99436722"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Updated Project Title"
 *     responses:
 *       200:
 *         description: Project updated successfully.
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
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *             example:
 *               data:
 *                 id: "064c3b77-d33a-4e9a-a2d7-2dfe99436722"
 *                 title: "Updated Project Title"
 *                 updatedAt: "2026-08-07T12:30:00Z"
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
 *                 - field: "body.title"
 *                   message: "Title cannot be empty"
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
 *       404:
 *         description: Project not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: "Project not found."
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
 *               error: "An error occurred while updating the project."
 */
router.patch("/:projectId", validateSchema(updateProjectSchema), projectController.updateProjectTitle);

/**
 * @swagger
 * /api/projects/{projectId}:
 *   delete:
 *     summary: Delete a project.
 *     tags:
 *       - Projects
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         description: The unique ID of the project to delete.
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "064c3b77-d33a-4e9a-a2d7-2dfe99436722"
 *     responses:
 *       204:
 *         description: Project deleted successfully.
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
 *                 - field: "params.projectId"
 *                   message: "Invalid projectId format"
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
 *       404:
 *         description: Project not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: "Project not found."
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
 *               error: "An error occurred while deleting the project."
 */
router.delete("/:projectId", validateSchema(deleteProjectSchema), projectController.deleteProject);

export default router;