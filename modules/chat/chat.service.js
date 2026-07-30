import aiService from "../ai/ai.service.js";
import messageResponseMapper from "../message/messageResponse.mapper.js";
import prisma from "../../configs/db.js";
import { MessageType } from "@prisma/client";

class ChatService {

    async getAIResponse(prompt, userId, chatId) {
        let newChatId = chatId;
        if(!chatId){
            const newChat = await prisma.chat.create({
                data: {
                    userId: userId,
                    title: prompt.substring(0, 20) + '...',
                },
            })
            newChatId = newChat.id;
        }
        try {
            const response = await aiService.generateResponse(prompt);
            const newMessage = await prisma.message.create({
                data: {
                    chatId: newChatId,
                    type: MessageType.USER_INPUT,
                    content: prompt,
                },
            });
            const aiMessage = await prisma.message.create({
                data: {
                    chatId: newChatId,
                    type: MessageType.MODEL_OUTPUT,
                    content: response.output_text,
                    interactionId: response.id || null,
                },
            });
            return { response: messageResponseMapper(response), chatId: newChatId };
        } catch (error) {
            console.error("Error in ChatService:", error);
            throw error;
        }
    }
}

export default new ChatService();
        