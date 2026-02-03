"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

const THEME_STORAGE_KEY = "theme";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY) as
      | Theme
      | null;

    if (storedTheme === "light" || storedTheme === "dark") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTheme(storedTheme);
      document.documentElement.classList.toggle("dark", storedTheme === "dark");
      document.documentElement.classList.toggle("light", storedTheme === "light");
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      const initialTheme: Theme = prefersDark ? "dark" : "light";
      setTheme(initialTheme);
      document.documentElement.classList.toggle("dark", initialTheme === "dark");
      document.documentElement.classList.toggle(
        "light",
        initialTheme === "light"
      );
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.classList.toggle("light", theme === "light");
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const handleToggle = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label="Toggle dark mode"
      className="rounded-full p-2 bg-gray-200 dark:bg-gray-900 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-800 h-9 w-9 flex items-center justify-center transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-500"
    >
      <span className="sr-only">Toggle theme</span>
      <div className="relative h-5 w-5">
        {/* 🌙 Moon Icon */}
        <svg
          className={`absolute inset-0 h-5 w-5 transition-all duration-500 ${
            !isDark
              ? "rotate-0 scale-100 opacity-100"
              : "rotate-90 scale-0 opacity-0"
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
        {/* ☀️ Sun Icon */}
        <svg
          className={`absolute inset-0 h-5 w-5 transition-all duration-500 ${
            isDark
              ? "rotate-0 scale-100 opacity-100"
              : "-rotate-90 scale-0 opacity-0"
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
      </div>
    </button>
  );
}

