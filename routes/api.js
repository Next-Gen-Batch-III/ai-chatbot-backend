import express from "express";
import checkRole from "../middlewares/checkRole.js";
import authenticate from "../middlewares/authenticate.js";
import chatRoutes from "../modules/chat/chat.route.js";
import systemPromptRoutes from "../modules/system-prompt/systemPrompt.route.js";
import fileRoutes from "../modules/file/file.route.js";
import projectRoutes from "../modules/project/project.route.js";
import allowedUserRoutes from "../modules/allowed-user/allowedUser.route.js";
import { apiRateLimiter } from "../middlewares/rateLimit.js";
import rateLimit from "express-rate-limit";

const router = express.Router();

router.use("/allowed-users", allowedUserRoutes);

router.use(authenticate);
router.use(apiRateLimiter);
router.use("/chats", chatRoutes);
router.use("/projects", projectRoutes);

router.use("/system-prompt", checkRole(["ADMIN"]), systemPromptRoutes);
router.use("/files", checkRole(["ADMIN"]), fileRoutes);


export default router;
