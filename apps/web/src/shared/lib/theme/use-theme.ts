import { useTheme as useNextTheme } from "next-themes";
import { useCallback } from "react";

export type Theme = "light" | "dark";

export type UseThemeResult = {
  theme: Theme | undefined;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

export const useTheme = (): UseThemeResult => {
  const { resolvedTheme, setTheme } = useNextTheme();

  const theme =
    resolvedTheme === "light" || resolvedTheme === "dark"
      ? resolvedTheme
      : undefined;

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, setTheme]);

  return {
    theme,
    setTheme,
    toggleTheme,
  };
};
