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
        gcTime: 24 * 60 * 60 * 1000,
        staleTime: 60 * 1000,
      },
    },
  });
