import aiService from "../ai/ai.service.js";
import messageResponseMapper from "../message/messageResponse.mapper.js";
import prisma from "../../configs/db.js";
import { MessageType } from "@prisma/client";
import util from "util";

class ChatService {

    async getAIResponse(prompt, userId, chatId) {
        let newChatId = chatId;
        if(!chatId){
            try {
                const newChat = await prisma.chat.create({
                    data: {
                        userId: userId,
                        title: prompt.substring(0, 20) + '...',
                    },
                })
                newChatId = newChat.id;
            } catch (error) {
                console.error("Error creating new chat:", error);
                throw error;
            }
        }

        try {
            const chat = await prisma.chat.findUnique({
                where: { id: newChatId },
            });
            if (!chat) {
                throw new Error(`Chat not found.`);
            }
            const interactionId = await prisma.message.findFirst({
                where: { chatId: newChatId, type: MessageType.MODEL_OUTPUT },
                orderBy: { createdAt: 'desc' },
            }).then(message => message ? message.interactionId : null);
            const response = await aiService.generateResponse(prompt, interactionId);
            console.log({
                chatId_value: chatId,
                interactionId_value: response.id,      
            });
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
            console.error("Error in ChatService:", util.inspect(error, { depth: null, showHidden: false, colors: true }));
            throw error;
        }
    }
}

export default new ChatService();
        