import { z } from "zod";

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateProjectBody:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         title:
 *           type: string
 *           description: Title of the project.
 *           example: "My New Project"
 *     UpdateProjectBody:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         title:
 *           type: string
 *           description: Updated title of the project.
 *           example: "Updated Project Title"
 */

export const createProjectSchema = z.object({
    body: z.object({
        title: z.string().min(1, "Title cannot be empty"),
    }),
});

export const updateProjectSchema = z.object({
    params: z.object({
        projectId: z.string().uuid("Invalid projectId format"),
    }),
    body: z.object({
        title: z.string().min(1, "Title cannot be empty"),
    }),
});

export const deleteProjectSchema = z.object({
    params: z.object({
        projectId: z.string().uuid("Invalid projectId format"),
    }),
});