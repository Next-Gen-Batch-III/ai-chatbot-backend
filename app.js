import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import apiRoutes from "./routes/api.js";
import embeddingRoutes from "./routes/embedding.route.js";
import errorHandler from "./middlewares/errorHandler.js";
import notFoundHandler from "./middlewares/notFoundHandler.js";
import setupSwagger from "./swagger.js";

const app = express();

setupSwagger(app);
app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json());
app.use(clerkMiddleware());

app.get("/test", (req, res) => {
  res.json({ message: "Embedding service test endpoint is available." });
});

app.get("/.well-known/appspecific/com.chrome.devtools.json", (req, res) => {
  res.status(204).end();
});

// Embeddings are intentionally public for local development and do not pass
// through the authenticated API router below.
app.use("/api/embeddings", embeddingRoutes);
app.use("/api", apiRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
