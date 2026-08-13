import chatService from "./chat.service.js";
import { AppError } from "../../errors/index.js";

class ChatController {
    async getAIResponse(req, res) {
        const { prompt } = req.body;
    
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
    
        try {
            const response = chatService.createChat(prompt, req.userId);
        
            for await (const chunk of response) {
                res.write(`data: ${JSON.stringify(chunk)}\n\n`);
            }
        
            res.end();
        } catch (error) {
            console.error("Error in ChatController:", error);
        
            const statusCode = error instanceof AppError ? error.statusCode : 500;
            const message = error instanceof AppError ? error.message : "An internal server error occurred.";
        
            res.write(`data: ${JSON.stringify({ type: "error", message, status: statusCode })}\n\n`);
            res.end();
        }
    }

    async getAllChats(req, res) {
        const { limit, cursor, projectId } = req.query;
        try {
            const chats = await chatService.getAllChats(req.userId, {limit, cursor, projectId});
            res.status(200).json({ data: chats });
        } catch (error) {
            console.error("Error fetching all chats:", error);
            res.status(500).json({ error: "An error occurred while fetching chats." });
        }
    }

    async updateChat(req, res) {
        const { chatId } = req.params;
        const { title, projectId } = req.body;
        try {
            const updatedChat = await chatService.updateChat(chatId, req.userId, { title, projectId });
            res.status(200).json({ data: updatedChat });
        } catch (error) {
            console.error("Error updating chat:", error);
            if(error instanceof AppError) {
                return res.status(error.statusCode).json({ error: error.message });
            }
            res.status(500).json({ error: "An error occurred while updating the chat." });
        }
    }

    async togglePinChat(req, res) {
        const { chatId } = req.params;
        try {
            const updatedChat = await chatService.togglePinChat(chatId, req.userId);
            res.status(200).json({ data: updatedChat });
        } catch (error) {
            console.error("Error toggling pin status:", error);
            if(error instanceof AppError) {
                return res.status(error.statusCode).json({ error: error.message });
            }
            res.status(500).json({ error: "An error occurred while toggling the pin status." });
        }
    }

    async deleteChat(req, res) {
        const { chatId } = req.params;
        try {
            await chatService.deleteChat(chatId, req.userId);
            res.status(204).end();
        } catch (error) {
            console.error("Error deleting chat:", error);
            if(error instanceof AppError) {
                return res.status(error.statusCode).json({ error: error.message });
            }
            res.status(500).json({ error: "An error occurred while deleting the chat." });
        }
    }
}

export default new ChatController();