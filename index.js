import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { clerkMiddleware, getAuth } from "@clerk/express";
import apiRoutes from "./routes/api.js";
import errorHandler from "./middlewares/errorHandler.js";
import notFoundHandler from "./middlewares/notFoundHandler.js";

dotenv.config();

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json());
app.use(clerkMiddleware());

const PORT = process.env.PORT || 5000;

app.use("/api", apiRoutes);


app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

