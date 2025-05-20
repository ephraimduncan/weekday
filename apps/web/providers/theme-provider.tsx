"use client";

import {
  type ThemeProviderProps,
  ThemeProvider as NextThemesProvider,
} from "next-themes";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
