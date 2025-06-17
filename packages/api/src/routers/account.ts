import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { account, user } from "@weekday/db";

import { createTRPCRouter, protectedProcedure } from "../trpc";
import { getActiveAccount, getAllAccounts } from "../utils/accounts";

export const accountRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    const accounts = await getAllAccounts(ctx.session.user, ctx.headers);

    return {
      accounts,
    };
  }),

  setDefault: protectedProcedure
    .input(z.object({ accountId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const foundAccount = await ctx.db.query.account.findFirst({
        where: (table, { eq }) => eq(table.id, input.accountId),
      });

      if (!foundAccount) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Account not found",
        });
      }

      await ctx.db
        .update(user)
        .set({ defaultAccountId: input.accountId })
        .where(eq(user.id, ctx.session.user.id));
    }),

  getDefault: protectedProcedure.query(async ({ ctx }) => {
    const account = await getActiveAccount(ctx.session.user, ctx.headers);
    return { account };
  }),

  delete: protectedProcedure
    .input(z.object({ accountId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(account)
        .where(
          and(
            eq(account.id, input.accountId),
            eq(account.userId, ctx.session.user.id)
          )
        );

      const activeAccount = await getActiveAccount(
        ctx.session.user,
        ctx.headers
      );
      if (activeAccount.id === input.accountId) {
        await ctx.db
          .update(user)
          .set({ defaultAccountId: null })
          .where(eq(user.id, ctx.session.user.id));
      }
    }),
});
