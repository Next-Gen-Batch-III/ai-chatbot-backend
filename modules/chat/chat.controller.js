import chatService from "./chat.service.js";

class ChatController {
    async getAIResponse(req, res) {
        const { prompt } = req.body;

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        try {
            const response = await chatService.getAIResponse(prompt, req.userId, req.params.chatId, res);
        } catch (error) {
            console.error("Error in ChatController:", error);
            res.status(500).json({ error: "An error occurred while processing your request." });
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
            res.status(error.statusCode || 500).json({ error: error.message || "An error occurred while fetching the chat." });
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
            res.status(error.statusCode || 500).json({ error: error.message || "An error occurred while updating the chat." });
        }
    }

    async deleteChat(req, res) {
        const { chatId } = req.params;
        try {
            await chatService.deleteChat(chatId, req.userId);
            res.status(204).send();
        } catch (error) {
            console.error("Error deleting chat:", error);
            res.status(error.statusCode || 500).json({ error: error.message || "An error occurred while deleting the chat." });
        }
    }
}

export default new ChatController();