import fileService from "./file.service.js";

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
}

export default new FileController();