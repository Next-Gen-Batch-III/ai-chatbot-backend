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
}

export default new ChatController();