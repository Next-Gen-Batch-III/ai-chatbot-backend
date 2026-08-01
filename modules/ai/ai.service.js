import ai from "../../configs/aiClient.js";
import prisma from "../../configs/db.js";
import { MessageType } from "@prisma/client";

class AIService {
    async *generateResponse(prompt, systemInstruction, prevIteractionId = null) {
        try {
            const res = await ai.interactions.create({
                model: "gemini-3.5-flash-lite",
                input: prompt,
                type: MessageType.USER_INPUT,
                previous_interaction_id: prevIteractionId,
                stream: true,
                system_instruction: systemInstruction,
                generation_config: {
                    thinking_summaries: "auto"
                }
            })
            let interactionId = null;

            for await (const event of res) {
                if (event.event_type === "interaction.created") {
                    interactionId = event.interaction?.id || event.interaction_id || null;
                }

                if (event.event_type === "step.delta") {
                    if (event.delta?.type === "thought_summary" || event.delta?.type === "thought") {
                        const thoughtText = event.delta.content?.text || event.delta.text || "";
                        if (thoughtText) {
                            yield {
                                id: interactionId,
                                type: "thought",
                                content: thoughtText,
                            };
                        }
                    }

                    if (event.delta?.type === "text") {
                        const outputText = event.delta.text || "";
                        if (outputText) {
                            yield {
                                id: interactionId,
                                type: "text",
                                content: outputText,
                            };
                        }
                    }
                }
            }
        } catch (error) {
            console.error("Error generating AI response:", error);
            throw error;
        }
    }
}

export default new AIService();