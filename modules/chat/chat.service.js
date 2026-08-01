import aiService from "../ai/ai.service.js";
import messageResponseMapper from "../message/messageResponse.mapper.js";
import prisma from "../../configs/db.js";
import { MessageType } from "@prisma/client";
import util from "util";
import messageService from "../message/message.service.js";
import { NotFoundError, ForbiddenError } from "../../errors/index.js";

class ChatService {

    async validateChat(chatId, userId) {
        const chat = await prisma.chat.findUnique({
            where: { id: chatId },
        });
        if (!chat) {
            throw new NotFoundError("Chat not found.");
        }
        if (chat.userId !== userId) {
            throw new ForbiddenError("You do not have permission to access this chat.");
        }
        return chat;
    }
    
    async *createChat(userId, prompt) {
        const chat = await prisma.chat.create({
            data: {
                userId: userId,
            },
        });

        let newInteractionId = null;
        yield* messageService.getAIResponse(prompt, userId, chat.id);
    }

    async getAllChats(userId) {
        try {
            const chats = await prisma.chat.findMany({
                where: { userId: userId },
                orderBy: { createdAt: 'desc' },
            });
            return chats.map(chat => ({
                chatId: chat.id,
                title: chat.title,
                lastMessageAt: chat.lastMessageAt,
            }));
        } catch (error) {
            console.error("Error fetching all chats:", error);
            throw error;
        }
    }

    async updateChat(chatId, userId, updateData) {
        const chat = prisma.chat.update({
            where: { id: chatId, userId: userId },
            data: updateData,
        });

        return { chatId: chat.id, title: chat.title };
    }

    async deleteChat(chatId, userId) {
        const chat = await this.validateChat(chatId, userId);
        await prisma.chat.delete({
            where: { id: chatId },
        });
        return;
    }
}

export default new ChatService();
        