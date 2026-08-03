import { Router } from "express";
import { createEmbedding } from "../controllers/embedding.controller.js";

const router = Router();

router.post("/", createEmbedding);

export default router;
