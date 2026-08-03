import express from "express";
import checkRole from "../middlewares/checkRole.js";
import authenticate from "../middlewares/authenticate.js";
import chatRoutes from "../modules/chat/chat.route.js";
import systemPromptRoutes from "../modules/system-prompt/systemPrompt.route.js";

const router = express.Router();


router.get("/public/test", (req, res) => {
    res.json({ message: "This is a public endpoint." });
});

router.get("/private/test", authenticate, (req, res) => {
    res.json({ message: "This is a private endpoint." });
});

router.get("/admin/test", checkRole(["admin"]), (req, res) => {
    res.json({ message: "This is a private endpoint for admin users." });
});

router.use(authenticate);
router.use("/chats", chatRoutes);

router.use("/system-prompt", checkRole(["admin"]), systemPromptRoutes);


export default router;
