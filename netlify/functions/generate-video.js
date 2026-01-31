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

  const {
    prompt,
    image = null,
    duration = 4,
    mimeType = "image/png",
    aspectRatio = "16:9",
    resolution = "720p",
  } = body;

  // Validate prompt
  if (!prompt) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing prompt" }),
    };
  }

  // Validate duration: Gemini expects durationSeconds between 4 and 8 (inclusive)
  const durationNum = Number(duration);
  if (!Number.isFinite(durationNum) || durationNum < 4 || durationNum > 8) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error:
          "Invalid duration: `duration` must be a number between 4 and 8 (seconds).",
      }),
    };
  }
  const durationSeconds = Math.round(durationNum);

  const ai = new GoogleGenAI({ apiKey });

  try {
    const finalPrompt = `Generate a video based on this description: ${prompt}.`;

    console.debug("🚀 ~ Starting video generation with prompt:", finalPrompt);

    const base64StringImg = image?.includes("base64,")
      ? image.split("base64,")[1]
      : image;

    const configBody = {
      durationSeconds: durationSeconds,
      resolution: resolution,
      aspectRatio: aspectRatio,
    };

    console.debug("🚀 ~ handler ~ configBody:", configBody);

    // Build request parameters - only include image if provided
    const requestParams = {
      model: "veo-3.1-generate-preview",
      prompt: finalPrompt,
      config: configBody,
    };

    // Only add image if one was provided
    if (base64StringImg) {
      requestParams.image = {
        bytesBase64Encoded: base64StringImg,
        mimeType: mimeType,
      };
      console.debug("🚀 ~ Including reference image with mimeType:", mimeType);
    }

    // Only start the generation, DO NOT wait for completion
    const operation = await ai.models.generateVideos(requestParams);

    console.debug(
      "🚀 ~ Video generation started, operation name:",
      operation.name,
    );

    // Immediately return the operation name for client-side polling
    return {
      statusCode: 200,
      body: JSON.stringify({
        operationName: operation.name,
        status: "started",
      }),
    };
  } catch (error) {
    console.error("🚀 ~ Error starting video generation:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message || "Failed to start video generation",
      }),
    };
  }
};
