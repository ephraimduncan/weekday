import { handler } from "@weekday/auth";
// TODO: move this to auth package
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(handler);
