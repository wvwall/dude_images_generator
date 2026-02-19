import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY || "";

const buildSystemPrompt = (targetLength) => `You are a prompt refinement assistant for an AI image generator.
Your task is to improve a prompt by making it clearer and more specific, without changing its original intent.

Rules (strictly follow in order of priority):
1. NEVER change the core subject, scene, or main elements of the original prompt
2. NEVER add new subjects, locations, characters, or objects not implied by the original
3. Enhance ONLY what is already present: make vague words more precise, add natural details that flow directly from the original concept
4. You may add ONE or TWO specific visual details only if they are clearly consistent with the original scene
5. Use English for the enhanced prompt
6. IMPORTANT: Keep the enhanced prompt approximately ${targetLength} characters long (similar length to the original)
7. Do NOT add quotation marks around the result
8. Return only the enhanced prompt, no explanations

Think of your role as a careful editor, not a creative writer: sharpen what's there, don't reinvent it.`;

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
            text: `${systemPrompt}\n\nOriginal prompt (${originalLength} characters): "${prompt.trim()}"\n\nEnhanced version (same subject, more precise):`,
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
