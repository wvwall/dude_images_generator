import { GoogleGenAI } from "@google/genai";
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

  const { prompt, duration = 5 } = body;
  if (!prompt) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing prompt" }),
    };
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const finalPrompt = `Generate a video based on this description: ${prompt}. The video must be ${duration} seconds long.`;

    console.log("Starting video generation with prompt:", finalPrompt);

    // Only start the generation, DO NOT wait for completion
    const operation = await ai.models.generateVideos({
      model: "veo-3.1-generate-preview",
      prompt: finalPrompt,
    });

    console.log("Video generation started, operation name:", operation.name);

    // Immediately return the operation name for client-side polling
    return {
      statusCode: 200,
      body: JSON.stringify({
        operationName: operation.name,
        status: "started",
      }),
    };
  } catch (error) {
    console.error("Error starting video generation:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message || "Failed to start video generation",
      }),
    };
  }
};
