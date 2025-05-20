"use client";

import { useId, useState } from "react";

import { RiMoonClearLine, RiSunLine } from "@remixicon/react";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const id = useId();
  const { setTheme, theme } = useTheme();
  const [system, setSystem] = useState(false);

  const smartToggle = () => {
    const prefersDarkScheme = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    if (theme === "system") {
      setTheme(prefersDarkScheme ? "light" : "dark");
      setSystem(false);
    } else if (
      (theme === "light" && !prefersDarkScheme) ||
      (theme === "dark" && prefersDarkScheme)
    ) {
      setTheme(theme === "light" ? "dark" : "light");
      setSystem(false);
    } else {
      setTheme("system");
      setSystem(true);
    }
  };

  return (
    <div className="flex flex-col justify-center">
      <input
        id={id}
        name="theme-toggle"
        className="peer sr-only"
        checked={system}
        onChange={smartToggle}
        aria-label="Toggle dark mode"
        type="checkbox"
      />
      <label
        className="text-muted-foreground/80 hover:text-foreground/80 rounded peer-focus-visible:border-ring peer-focus-visible:ring-ring/50 relative inline-flex size-8 cursor-pointer items-center justify-center transition-[color,box-shadow] outline-none peer-focus-visible:ring-[3px]"
        aria-hidden="true"
        htmlFor={id}
      >
        <RiSunLine size={20} className="dark:hidden" aria-hidden="true" />
        <RiMoonClearLine
          size={20}
          className="hidden dark:block"
          aria-hidden="true"
        />
        <span className="sr-only">Switch to system/light/dark version</span>
      </label>
    </div>
  );
}
