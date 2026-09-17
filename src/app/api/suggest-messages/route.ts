import { generateText } from "ai";
import { google } from "@ai-sdk/google";

export async function POST(req: Request) {
  try {
    console.log("=== SUGGEST MESSAGES API ===");

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return Response.json(
        {
          success: false,
          message: "Gemini API key is missing",
        },
        { status: 500 }
      );
    }

    const { prompt } = await req.json();

    const result = await generateText({
      model: google("gemini-3.6-flash"),
      prompt:
        "Generate exactly three friendly, open-ended questions " +
        "for an anonymous messaging platform. " +
        "Separate each question using ||. " +
        "Do not number them. " +
        "Avoid sensitive or personal topics.",
    });

    console.log("Generated text:", result.text);

    return Response.json({
      success: true,
      message: result.text,
    });
  } catch (error) {
    console.error("GEMINI ERROR:", error);

    return Response.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to generate suggestions",
      },
      { status: 500 }
    );
  }
}