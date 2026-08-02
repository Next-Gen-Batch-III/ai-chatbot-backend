import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { clerkMiddleware, getAuth } from "@clerk/express";
import apiRoutes from "./routes/api.js";
import errorHandler from "./middlewares/errorHandler.js";
import notFoundHandler from "./middlewares/notFoundHandler.js";
import setupSwagger from "./swagger.js";
import seedSystemPromptIfEmpty from "./configs/systemPromptSeed.js";

dotenv.config();

const app = express();
setupSwagger(app);

app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json());
app.use(clerkMiddleware());

const PORT = process.env.PORT || 5000;

app.get('/.well-known/appspecific/com.chrome.devtools.json', (req, res) => {
    res.status(204).end();
});

app.use("/api", apiRoutes);


app.use(notFoundHandler);
app.use(errorHandler);

const startServer = async () => {
    await seedSystemPromptIfEmpty();

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
    });
};

startServer();

