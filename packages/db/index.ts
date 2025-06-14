import { env } from "@weekday/env";
import { drizzle } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";
import * as schema from "./drizzle/schema";

export const db = drizzle(env.DATABASE_URL, { schema });
export type DrizzleClient = typeof db;
export * from "./drizzle/schema";
export { schema, eq };
