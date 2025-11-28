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

  const { operationName } = body;

  console.log("Received operationName:", operationName);

  if (!operationName) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing operationName" }),
    };
  }

  try {
    // Usa l'API REST diretta invece della libreria SDK
    const url = `https://generativelanguage.googleapis.com/v1beta/${operationName}?key=${apiKey}`;

    console.log("Fetching operation status from:", url);

    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error:", errorText);
      throw new Error(`API request failed: ${response.status}`);
    }

    const operation = await response.json();

    console.log("Operation done:", operation.done);

    if (operation.done) {
      // Video pronto! La struttura corretta è generateVideoResponse.generatedSamples
      const videoData =
        operation.response?.generateVideoResponse?.generatedSamples?.[0]?.video;

      if (!videoData || !videoData.uri) {
        console.error(
          "Could not find video in response. Full response:",
          JSON.stringify(operation, null, 2)
        );
        throw new Error("No video URI found in completed operation");
      }

      console.log("Video ready! URI:", videoData.uri);

      // Download the video to a temporary file, following redirects and using the API key header
      try {
        const fileNameRaw = (operation.name || "video").split("/").pop();
        const fileName = `${fileNameRaw.replace(/[^\w.-]/g, "_")}.mp4`;
        const os = await import("os");
        const path = await import("path");
        const downloadsDir = path.join(os.homedir(), "Downloads");
        const filePath = path.join(downloadsDir, fileName);

        console.log("Downloading video to:", filePath);

        const downloadResponse = await fetch(videoData.uri, {
          headers: { "x-goog-api-key": apiKey },
          redirect: "follow",
        });

        if (!downloadResponse.ok) {
          const errText = await downloadResponse.text().catch(() => "");
          console.error(
            "Download failed:",
            downloadResponse.status,
            downloadResponse.statusText,
            errText
          );
          throw new Error(
            `Failed to download video: ${downloadResponse.status}`
          );
        }

        const fs = await import("fs");
        const { pipeline } = await import("stream/promises");

        await pipeline(downloadResponse.body, fs.createWriteStream(filePath));

        console.log("Video downloaded and saved to:", filePath);
      } catch (downloadError) {
        console.error("Error downloading video:", downloadError);
        // don't throw to avoid masking the higher-level handler catch; the response can still return the URI
      }

      return {
        statusCode: 200,
        body: JSON.stringify({
          status: "completed",
          videoUri: videoData.uri,
          videoName: operation.name,
        }),
      };
    } else {
      // Ancora in elaborazione
      const progress = operation.metadata?.progress || 0;
      console.log("Still processing, progress:", progress);

      return {
        statusCode: 200,
        body: JSON.stringify({
          status: "processing",
          progress: progress,
        }),
      };
    }
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
