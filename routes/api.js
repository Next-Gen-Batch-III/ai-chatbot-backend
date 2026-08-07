import express from "express";
import checkRole from "../middlewares/checkRole.js";
import authenticate from "../middlewares/authenticate.js";
import chatRoutes from "../modules/chat/chat.route.js";
import systemPromptRoutes from "../modules/system-prompt/systemPrompt.route.js";
import fileRoutes from "../modules/file/file.route.js";
import projectRoutes from "../modules/project/project.route.js";
import { apiRateLimiter } from "../middlewares/rateLimit.js";

const router = express.Router();


router.use(authenticate);
router.use("/chats", apiRateLimiter, chatRoutes);
router.use("/projects", apiRateLimiter, projectRoutes);

router.use("/system-prompt", checkRole(["admin"]), apiRateLimiter, systemPromptRoutes);
router.use("/files", checkRole(["admin"]), apiRateLimiter, fileRoutes);


export default router;
