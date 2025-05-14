import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { smoothStream, streamText } from "ai";
import { v7 as uuidv7 } from "uuid";

import { env } from "@/env";
import { systemPrompt } from "@/lib/ai/system-prompt";
import {
  createEvent,
  getEvent,
  getEvents,
  getFreeSlots,
  getNextUpcomingEvent,
  updateEvent,
} from "@/lib/ai/tools";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  try {
    const openrouter = createOpenRouter({
      apiKey: env.OPENROUTER_API_KEY,
    });

    const now = new Date();
    const currentDate = now.toISOString();
    const formattedDate = now.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      weekday: "long",
      year: "numeric",
    });
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const result = streamText({
      experimental_generateMessageId: uuidv7,
      experimental_transform: smoothStream({ chunking: "word" }),
      maxSteps: 25,
      messages,
      model: openrouter.chat("google/gemini-2.5-flash-preview"),
      system: systemPrompt({ currentDate, formattedDate, timezone }),
      tools: {
        createEvent,
        getEvent,
        getEvents,
        getFreeSlots,
        getNextUpcomingEvent,
        updateEvent,
      },
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Error in chat API:", error);
    return new Response("An error occurred processing your request.", {
      status: 500,
    });
  }
}
