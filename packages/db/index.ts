import { env } from "@weekday/env";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./drizzle/schema";

export const db = drizzle(env.DATABASE_URL, { schema });
export type DrizzleClient = typeof db;
export * from "./drizzle/schema";
export { schema };
