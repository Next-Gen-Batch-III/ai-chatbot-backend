import aiService from "../ai/ai.service.js";
import messageResponseMapper from "../message/messageResponse.mapper.js";
import prisma from "../../configs/db.js";
import { MessageType } from "@prisma/client";
import util from "util";
import { NotFoundError, ForbiddenError, AppError } from "../../errors/index.js";
import chatService from "../chat/chat.service.js";
import RAGService from "../rag/rag.service.js";


class MessageService {

    async *getAIResponse(prompt, userId, chatId) {
        try {
            const chat = await chatService.validateChat(chatId, userId);

            const systemInstruction = await prisma.systemPrompt.findFirst({
                select: { content: true },
            });

            const contextChunks = await RAGService.getContext(prompt);

            const context = contextChunks.length > 0 ? contextChunks.join("\n\n") : "No relevant context found.";

            const finalSystemInstruction = `Role & Strict Instructions:
                                            - You are a helpful, direct AI assistant name NGEP Bot, Full name Next-Gen Engagement Program.
                                            - Use the Reference Context below to answer the user's question accurately.
                                            - CRITICAL: NEVER mention "based on the provided context", "according to the text", "the context provided", or "the documents". Speak directly and naturally as if you already know this information inherently.
                                            - If the required answer is not present in the Reference Context, answer using your general knowledge, or state simply that you do not know.

                                            Admin Instructions:
                                            ${systemInstruction?.content || ""}

                                            Reference Context:
                                            ${context}
                                            `.trim();


            const prevInteractionId = await prisma.message.findFirst({
                where: { chatId: chatId, type: MessageType.MODEL_OUTPUT },
                orderBy: { createdAt: 'desc' },
            }).then(message => message ? message.interactionId : null);

            let content = '';
            let newInteractionId = null;
            yield {
                type: "start",
                chatId: chatId,
                chatTitle: chat.title,
            }

            const response = aiService.generateResponse(prompt, finalSystemInstruction, prevInteractionId);

            for await (const chunk of response) {
                newInteractionId = chunk.id || newInteractionId;
                
                if (chunk.type === "text") {
                    content += chunk.content;
                }

                yield {
                    type: chunk.type,
                    content: chunk.content,
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
                type: "end",
                chatId: chatId,
                chatTitle: chat.title,
            };
        } catch (error) {
            console.error("Error in getAIResponse:", error);
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError("An unexpected error occurred while generating the AI response.", 500);
        }
    }

    async getMessagesByChatId(chatId, userId) {
        try {
            const chat = await chatService.validateChat(chatId, userId);

            const messages = await prisma.message.findMany({
                where: { chatId: chatId },
                orderBy: { createdAt: 'asc' },
                select: {
                    id: true,
                    type: true,
                    content: true,
                }
            });

            return messages;
        } catch (error) {
            console.error("Error fetching messages by chat ID:", error);
            if(error instanceof AppError) {
                throw error;
            }
            throw new AppError("An unexpected error occurred while fetching messages.", 500);
        }
    }
}

export default new MessageService();