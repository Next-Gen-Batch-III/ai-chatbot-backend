import fileService from "./file.service.js";
import { AppError } from "../../errors/index.js";

class FileController {
    async uploadFile(req, res) {
        try {
            const file = req.file;
            const fileRecord = await fileService.uploadFile(file);
            res.status(201).json({ data: fileRecord });
        } catch (error) {
            console.error("Error uploading file:", error);
            res.status(500).json({ error: "An error occurred while uploading the file." });
        }
    }

    async getFile(req, res) {
        try {
            const files = await fileService.getFile();
            res.status(200).json({ data: files });
        } catch (error) {
            console.error("Error fetching files:", error);
            res.status(500).json({ error: "An error occurred while fetching files." });
        }
    }

    async deleteFile(req, res) {
        const { fileId } = req.params;
        try {
            await fileService.deleteFile(fileId);
            res.status(204).end();
        } catch (error) {
            console.error("Error deleting file:", error);
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({ error: error.message });
            }
            res.status(500).json({ error: "An error occurred while deleting the file." });
        }
    }
}

export default new FileController();