import { cache } from "react";

import { betterAuth as betterAuthClient } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import {
  toNextJsHandler as betterAuthToNextJsHandler,
  nextCookies,
} from "better-auth/next-js";
import { headers } from "next/headers";
import { multiSession } from "better-auth/plugins";

import { db, schema, eq } from "@weekday/db";
import { env } from "@weekday/env";

const betterAuth = betterAuthClient({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: schema,
  }),
  databaseHooks: {
    account: {
      create: {
        async after(account, ctx) {
          if (account.providerId === "google" && !account.refreshToken) {
            try {
              await db
                .delete(schema.account)
                .where(eq(schema.account.id, account.id));
            } catch (error) {
              console.error(
                `❌ Failed to remove problematic account ${account.id}:`,
                error
              );
            }
            return;
          }

          if (account.accessToken && account.refreshToken) {
            const provider = ctx?.context.socialProviders.find(
              (p) => p.id === account.providerId
            );

            if (provider) {
              const info = await provider.getUserInfo({
                accessToken: account.accessToken,
                refreshToken: account.refreshToken,
                scopes: account.scope?.split(",") ?? [],
                idToken: account.idToken ?? undefined,
              });

              if (info?.user) {
                await db.transaction(async (tx) => {
                  await tx
                    .update(schema.account)
                    .set({
                      name: info.user.name || "",
                      email: info.user.email || "",
                      image: info.user.image,
                    })
                    .where(eq(schema.account.id, account.id));

                  await tx
                    .update(schema.user)
                    .set({
                      defaultAccountId: account.id,
                    })
                    .where(eq(schema.user.id, account.userId));
                });
              }
            }
          }
        },
      },
      update: {
        async after(account, ctx) {
          if (
            account.providerId === "google" &&
            account.accessToken &&
            account.refreshToken
          ) {
            // Check if account needs user info update
            const existingAccount = await db.query.account.findFirst({
              where: eq(schema.account.id, account.id),
            });

            if (
              existingAccount &&
              (!existingAccount.name || !existingAccount.email)
            ) {
              const provider = ctx?.context.socialProviders.find(
                (p) => p.id === account.providerId
              );

              if (provider) {
                const info = await provider.getUserInfo({
                  accessToken: account.accessToken,
                  refreshToken: account.refreshToken,
                  scopes: account.scope?.split(",") ?? [],
                  idToken: account.idToken ?? undefined,
                });

                if (info?.user) {
                  await db
                    .update(schema.account)
                    .set({
                      name: info.user.name || "",
                      email: info.user.email || "",
                      image: info.user.image,
                    })
                    .where(eq(schema.account.id, account.id));
                }
              }
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
      redirectUrlParams: {
        access_type: "offline",
        prompt: "consent",
        include_granted_scopes: "true",
      },
      prompt: "consent",
      extraParams: {
        access_type: "offline",
        prompt: "consent",
        include_granted_scopes: "true",
      },
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
