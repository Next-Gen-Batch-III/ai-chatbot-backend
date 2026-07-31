import { Router } from "express";
import authenticate from "../../middlewares/authenticate.js";
import chatController from "./chat.controller.js";
import { chatRequestSchema, getAllChatSchema } from "./chat.schema.js";
import validateSchema from "../../middlewares/validateSchema.js";

const router = Router();

router.post("/", validateSchema(chatRequestSchema) , chatController.getAIResponse);
router.post("/:chatId",validateSchema(chatRequestSchema), chatController.getAIResponse);


export default router;