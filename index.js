import dotenv from "dotenv";
import app from "./app.js";
import seedSystemPromptIfEmpty from "./configs/systemPromptSeed.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await seedSystemPromptIfEmpty();

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
    });
};

startServer();

