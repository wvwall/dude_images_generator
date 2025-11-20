import { GoogleGenAI, Modality } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY || "";

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "GEMINI_API_KEY not configured on server",
      }),
    };
  }

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch (e) {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid JSON" }) };
  }

  const { prompt, aspectRatio } = body;
  if (!prompt) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing prompt" }),
    };
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const finalPrompt = `${prompt}. Create this image with an aspect ratio of ${aspectRatio}.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: { parts: [{ text: finalPrompt }] },
      config: { responseModalities: [Modality.IMAGE] },
    });

    const part = response.candidates?.[0]?.content?.parts?.[0];

    if (!part || !part.inlineData || !part.inlineData.data) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "No image data returned from API" }),
      };
    }

    const base64ImageBytes = part.inlineData.data;
    const mimeType = part.inlineData.mimeType || "image/png";
    const dataUri = `data:${mimeType};base64,${base64ImageBytes}`;

    return { statusCode: 200, body: JSON.stringify({ image: dataUri }) };
  } catch (error) {
    console.error("generate-image function error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Generation failed",
        details: String(error),
      }),
    };
  }
};
