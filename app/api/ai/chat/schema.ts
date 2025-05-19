import { z } from "zod";

const TextBlockSchema = z.object({
  text: z
    .string()
    .describe(
      "Text reply to the user, can be a message to describe the code change",
    ),
  type: z.literal("text").describe("The type of the block, should be text"),
});

const CodeBlockSchema = z.object({
  fileName: z.string().describe("The name of the file to be changed"),
  type: z.literal("code").describe("The type of the block, should be code"),
  value: z
    .string()
    .describe(
      "The new or modified code for the file. Always include the full content of the file.",
    ),
});

const ResponseBlockSchema = z.discriminatedUnion("type", [
  TextBlockSchema,
  CodeBlockSchema,
]);

export const StreamReponseSchema = z
  .object({
    blocks: z
      .array(ResponseBlockSchema)
      .describe("Array of responses that can be text or code type"),
  })
  .describe("Generate a stream of text and code responses");
