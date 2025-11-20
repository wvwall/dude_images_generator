import { AspectRatio } from "../types";

export const generateImage = async (
  prompt: string,
  aspectRatio: AspectRatio
): Promise<string> => {
  try {
    const res = await fetch("/.netlify/functions/generate-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, aspectRatio }),
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
