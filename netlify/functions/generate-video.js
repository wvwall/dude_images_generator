import { GoogleGenAI } from "@google/genai";
const apiKey = process.env.GEMINI_API_KEY || "";
const downloadDir = require("os").homedir() + "/Downloads";

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

  const { prompt, duration } = body;
  if (!prompt) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing prompt" }),
    };
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    // Using Gemini Pro Video model (gemini-1.5-pro-video).
    const finalPrompt = `Generate a video based on this description: ${prompt}. The video must be ${duration} seconds long.`;

    let operation = await ai.models.generateVideos({
      model: "veo-3.1-generate-preview",
      prompt: finalPrompt,
    });

    // Poll the operation status until the video is ready.
    while (!operation.done) {
      console.log("Waiting for video generation to complete...");
      await new Promise((resolve) => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({
        operation: operation,
      });
    }

    // Download the generated video.
    ai.files.download({
      file: operation.response.generatedVideos[0].video,
      downloadPath: downloadDir + "/generated_video.mp4",
    });
    return {
      statusCode: 200,
      body: JSON.stringify({ videoUrl }),
    };
  } catch (error) {
    console.error("Error generating video:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to generate video" }),
    };
  }
};
