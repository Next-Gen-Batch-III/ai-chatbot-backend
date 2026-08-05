import RAGService from "./rag.service.js";
import { AppError } from "../../errors/index.js";

class RAGController {
  async createEmbedding(req, res){
    const { fileId } = req.params;
    try {
      await RAGService.processFileEmbedding(fileId);
      return res.status(202).json({
        message: `Embedding process started for file ${fileId}.`,
      });
    } catch (error) {
      if(error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      res.status(500).json({ error: "An internal server error occurred while creating embedding." });
    }
  }
}

export default new RAGController();
