import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { useTheme } from "@/shared/lib/theme";

import { ThemeToggle } from "./theme-toggle";

vi.mock("@/shared/lib/theme", () => ({ useTheme: vi.fn<typeof useTheme>() }));

describe("ThemeToggle", () => {
  it("переключает тему по клику", async () => {
    const toggleTheme = vi.fn<() => void>();
    vi.mocked(useTheme).mockReturnValue({
      theme: "light",
      setTheme: vi.fn<(theme: "light" | "dark") => void>(),
      toggleTheme,
    });
    render(<ThemeToggle />);

    await userEvent.click(
      screen.getByRole("button", { name: "Переключить тему" }),
    );

    expect(toggleTheme).toHaveBeenCalledTimes(1);
  });
});
