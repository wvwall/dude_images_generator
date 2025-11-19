import { GoogleGenAI } from "@google/genai";
import { AspectRatio } from "../types";

const apiKey = process.env.API_KEY || '';

export const generateImage = async (prompt: string, aspectRatio: AspectRatio): Promise<string> => {
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: aspectRatio,
      },
    });

    const generatedImage = response.generatedImages?.[0]?.image;

    if (!generatedImage || !generatedImage.imageBytes) {
      throw new Error("No image data returned from the API.");
    }

    const base64ImageBytes = generatedImage.imageBytes;
    return `data:image/jpeg;base64,${base64ImageBytes}`;
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};
