
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);


export const sendPrompt = async (prompt: string) => {
  try {
    
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const result = await model.generateContent(prompt);

    const text = result?.response?.text();
    if (!text) throw new Error("No text returned from Gemini AI");

    return text;
  } catch (error) {
    console.error("Error in sendPrompt:", error);
    throw error;
  }
};
