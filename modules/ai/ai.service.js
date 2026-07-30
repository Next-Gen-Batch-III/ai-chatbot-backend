import ai from "../../configs/aiClient.js";
import prisma from "../../configs/db.js";
import { MessageType } from "@prisma/client";

class AIService {
    async generateResponse(prompt, interactionId = null) {
        try {
            const res = await ai.interactions.create({
                model: "gemini-3.5-flash-lite",
                input: prompt,
                type: MessageType.USER_INPUT,
                previous_interaction_id: interactionId,
            })
            return res;
        } catch (error) {
            console.error("Error generating AI response:", error);
            throw error;
        }
    }
}

export default new AIService();