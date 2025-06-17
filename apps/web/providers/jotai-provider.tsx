"use client";

import { Provider } from "jotai";

type JotaiProviderProps = {
  children: React.ReactNode;
};

export function JotaiProvider({ children }: JotaiProviderProps) {
  return <Provider>{children}</Provider>;
}