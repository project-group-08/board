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

  it("возвращает системную тему, пока она еще не определена", () => {
    mockNextTheme(undefined);
    expect(renderTheme().theme).toBe("system");
  });

  it("ставит выбранную тему", () => {
    const setTheme = mockNextTheme("light");
    renderTheme().setTheme("system");
    expect(setTheme).toHaveBeenCalledWith("system");
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
