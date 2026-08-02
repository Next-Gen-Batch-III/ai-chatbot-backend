import messageService from "./message.service.js";
import { AppError } from "../../errors/index.js";
class MessageController {

    async getAIResponse(req, res) {
        const { chatId } = req.params;
        const { prompt } = req.body;

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        try {

            const response = messageService.getAIResponse(prompt, req.userId, chatId);

            for await (const chunk of response) {
                res.write(`data: ${JSON.stringify(chunk)}\n\n`);
            }

            res.end();
        } catch (error) {
            const statusCode = error instanceof AppError ? error.statusCode : 500;
            const message = error instanceof AppError ? error.message : "An internal server error occurred.";
        
            res.write(`data: ${JSON.stringify({ type: "error", message, status: statusCode })}\n\n`);
            res.end();
        }
    }

    async getAllMessages(req, res) {
        const { chatId } = req.params;
        try {
            const messages = await messageService.getMessagesByChatId(chatId, req.userId);
            res.status(200).json(messages);
        } catch (error) {
            console.error("Error fetching all messages:", error);
            if(error.statusCode === 500) {
                return res.status(500).json({ error: "An internal server error occurred while fetching messages." });
            }
            res.status(error.statusCode).json({ error: error.message });
        }
    }
}

export default new MessageController();