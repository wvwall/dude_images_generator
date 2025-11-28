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
    // Use the direct REST API instead of the SDK library
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
      // Video ready! The correct structure is generateVideoResponse.generatedSamples
      const videoData =
        operation.response?.generateVideoResponse?.generatedSamples?.[0]?.video;

      if (!videoData || !videoData.uri) {
        console.error(
          "Could not find video in response. Full response:",
          JSON.stringify(operation, null, 2)
        );
        throw new Error("No video URI found in completed operation");
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
      // Still processing
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
