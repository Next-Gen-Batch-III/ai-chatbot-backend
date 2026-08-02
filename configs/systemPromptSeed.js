import prisma from "./db.js";

const systemPromptSeed =
    "You must not complete assignments, write full reports, provide answers for exams, generate plagiarized content, provide misinformation, help build a full website. You must response politely if any above rule broken.";

const seedSystemPromptIfEmpty = async () => {
    const existingPrompt = await prisma.systemPrompt.findFirst({
        select: { content: true },
    });

    if (existingPrompt) {
        return existingPrompt.content;
    }

    const createdPrompt = await prisma.systemPrompt.create({
        data: {
            content: systemPromptSeed,
        },
        select: { content: true },
    });

    return createdPrompt.content;
};

export default seedSystemPromptIfEmpty;