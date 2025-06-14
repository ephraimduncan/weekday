import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const accountRouter = createTRPCRouter({
  listDeviceSessions: protectedProcedure
    .output(z.array(z.object({
      id: z.string(),
      token: z.string(),
      active: z.boolean(),
      user: z.object({
        id: z.string(),
        name: z.string().nullable(),
        email: z.string(),
        image: z.string().nullable(),
      }),
      createdAt: z.date(),
    })))
    .query(async ({ ctx }) => {
      // For now, return current session as the only "device session"
      // In a full implementation, you'd query all sessions for this user
      return [{
        id: ctx.session.session.id,
        token: ctx.session.session.token,
        active: true,
        user: {
          id: ctx.session.user.id,
          name: ctx.session.user.name,
          email: ctx.session.user.email,
          image: ctx.session.user.image || null,
        },
        createdAt: ctx.session.session.createdAt,
      }];
    }),

  listAccounts: protectedProcedure
    .output(z.array(z.object({
      id: z.string(),
      email: z.string(),
      name: z.string().optional(),
      providerId: z.string(),
      createdAt: z.date(),
    })))
    .query(async ({ ctx }) => {
      const accounts = await ctx.db.query.account.findMany({
        where: (account, { eq }) => eq(account.userId, ctx.session.user.id),
        columns: {
          id: true,
          accountId: true,
          providerId: true,
          createdAt: true,
        },
      });

      return accounts.map(account => ({
        id: account.id,
        email: account.accountId, // Google account ID is usually the email
        name: undefined,
        providerId: account.providerId,
        createdAt: account.createdAt,
      }));
    }),
});