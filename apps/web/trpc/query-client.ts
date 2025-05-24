import {
  defaultShouldDehydrateQuery,
  QueryClient,
} from "@tanstack/react-query";
import SuperJSON from "superjson";

export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      dehydrate: {
        serializeData: SuperJSON.serialize,
        shouldDehydrateQuery: (query) => defaultShouldDehydrateQuery(query),
      },
      hydrate: {
        deserializeData: SuperJSON.deserialize,
      },
      queries: {
        gcTime: 60 * 1000 * 60 * 24,
        networkMode: "offlineFirst",
        refetchInterval: 60 * 1000 * 60 * 24,
        refetchIntervalInBackground: true,
        refetchOnMount: "always",
        refetchOnReconnect: "always",
        refetchOnWindowFocus: "always",
        staleTime: 60 * 1000 * 60 * 24,
      },
    },
  });
