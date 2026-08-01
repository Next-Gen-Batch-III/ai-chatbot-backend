import messageService from "./message.service.js";
import { AppError } from "../../errors/index.js";
class MessageController {

    async getAIResponse(req, res) {
        try {
            const { chatId } = req.params;
            const { prompt } = req.body;

            res.setHeader('Content-Type', 'text/event-stream');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Connection', 'keep-alive');

            const response = messageService.getAIResponse(prompt, req.userId, chatId);

            for await (const chunk of response) {
                res.write(`data: ${JSON.stringify(chunk)}\n\n`);
            }

            res.end();
        } catch (error) {
            if(!res.headersSent) {
                if(error instanceof AppError) {
                    return res.status(error.statusCode).json({ error: error.message });
                }
            }
            if (error instanceof AppError) {
                res.write(`data: ${JSON.stringify({ type: "error", message: error.message, status: error.statusCode })}\n\n`);
            } else {
                res.write(`data: ${JSON.stringify({ type: "error", message: "An internal server error occurred.", status: 500 })}\n\n`);
            }
            res.end();
        }
    }

    async getAllMessages(req, res) {
        const { chatId } = req.params;
        try {
            const messages = await messageService.getAllMessages(chatId, req.userId);
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