import systemPromptService from "./systemPrompt.service.js";

class SystemPromptController {
    async getSystemPrompt(req, res) {
        try {
            const systemPrompt = await systemPromptService.getSystemPrompt();
            res.status(200).json({ data: systemPrompt });
        } catch (error) {
            console.error("Error fetching system prompt:", error);
            res.status(500).json({ error: "An error occurred while fetching the system prompt." });
        }
    }

    async updateSystemPrompt(req, res) {
        const { newPrompt } = req.body;
        try {
            const updatedPrompt = await systemPromptService.updateSystemPrompt(newPrompt);
            res.status(200).json({ data: updatedPrompt });
        } catch (error) {
            console.error("Error updating system prompt:", error);
            res.status(500).json({ error: "An error occurred while updating the system prompt." });
        }
    }
}

export default new SystemPromptController();