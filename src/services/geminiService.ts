import { GoogleGenAI, Modality } from "@google/genai";
import { AspectRatio } from "../types";

const apiKey = process.env.GEMINI_API_KEY || "";

export const generateImage = async (
  prompt: string,
  aspectRatio: AspectRatio
): Promise<string> => {
  if (!apiKey) {
    throw new Error(
      "API Key is missing. Please check your environment configuration."
    );
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    // Nano Banana (gemini-2.5-flash-image) works best when aspect ratio instructions
    // are part of the natural language prompt.
    const finalPrompt = `${prompt}. Create this image with an aspect ratio of ${aspectRatio}.`;

    // Using the Nano Banana model (Flash Image)
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: {
        parts: [{ text: finalPrompt }],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    const part = response.candidates?.[0]?.content?.parts?.[0];

    if (!part || !part.inlineData || !part.inlineData.data) {
      throw new Error("No image data returned from the API.");
    }

    const base64ImageBytes = part.inlineData.data;
    // Note: inlineData.mimeType is usually available, but we construct the header here
    const mimeType = part.inlineData.mimeType || "image/png";

    return `data:${mimeType};base64,${base64ImageBytes}`;
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};
