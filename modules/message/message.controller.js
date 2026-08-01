import messageService from "./message.service.js";

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
                return res.status(error.statusCode || 500).json(
                    { error: error.message || "An error occurred while processing your request." }
                );
            }

            res.write(`data: ${JSON.stringify({
                error: error.message || "An error occurred while processing your request."
            })}\n\n`);
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
            res.status(error.statusCode || 500).json({ error: error.message || "An error occurred while fetching messages." });
        }
    }
}

export default new MessageController();