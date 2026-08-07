import prisma from "../../configs/db.js";
import { AppError, NotFoundError, UnauthorisedError } from "../../errors/index.js";

class ProjectService {
    async createProject(userId, title) {

        try {
            const project = await prisma.project.create({
                data: {
                    title,
                    userId,
                },
                select: {
                    id: true,
                    title: true,
                    createdAt: true,
                }
            });
            return project;
        } catch (error) {
            console.error("Error in ProjectService.createProject:", error);
            throw new AppError("An unexpected error occurred while creating the project.", 500);
        }
    }

    async getAllProjects(userId) {
        try {
            const projects = await prisma.project.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    title: true,
                    createdAt: true,
                }
            });
            return projects;
        } catch (error) {
            console.log("Error in Getting Project", err);
            throw new AppError("An unexpected error occurred while fetching projects.", 500);
        }
    }

    async updateProjectTitle(projectId, userId, newTitle) {
        try {
            const project = await prisma.project.findUnique({
                where: { id: projectId },
            });

            if (!project) {
                throw new NotFoundError("Project not found.");
            }

            if (project.userId !== userId) {
                throw new UnauthorisedError("You do not have permission to update this project.");
            }

            const updatedProject = await prisma.project.update({
                where: { id: projectId },
                data: { title: newTitle },
                select: {
                    id: true,
                    title: true,
                    createdAt: true,
                }
            });
            return updatedProject;
        } catch (error) {
            console.error("Error in ProjectService.updateProjectTitle:", error);
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError("An unexpected error occurred while updating the project title.", 500);
        }
    }

    async deleteProject(projectId, userId) {
        try {
            const project = await prisma.project.findUnique({
                where: { id: projectId },
            });

            if (!project) {
                throw new NotFoundError("Project not found.");
            }

            if (project.userId !== userId) {
                throw new UnauthorisedError("You do not have permission to delete this project.");
            }

            await prisma.project.delete({
                where: { id: projectId },
            });

            return;
        } catch (error) {
            console.error("Error in ProjectService.deleteProject:", error);
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError("An unexpected error occurred while deleting the project.", 500);
        }
    }
}

export default new ProjectService();