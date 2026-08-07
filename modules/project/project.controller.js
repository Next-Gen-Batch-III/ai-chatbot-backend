import projectService from './project.service.js';
import { AppError } from '../../errors/index.js';

class ProjectController {
    async createProject(req, res) {
        const { title } = req.body;
        
        try {
            const project = await projectService.createProject(req.userId, title);
            res.status(201).json(project);
        } catch (error) {
            console.error("Error creating project:", error);
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({ error: error.message });
            }
            res.status(500).json({ error: "An unexpected error occurred while creating the project." });
        }
    }

    async getAllProjects(req, res) {
        try {
            const projects = await projectService.getAllProjects(req.userId);
            res.status(200).json(projects);
        } catch (error) {
            console.error("Error fetching projects:", error);
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({ error: error.message });
            }
            res.status(500).json({ error: "An unexpected error occurred while fetching projects." });
        }
    }

    async updateProjectTitle(req, res) {
        const { projectId } = req.params;
        const { newTitle } = req.body;

        try {
            const updatedProject = await projectService.updateProjectTitle(projectId, req.userId, newTitle);
            res.status(200).json(updatedProject);
        } catch (error) {
            console.error("Error updating project title:", error);
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({ error: error.message });
            }
            res.status(500).json({ error: "An unexpected error occurred while updating the project title." });
        }
    }

    async deleteProject(req, res) {
        const { projectId } = req.params;
        try {
            await projectService.deleteProject(projectId, req.userId);
            res.status(204).end();
        } catch (error) {
            console.error("Error deleting project:", error);
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({ error: error.message });
            }
            res.status(500).json({ error: "An unexpected error occurred while deleting the project." });
        }
    }
}

export default new ProjectController();

