import "server-only";
import { cache } from "react";

import { authInstance as auth, type Session } from "@weekday/auth";
import { db } from "@weekday/db";

export const getCurrentUserAccount = cache(
  async (currentUser: Session["user"], requestHeaders: Headers) => {
    const primaryAccountId = currentUser?.defaultAccountId;

    if (primaryAccountId) {
      const selectedAccount = await db.query.account.findFirst({
        where: { userId: currentUser.id, id: primaryAccountId as string },
      });

      if (selectedAccount) {
        try {
          const tokenResponse = await auth.api.getAccessToken({
            body: {
              providerId: selectedAccount.providerId,
              accountId: selectedAccount.id,
              userId: selectedAccount.userId,
            },
            headers: requestHeaders,
          });

          return {
            ...selectedAccount,
            accessToken:
              tokenResponse.accessToken ?? selectedAccount.accessToken,
          };
        } catch (error) {
          console.error("Failed to refresh token:", error);
          return selectedAccount;
        }
      }
    }

    const fallbackAccount = await db.query.account.findFirst({
      where: { userId: currentUser.id },
      orderBy: { createdAt: "asc" },
    });

    if (!fallbackAccount) {
      throw new Error("User has no connected accounts");
    }

    return fallbackAccount;
  },
);

export const fetchUserAccountCollection = cache(
  async (currentUser: Session["user"], requestHeaders: Headers) => {
    const userAccountsList = await db.query.account.findMany({
      where: { userId: currentUser.id },
      orderBy: { createdAt: "desc" },
    });

    const enrichedAccountsList = await Promise.all(
      userAccountsList.map(async (accountRecord) => {
        try {
          const tokenResponse = await auth.api.getAccessToken({
            body: {
              providerId: accountRecord.providerId,
              accountId: accountRecord.id,
              userId: accountRecord.userId,
            },
            headers: requestHeaders,
          });

          return {
            ...accountRecord,
            accessToken: tokenResponse.accessToken ?? accountRecord.accessToken,
          };
        } catch (tokenError) {
          console.warn(
            `Token refresh failed for account ${accountRecord.id}:`,
            tokenError,
          );
          return accountRecord;
        }
      }),
    );

    const validAccountsList = enrichedAccountsList.filter((accountRecord) => {
      const hasValidTokens =
        accountRecord.accessToken && accountRecord.refreshToken;
      const hasValidProvider = accountRecord.providerId;
      return hasValidTokens && hasValidProvider;
    });

    return validAccountsList;
  },
);
