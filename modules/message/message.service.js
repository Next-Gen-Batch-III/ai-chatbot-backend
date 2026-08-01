import aiService from "../ai/ai.service.js";
import messageResponseMapper from "../message/messageResponse.mapper.js";
import prisma from "../../configs/db.js";
import { MessageType } from "@prisma/client";
import util from "util";
import { NotFoundError, ForbiddenError } from "../../errors/index.js";
import chatService from "../chat/chat.service.js";


class MessageService {

    async *getAIResponse(prompt, userId, chatId) {
        const chat = await chatService.validateChat(chatId, userId);

        const prevInteractionId = await prisma.message.findFirst({
            where: { chatId: chatId, type: MessageType.MODEL_OUTPUT },
            orderBy: { createdAt: 'desc' },
        }).then(message => message ? message.interactionId : null);

        let content = '';
        let newInteractionId = null;

        const response = aiService.generateResponse(prompt, prevInteractionId);

        for await (const chunk of response) {
            newInteractionId = chunk.id || newInteractionId;
            
            if (chunk.type === "text") {
                content += chunk.content;
            }

            yield {
                ...chunk,
                chatId: chatId,
            };
        }

        await prisma.$transaction(async (tx) => {
            await tx.message.create({
                data: { chatId, type: MessageType.USER_INPUT, content: prompt },
            });
            await tx.message.create({
                data: { chatId, type: MessageType.MODEL_OUTPUT, content, interactionId: newInteractionId },
            });
            await tx.chat.update({
                where: { id: chatId },
                data: { lastMessageAt: new Date() },
            });
        });

        yield {
            status: "completed",
            chatId: chatId,
            chatTitle: chat.title,
        };
    }
}

export default new MessageService();