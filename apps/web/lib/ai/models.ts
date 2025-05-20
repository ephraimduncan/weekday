import { anthropic } from "@ai-sdk/anthropic";
import { google } from "@ai-sdk/google";
import { openai } from "@ai-sdk/openai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { env } from "@weekday/env";

const openrouter = createOpenRouter({
  apiKey: env.OPENROUTER_API_KEY,
});

export const models = {
  anthropic: anthropic("claude-3-7-sonnet-latest"),
  google: google("gemini-2.5-flash-preview-04-17"),
  openai: openai("gpt-4.1"),
  openrouter: openrouter.chat("google/gemini-2.5-flash-preview-04-17"),
};
