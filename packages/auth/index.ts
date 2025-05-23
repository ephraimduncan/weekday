import { cache } from "react";

import { betterAuth as betterAuthClient } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import {
  toNextJsHandler as betterAuthToNextJsHandler,
  nextCookies,
} from "better-auth/next-js";
import { headers } from "next/headers";

import { db, schema } from "@weekday/db";
import { env } from "@weekday/env";

const betterAuth = betterAuthClient({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: schema,
  }),
  databaseHooks: {
    account: {
      create: {
        async before(account) {
          console.log(account, "account");
        },
      },
    },
  },
  plugins: [nextCookies()],
  session: {
    expiresIn: 60 * 60 * 24 * 14,
    updateAge: 60 * 60 * 24,
  },
  socialProviders: {
    google: {
      accessType: "offline",
      clientId: env.BETTER_AUTH_GOOGLE_ID,
      clientSecret: env.BETTER_AUTH_GOOGLE_SECRET,
      scope: [
        "openid",
        "email",
        "profile",
        "https://www.googleapis.com/auth/calendar",
      ],
    },
  },
});

export const { handler } = betterAuth;
export const authInstance = betterAuth;
export const toNextJsHandler = betterAuthToNextJsHandler;

export const auth = cache(async () => {
  const session = await betterAuth.api.getSession({
    headers: await headers(),
  });
  return session;
});

export type Session = typeof betterAuth.$Infer.Session;
