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
        gcTime: 1000 * 60 * 60 * 24,
        networkMode: "offlineFirst",
        refetchInterval: 1000 * 60 * 5,
        refetchIntervalInBackground: true,
        refetchOnMount: true,
        refetchOnReconnect: true,
        refetchOnWindowFocus: true,
        staleTime: 1000 * 60 * 5,
      },
    },
  });
