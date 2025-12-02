import { GoogleGenAI } from "@google/genai";
import fs from "fs";

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

  const { operationName } = body;

  if (!operationName) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing operationName" }),
    };
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/${operationName}?key=${apiKey}`;

    const response = await fetch(url);
    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error:", errorText);
      throw new Error(`API request failed: ${response.status}`);
    }

    const operation = await response.json();

    if (!operation.done) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          status: "processing",
          progress: operation.metadata?.progress || 0,
        }),
      };
    }

    // Operazione completata → scarichiamo il video
    const videoData =
      operation.response?.generateVideoResponse?.generatedSamples?.[0]?.video;

    if (!videoData || !videoData.uri) {
      console.error("No video URI found in completed operation:", operation);
      throw new Error("No video URI found in completed operation");
    }

    const ai = new GoogleGenAI({ apiKey });

    // 🔥 Percorso corretto per Netlify / serverless
    const filePath = "/tmp/generated_video.mp4";

    // Scarica il file nella funzione serverless
    await ai.files.download({
      file: videoData,
      downloadPath: filePath,
    });

    // Leggi il file in buffer
    const fileBuffer = fs.readFileSync(filePath);

    // 🔥 Ritorna il video direttamente al browser
    return {
      statusCode: 200,
      isBase64Encoded: true,
      headers: {
        "Content-Type": "video/mp4",
        "Content-Disposition": "attachment; filename=generated_video.mp4",
      },
      body: fileBuffer.toString("base64"),
    };
  } catch (error) {
    console.error("Error checking video status:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        status: "failed",
        error: error.message || "Failed to check video status",
      }),
    };
  }
};
