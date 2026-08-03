import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const embed = new GoogleGenAI({
  apiKey: process.env.EMBED_API_KEY,
});

export default embed;
