// ✅ Import correct class
import { GoogleGenerativeAI } from "@google/generative-ai";

// ✅ Initialize Gemini client once with your API key
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// ✅ Function to send prompt and get AI response
export const sendPrompt = async (prompt: string) => {
  try {
    // ✅ Choose the correct model (gemini-1.5-flash is fastest)
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    // ✅ Send the prompt to Gemini
    const result = await model.generateContent(prompt);

    // ✅ Extract text safely
    const text = result?.response?.text();
    if (!text) throw new Error("No text returned from Gemini AI");

    return text;
  } catch (error) {
    console.error("Error in sendPrompt:", error);
    throw error;
  }
};
