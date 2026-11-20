import { useTheme as useNextTheme } from "next-themes";
import { useCallback } from "react";

export type Theme = "light" | "dark" | "system";

export type UseThemeResult = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

export const useTheme = (): UseThemeResult => {
  const { resolvedTheme, setTheme } = useNextTheme();

  const theme: Theme =
    resolvedTheme === "light" || resolvedTheme === "dark"
      ? resolvedTheme
      : "system";

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, setTheme]);

  return {
    theme,
    setTheme,
    toggleTheme,
  };
};
