import {
  convertToModelMessages,
  smoothStream,
  stepCountIs,
  streamText,
} from "ai";
import { v7 as uuidv7 } from "uuid";

import { systemPrompt } from "@/lib/ai/system-prompt";
import {
  createEvent,
  createRecurringEvent,
  deleteEvent,
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
      experimental_transform: smoothStream({ chunking: "word" }),
      messages: await convertToModelMessages(messages),
      model: "anthropic/claude-haiku-4.5",
      stopWhen: stepCountIs(25),
      system: systemPrompt({ currentDate, formattedDate, timezone }),
      tools: {
        createEvent,
        createRecurringEvent,
        deleteEvent,
        getEvent,
        getEvents,
        getFreeSlots,
        getNextUpcomingEvent,
        updateEvent,
      },
      onError: (error) => {
        console.error("Error while streaming:", JSON.stringify(error, null, 2));
      },
    });

    return result.toUIMessageStreamResponse({
      generateMessageId: uuidv7,
      sendReasoning: true,
    });
  } catch (error) {
    console.error("Error in chat API:", error);
    return new Response("An error occurred processing your request.", {
      status: 500,
    });
  }
}
