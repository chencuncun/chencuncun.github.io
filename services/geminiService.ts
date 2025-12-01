import { GoogleGenAI } from "@google/genai";
import { GenerationConfig } from "../types";

const apiKey = process.env.API_KEY || '';

// Initialize the client only if the key is present (handled in UI if missing)
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateImage = async (prompt: string, config: GenerationConfig): Promise<string> => {
  if (!ai) {
    throw new Error("API Key is missing.");
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: prompt }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: config.aspectRatio,
        }
      }
    });

    // Iterate through parts to find the image
    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    
    throw new Error("No image data found in response");

  } catch (error) {
    console.error("Gemini Image Generation Error:", error);
    throw error;
  }
};