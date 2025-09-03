import { db, eq, schema } from "@weekday/db";
import { env } from "@weekday/env";
import { betterAuth as betterAuthClient } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import {
  toNextJsHandler as betterAuthToNextJsHandler,
  nextCookies,
} from "better-auth/next-js";
import { multiSession } from "better-auth/plugins";
import { headers } from "next/headers";
import { cache } from "react";

const betterAuth = betterAuthClient({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: schema,
  }),
  databaseHooks: {
    account: {
      create: {
        async after(account) {
          if (account.providerId === "google" && !account.refreshToken) {
            try {
              await db
                .delete(schema.account)
                .where(eq(schema.account.id, account.id));
              console.warn(
                `🔄 Removed Google account ${account.id} without refresh token`,
              );
            } catch (error) {
              console.error(
                `❌ Failed to remove problematic account ${account.id}:`,
                error,
              );
            }
            return;
          }

          if (account.accessToken && account.refreshToken) {
            try {
              await db
                .update(schema.user)
                .set({
                  defaultAccountId: account.id,
                })
                .where(eq(schema.user.id, account.userId));
            } catch (error) {
              console.error(
                `❌ Failed to set default account ${account.id}:`,
                error,
              );
            }
          }
        },
      },
    },
  },
  plugins: [
    nextCookies(),
    multiSession({
      maximumSessions: 10,
    }),
  ],
  session: {
    expiresIn: 60 * 60 * 24 * 14,
    updateAge: 60 * 60 * 24,
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,
    },
  },
  rateLimit: {
    enabled: true,
    window: 60,
    max: 10,
  },
  socialProviders: {
    google: {
      clientId: env.BETTER_AUTH_GOOGLE_ID,
      clientSecret: env.BETTER_AUTH_GOOGLE_SECRET,
      accessType: "offline",
      prompt: "consent",
      scope: [
        "openid",
        "email",
        "profile",
        "https://www.googleapis.com/auth/calendar",
      ],
      authorizationUrlParams: {
        include_granted_scopes: "true",
      },
      mapProfileToUser: (profile) => ({
        name: profile.name || "",
        email: profile.email || "",
        image: profile.picture,
      }),
    },
  },
  updateAccountOnSignIn: true,
  user: {
    additionalFields: {
      defaultAccountId: {
        type: "string",
        required: false,
        input: false,
      },
    },
  },
  account: {
    accountLinking: {
      enabled: true,
      allowDifferentEmails: true,
      trustedProviders: ["google"],
      autoLink: true,
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
export type User = typeof betterAuth.$Infer.Session.user;
