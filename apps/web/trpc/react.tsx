"use client";

import { useState } from "react";

import { type QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  type PersistedClient,
  type Persister,
  PersistQueryClientProvider,
} from "@tanstack/react-query-persist-client";
import { httpBatchStreamLink, loggerLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import { type inferRouterInputs, type inferRouterOutputs } from "@trpc/server";
import { type AppRouter } from "@weekday/api";
import { env } from "@weekday/env";
import { del as idbDel, get as idbGet, set as idbSet } from "idb-keyval";
import SuperJSON from "superjson";

import { createQueryClient } from "./query-client";

let clientQueryClientSingleton: QueryClient | undefined = undefined;

const getQueryClient = () => {
  if (typeof window === "undefined") {
    return createQueryClient();
  }
  clientQueryClientSingleton ??= createQueryClient();
  return clientQueryClientSingleton;
};

const createIDBPersister = (
  idbKey: IDBValidKey = "react-query",
): Persister => ({
  persistClient: async (client: PersistedClient) => {
    await idbSet(idbKey, client);
  },
  removeClient: async () => {
    await idbDel(idbKey);
  },
  restoreClient: async () => {
    return await idbGet<PersistedClient>(idbKey);
  },
});

export const api = createTRPCReact<AppRouter>();
export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;

export function TRPCReactProvider(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  const [trpcClient] = useState(() =>
    api.createClient({
      links: [
        loggerLink({
          enabled: (op) =>
            env.NODE_ENV === "development" ||
            (op.direction === "down" && op.result instanceof Error),
        }),
        httpBatchStreamLink({
          transformer: SuperJSON,
          url: getBaseUrl() + "/api/trpc",
          headers: () => {
            const headers = new Headers();
            headers.set("x-trpc-source", "nextjs-react");
            return headers;
          },
        }),
      ],
    }),
  );

  const noopPersister: Persister = {
    persistClient: async () => {},
    removeClient: async () => {},
    restoreClient: async () => undefined,
  };

  const [persister] = useState<Persister>(() =>
    typeof window === "undefined"
      ? noopPersister
      : createIDBPersister("weekday-calendar"),
  );

  return (
    <PersistQueryClientProvider
      onSuccess={() => {
        console.log("Persistence successful");
      }}
      client={queryClient}
      persistOptions={{
        buster: "v0.0.1",
        maxAge: 1000 * 60 * 60 * 24,
        persister,
      }}
    >
      <api.Provider client={trpcClient} queryClient={queryClient}>
        {props.children}

        <ReactQueryDevtools initialIsOpen={false} />
      </api.Provider>
    </PersistQueryClientProvider>
  );
}

function getBaseUrl() {
  if (typeof window !== "undefined") return window.location.origin;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}
