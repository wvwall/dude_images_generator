import { AspectRatio, VideoResolution } from "../types";
import { api } from "./api";

export const generateImage = async (
  prompt: string,
  aspectRatio: AspectRatio,
  referenceImagesBase64?: string[],
  model:
    | "gemini-2.5-flash-image"
    | "gemini-3-pro-image-preview" = "gemini-2.5-flash-image"
): Promise<string> => {
  try {
    const res = await fetch(api.netlify.generateImage(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt,
        aspectRatio,
        referenceImagesBase64,
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
  image?: string,
  mimeType?: string,
  duration: number = 4,
  resolution: VideoResolution = "720p"
): Promise<{ operationName: string }> => {
  console.log("Generating video with prompt:", prompt, "duration:", duration, "resolution:", resolution);
  console.log(
    "Using image:",
    image ? "provided with mimeType " + mimeType : "none"
  );
  try {
    const res = await fetch(api.netlify.generateVideo(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, duration, image, mimeType, resolution }),
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
  const res = await fetch(api.netlify.checkVideoStatus(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ operationName }),
  });

  const contentType = res.headers.get("Content-Type");

  if (contentType === "video/mp4") {
    const buffer = await res.arrayBuffer();
    return {
      status: "completed",
      videoBuffer: buffer,
    };
  }

  return await res.json();
};

export const enhancePrompt = async (prompt: string): Promise<string> => {
  try {
    const res = await fetch(api.netlify.enhancePrompt(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`Server error: ${res.status} - ${txt}`);
    }

    const json = await res.json();
    if (!json || !json.enhancedPrompt) {
      throw new Error("No enhanced prompt in response");
    }

    return json.enhancedPrompt as string;
  } catch (error) {
    console.error("Error enhancing prompt:", error);
    throw error;
  }
};
