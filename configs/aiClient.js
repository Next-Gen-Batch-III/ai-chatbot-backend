import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";


dotenv.config();
const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_AI_STUDIO_API_KEY,
});

export default ai;