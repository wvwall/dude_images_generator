import { AspectRatio } from "../types";

export const generateImage = async (
  prompt: string,
  aspectRatio: AspectRatio,
  referenceImageBase64?: string,
  model:
    | "gemini-2.5-flash-image"
    | "gemini-3-pro-image-preview" = "gemini-2.5-flash-image"
): Promise<string> => {
  try {
    const res = await fetch("/.netlify/functions/generate-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt,
        aspectRatio,
        referenceImageBase64,
        model,
      }),
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
  prompt: string,
  duration: number = 5
): Promise<{ operationName: string }> => {
  try {
    const res = await fetch("/.netlify/functions/generate-video", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, duration }),
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

export const checkVideoStatus = async (operationName: string) => {
  const res = await fetch("/.netlify/functions/check-video-status", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ operationName }),
  });

  const contentType = res.headers.get("Content-Type");

  // Se il server sta restituendo un file video, leggi arraybuffer
  if (contentType === "video/mp4") {
    const buffer = await res.arrayBuffer();
    return {
      status: "completed",
      videoBuffer: buffer,
    };
  }

  return await res.json();
};
