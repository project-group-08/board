"use client";

import { Moon, Sun } from "lucide-react";

import { useTheme } from "@/shared/lib/theme";
import { IconButton } from "@/shared/ui/icon-button";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { toggleTheme } = useTheme();

  return (
    <IconButton
      aria-label="Переключить тему"
      className={className}
      onClick={toggleTheme}
    >
      <Moon className="dark:hidden" />
      <Sun className="hidden dark:block" />
    </IconButton>
  );
}
