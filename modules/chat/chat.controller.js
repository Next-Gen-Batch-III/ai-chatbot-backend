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
            if (!res.headersSent) {
                if (error instanceof AppError) {
                    return res.status(error.statusCode).json({ error: error.message });
                }
                return res.status(500).json({ error: "An internal server error occurred." });
            }
            if (error instanceof AppError) {
                res.write(`data: ${JSON.stringify({ type: "error", message: error.message, stats: error.statusCode })}\n\n`);
            } else {
                res.write(`data: ${JSON.stringify({ type: "error", message: "An internal server error occurred.", error: 500 })}\n\n`);
            }
            res.end();
        }
    }

    async getAllChats(req, res) {
        try {
            const chats = await chatService.getAllChats(req.userId);
            res.status(200).json(chats);
        } catch (error) {
            console.error("Error fetching all chats:", error);
            res.status(500).json({ error: "An error occurred while fetching chats." });
        }
    }

    async getChatById(req, res) {
        const { chatId } = req.params;
        try {
            const chat = await chatService.getChatById(chatId, req.userId);
            res.status(200).json(chat);
        } catch (error) {
            console.error("Error fetching chat by ID:", error);
            if(error instanceof AppError) {
                return res.status(error.statusCode).json({ error: error.message });
            }
            res.status(500).json({ error: "An error occurred while fetching the chat." });
        }
    }

    async updateChat(req, res) {
        const { chatId } = req.params;
        const { title } = req.body;
        try {
            const updatedChat = await chatService.updateChat(chatId, req.userId, { title });
            res.status(200).json(updatedChat);
        } catch (error) {
            console.error("Error updating chat:", error);
            if(error instanceof AppError) {
                return res.status(error.statusCode).json({ error: error.message });
            }
            res.status(500).json({ error: "An error occurred while updating the chat." });
        }
    }

    async deleteChat(req, res) {
        const { chatId } = req.params;
        try {
            await chatService.deleteChat(chatId, req.userId);
            res.status(204).send();
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