import { Router } from "express";
import authenticate from "../../middlewares/authenticate.js";
import chatController from "./chat.controller.js";

const router = Router();

router.post("/", chatController.getAIResponse);
router.post("/:chatId", chatController.getAIResponse);


export default router;