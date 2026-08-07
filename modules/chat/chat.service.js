

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

    async getAllChats(userId, { limit = 20, cursor, projectId} = {}) {
        if(projectId && projectId === 'null') {
            projectId = null;
        }
        try {
            const [pinnedChats, chats] = await Promise.all([
                !cursor ? prisma.chat.findMany({
                      where: { userId, isPinned: true , ...(projectId !== undefined ? { projectId } : {})},
                      orderBy: { lastMessageAt: 'desc' },
                      select: { id: true, title: true, isPinned: true, lastMessageAt: true },
                }) : [],
                prisma.chat.findMany({
                    where: { 
                        userId, 
                        isPinned: false,
                        ...(projectId !== undefined ? { projectId } : {}),
                        ...(cursor ? { lastMessageAt: { lt: new Date(cursor) } } : {})
                     },
                    orderBy: { lastMessageAt: 'desc' },
                    select: { id: true, title: true, isPinned: true, lastMessageAt: true },
                    take: limit + 1,
                }),
            ]);

            let nextCursor = null;
            if (chats.length > limit) {
                chats.pop();
                nextCursor = chats[chats.length - 1].lastMessageAt;
            }

            return {
                chats: [...pinnedChats, ...chats],
                nextCursor,
            };
        } catch (error) {
            console.error("Error fetching all chats:", error);
            throw error;
        }
    }

    async updateChat(chatId, userId, updateData) {
        if(updateData.projectId && updateData.projectId === 'null') {
            updateData.projectId = null;
        }
        const { title, projectId } = updateData;
        const updateFields = {};
        if (title !== undefined) {
            updateFields.title = title;
        }
        if (projectId !== undefined) {
            updateFields.projectId = projectId;
        }
        try {
            const chat = await this.validateChat(chatId, userId);
            const updatedChat = await prisma.chat.update({
                where: { id: chatId },
                data: updateFields,
                select: { id: true, title: true, isPinned: true, lastMessageAt: true },
            });

            return updatedChat;
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
        