import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import apiRoutes from "./routes/api.js";
import errorHandler from "./middlewares/errorHandler.js";
import notFoundHandler from "./middlewares/notFoundHandler.js";
import setupSwagger from "./swagger.js";

const app = express();

app.set("trust proxy", 1);
setupSwagger(app);
app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json());
app.use(clerkMiddleware());

app.get("/.well-known/appspecific/com.chrome.devtools.json", (req, res) => {
  res.status(204).end();
});

app.use("/api", apiRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
