import { renderHook } from "@testing-library/react";
import { useTheme as useNextTheme } from "next-themes";
import { describe, expect, it, vi } from "vitest";

import { useTheme } from "./use-theme";

vi.mock("next-themes", () => ({ useTheme: vi.fn<typeof useNextTheme>() }));

const mockNextTheme = (resolvedTheme: string | undefined) => {
  const setTheme = vi.fn<ReturnType<typeof useNextTheme>["setTheme"]>();
  vi.mocked(useNextTheme).mockReturnValue({
    resolvedTheme,
    themes: [],
    setTheme,
  });
  return setTheme;
};

const renderTheme = () => renderHook(() => useTheme()).result.current;

describe("useTheme", () => {
  it("возвращает светлую тему", () => {
    mockNextTheme("light");
    expect(renderTheme().theme).toBe("light");
  });

  it("возвращает тёмную тему", () => {
    mockNextTheme("dark");
    expect(renderTheme().theme).toBe("dark");
  });

  it("возвращает undefined, пока тема ещё не определена", () => {
    mockNextTheme(undefined);
    expect(renderTheme().theme).toBeUndefined();
  });

  it("не отдаёт системную тему наружу", () => {
    mockNextTheme("system");
    expect(renderTheme().theme).toBeUndefined();
  });

  it("ставит выбранную тему", () => {
    const setTheme = mockNextTheme("light");
    renderTheme().setTheme("dark");
    expect(setTheme).toHaveBeenCalledWith("dark");
  });

  it("переключает светлую тему на тёмную", () => {
    const setTheme = mockNextTheme("light");
    renderTheme().toggleTheme();
    expect(setTheme).toHaveBeenCalledWith("dark");
  });

  it("переключает тёмную тему на светлую", () => {
    const setTheme = mockNextTheme("dark");
    renderTheme().toggleTheme();
    expect(setTheme).toHaveBeenCalledWith("light");
  });
});
