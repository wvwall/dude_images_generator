import { AspectRatio } from "../types";

export const generateImage = async (
  prompt: string,
  aspectRatio: AspectRatio,
  referenceImageBase64?: string
): Promise<string> => {
  try {
    const res = await fetch("/.netlify/functions/generate-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, aspectRatio, referenceImageBase64 }),
    });

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`Server error: ${res.status} - ${txt}`);
    }

    const json = await res.json();
    if (!json || !json.image) throw new Error("No image in function response");

    return json.image as string;
  } catch (error) {
    console.error("Error generating image via function:", error);
    throw error;
  }
};

export const generateVideo = async (
  prompt: string
): Promise<{ operationName: string }> => {
  try {
    const res = await fetch("/.netlify/functions/generate-video", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`Server error: ${res.status} - ${txt}`);
    }
    const json = await res.json();
    if (!json || !json.operationName)
      throw new Error("No operationName in function response");
    return { operationName: json.operationName as string };
  } catch (error) {
    console.error("Error generating video via function:", error);
    throw error;
  }
};
