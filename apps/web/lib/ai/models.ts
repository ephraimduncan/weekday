import { google } from "@ai-sdk/google";
import { openai } from "@ai-sdk/openai";

export const models = {
  google: google("gemini-2.5-flash"),
  openai: openai("gpt-4.1"),
};
