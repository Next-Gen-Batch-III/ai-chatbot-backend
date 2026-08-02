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

    async togglePinChat(chatId, userId) {
        try {
            const chat = await this.validateChat(chatId, userId);
            const updatedChat = await prisma.chat.update({
                where: { id: chatId },
                data: { isPinned: !chat.isPinned },
                select: { id: true, isPinned: true, title: true, lastMessageAt: true },
            });
            return updatedChat;
        } catch (error) {
            console.error("Error toggling pin status:", error);
            throw error;
        }
    }
    
    async *createChat(prompt, userId) {
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
            const [pinnedChats, chats] = await Promise.all([
                prisma.chat.findMany({
                    where: { userId, isPinned: true },
                    orderBy: { lastMessageAt: 'desc' },
                    select: { id: true, title: true, isPinned: true, lastMessageAt: true },
                }),
                prisma.chat.findMany({
                    where: { userId, isPinned: false },
                    orderBy: { lastMessageAt: 'desc' },
                    select: { id: true, title: true, isPinned: true, lastMessageAt: true },
                }),
            ]);

            return {
                chats: [...pinnedChats, ...chats],
            };
        } catch (error) {
            console.error("Error fetching all chats:", error);
            throw error;
        }
    }

    async updateChat(chatId, userId, updateData) {
        try {
            const chat = await prisma.chat.update({
                where: { id: chatId, userId: userId },
                data: updateData,
            });

            return { chatId: chat.id, title: chat.title };
        } catch (error) {
            console.error("Error updating chat:", error);
            throw error;
        }
    }

    async deleteChat(chatId, userId) {
        try {
            const chat = await this.validateChat(chatId, userId);
            await prisma.chat.delete({
                where: { id: chatId },
            });
            return;
        } catch (error) {
            console.error("Error deleting chat:", error);
            throw error;
        }
    }
}

export default new ChatService();
        