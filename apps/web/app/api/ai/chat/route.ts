import { smoothStream, streamText } from "ai";
import { v7 as uuidv7 } from "uuid";
import { z } from "zod";

import { auth } from "@weekday/auth";
import { models } from "@/lib/ai/models";
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

// Input validation schema
const chatRequestSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(["user", "assistant", "system"]),
    content: z.string().max(10000), // Reasonable limit
    parts: z.array(z.any()).optional(),
    id: z.string().optional(),
  })).max(50), // Limit conversation length
});

export async function POST(req: Request) {
  try {
    // SECURITY: Authenticate user before processing
    const session = await auth();
    if (!session?.user?.id) {
      return new Response("Unauthorized - Please log in to use the AI assistant", { 
        status: 401 
      });
    }

    // SECURITY: Validate and sanitize input
    const body = await req.json();
    const validatedInput = chatRequestSchema.parse(body);
    const { messages } = validatedInput;

    // SECURITY: Additional content filtering
    for (const message of messages) {
      if (typeof message.content === 'string') {
        // Basic prompt injection detection
        const suspiciousPatterns = [
          /ignore\s+(?:all\s+)?(?:previous\s+)?instructions/i,
          /forget\s+(?:all\s+)?(?:previous\s+)?instructions/i,
          /system\s*:\s*you\s+are/i,
          /act\s+as\s+(?:if\s+)?you\s+are/i,
        ];
        
        for (const pattern of suspiciousPatterns) {
          if (pattern.test(message.content)) {
            return new Response("Request contains potentially malicious content", { 
              status: 400 
            });
          }
        }
      }
    }

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
      model: models.google,
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

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Error in chat API:", error);
    
    // SECURITY: Don't expose internal errors
    if (error instanceof z.ZodError) {
      return new Response("Invalid request format", { status: 400 });
    }
    
    return new Response("An error occurred processing your request.", {
      status: 500,
    });
  }
}
