import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY || "";

const buildSystemPrompt = (targetLength) => `You are a prompt enhancement assistant for an AI image generator.

Your task is to take a simple prompt and improve it with more descriptive details that will generate better images.

Guidelines:
- Add descriptive details (lighting, style, mood, colors, composition)
- Keep the original intent intact
- Use English for the enhanced prompt
- IMPORTANT: Keep the enhanced prompt approximately ${targetLength} characters long (similar length to the original)
- Don't add quotation marks around the result
- Don't include explanations, just return the enhanced prompt directly
- Focus on visual elements that AI image generators understand well
- If the original prompt is very short, you can expand slightly but stay concise`;

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
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid JSON" }),
    };
  }

  const { prompt } = body;
  if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing or invalid prompt" }),
    };
  }

  const ai = new GoogleGenAI({ apiKey });

  // Calculate target length - allow some expansion for very short prompts
  const originalLength = prompt.trim().length;
  const targetLength = Math.max(originalLength, 50); // minimum 50 chars for very short prompts
  const systemPrompt = buildSystemPrompt(targetLength);

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: {
        parts: [
          {
            text: `${systemPrompt}\n\nInput prompt (${originalLength} characters): ${prompt}\n\nEnhanced prompt:`,
          },
        ],
      },
    });

    const enhancedPrompt =
      response.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!enhancedPrompt) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "No enhanced prompt returned from API" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ enhancedPrompt }),
    };
  } catch (error) {
    console.error("enhance-prompt function error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Enhancement failed",
        details: String(error),
      }),
    };
  }
};
