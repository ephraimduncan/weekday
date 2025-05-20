import { cache } from "react";

import { createHydrationHelpers } from "@trpc/react-query/rsc";
import { type AppRouter, createCaller } from "@weekday/api";
import { createTRPCContext } from "@weekday/api/src/trpc";
import { headers } from "next/headers";

import { createQueryClient } from "./query-client";

import "server-only";

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
const createContext = cache(async () => {
  const heads = new Headers(await headers());
  heads.set("x-trpc-source", "rsc");

  return createTRPCContext({
    headers: heads,
  });
});

const getQueryClient = cache(createQueryClient);
const caller = createCaller(createContext);

export const { HydrateClient, trpc: api } = createHydrationHelpers<AppRouter>(
  caller,
  getQueryClient,
);
