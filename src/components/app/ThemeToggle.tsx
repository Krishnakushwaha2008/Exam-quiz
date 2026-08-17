"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

/**
 * Theme toggle that avoids a `mounted` state (which would trigger the
 * `react-hooks/set-state-in-effect` rule). Instead we rely on next-themes
 * injecting the `dark` class on <html> before hydration, and use Tailwind's
 * `dark:` variant to switch icons — no hydration mismatch.
 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-9 w-9"
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      <Sun className="hidden h-4.5 w-4.5 dark:block" />
      <Moon className="block h-4.5 w-4.5 dark:hidden" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
