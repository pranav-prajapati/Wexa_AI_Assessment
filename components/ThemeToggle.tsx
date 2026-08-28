"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  // Sync with the theme applied before hydration.
  useEffect(() => {
    const applied =
      document.documentElement.getAttribute("data-theme") === "light"
        ? "light"
        : "dark";

    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing to DOM state set by the pre-hydration theme script
    setTheme(applied);
  }, []);

  function toggleTheme() {
    const next = theme === "light" ? "dark" : "light";

    setTheme(next);

    if (next === "light") {
      document.documentElement.setAttribute("data-theme", "light");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }

    try {
      localStorage.setItem("theme", next);
    } catch {
      // localStorage can be unavailable.
    }
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={
        theme === "light" ? "Switch to dark theme" : "Switch to light theme"
      }
      className="fixed right-4 top-4 z-50 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-foreground-secondary transition hover:border-primary/40 hover:text-primary-light"
    >
      {theme === "light" ? "☾" : "☀"}
    </button>
  );
}