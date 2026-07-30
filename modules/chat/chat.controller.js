import chatService from "./chat.service.js";

class ChatController {
    async getAIResponse(req, res) {
        const { prompt } = req.body;
        try {
            const response = await chatService.getAIResponse(prompt, req.userId, req.params.chatId);
            res.json({ data: response });
        } catch (error) {
            console.error("Error in ChatController:", error);
            res.status(500).json({ error: "An error occurred while processing your request." });
        }
    }
}

export default new ChatController();