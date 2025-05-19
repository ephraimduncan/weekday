import { anthropic } from "@ai-sdk/anthropic";
import { google } from "@ai-sdk/google";
import { openai } from "@ai-sdk/openai";
import { openrouter } from "@openrouter/ai-sdk-provider";

export const models = {
  anthropic: anthropic("claude-3-7-sonnet-latest"),
  google: google("gemini-2.5-flash-preview-04-17"),
  openai: openai("gpt-4.1"),
  openrouter: openrouter("google/gemini-2.5-flash-preview-04-17"),
};
