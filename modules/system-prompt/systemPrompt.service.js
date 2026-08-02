import prisma from "../../configs/db.js";


class SystemPromptService {
    async getSystemPrompt() {
        try {
            const systemPrompt = await prisma.systemPrompt.findFirst({
                select: { content: true },
            });
            return systemPrompt?.content ?? "";
        } catch (error) {
            console.error("Error fetching system prompt:", error);
            throw error;
        }
    }

    async updateSystemPrompt(newPrompt) {
        try {
            const existingPrompt = await prisma.systemPrompt.upsert({
                where: { id: 1 },
                update: { content: newPrompt },
                create: { id: 1, content: newPrompt },
                select: { id: true, content: true },
            });
            return existingPrompt;
        } catch (error) {
            console.error("Error updating system prompt:", error);
            throw error;
        }
    }
}

export default new SystemPromptService();