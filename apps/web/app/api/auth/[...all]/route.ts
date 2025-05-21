import { handler, toNextJsHandler } from "@weekday/auth";

export const { GET, POST } = toNextJsHandler(handler);
