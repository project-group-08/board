import { act, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { SiteHeader } from ".";

function example(preventEscape = false) {
  return (
    <SiteHeader
      brand={<a href="#home">Название</a>}
      navigationLabel="Навигация"
      navigation={<a href="#desktop">Десктоп</a>}
      actions={<button>Действие</button>}
      themeAction={<button>Тема</button>}
      mobileNavigation={
        <a href="#mobile">
          <span>Мобильная ссылка</span>
        </a>
      }
      mobileActions={
        <>
          <button>Мобильное действие</button>
          <input
            aria-label="Вложенное поле"
            onKeyDown={(event) => {
              if (preventEscape && event.key === "Escape")
                event.preventDefault();
            }}
          />
        </>
      }
      mobileThemeAction={<button>Мобильная тема</button>}
    />
  );
}

beforeEach(() => {
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
    bottom: 64,
  } as DOMRect);
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("SiteHeader", () => {
  it("preserves desktop navigation, order, semantics and supplied mouse and keyboard actions", async () => {
    const user = userEvent.setup();
    const theme = vi.fn<() => void>();
    const start = vi.fn<() => void>();
    const link = vi.fn<(event: React.MouseEvent<HTMLAnchorElement>) => void>(
      (event) => event.preventDefault(),
    );
    const { container } = render(
      <SiteHeader
        brand={<a href="#home">Название</a>}
        navigationLabel="Основная навигация"
        navigation={
          <ul>
            <li>
              <a href="#features" onClick={link}>
                Возможности
              </a>
            </li>
            <li>
              <a href="#faq">Вопросы</a>
            </li>
          </ul>
        }
        themeAction={<button onClick={theme}>Тема</button>}
        actions={
          <>
            <a href="#login">Войти</a>
            <button onClick={start}>Начать</button>
          </>
        }
        mobileNavigation={<a href="#mobile">Мобильная ссылка</a>}
        mobileActions={<button>Мобильное действие</button>}
        mobileThemeAction={<button>Мобильная тема</button>}
      />,
    );
    const header = screen.getByRole("banner");
    const nav = within(header).getByRole("navigation", {
      name: "Основная навигация",
    });
    expect(
      within(nav)
        .getAllByRole("link")
        .map((item) => item.textContent),
    ).toEqual(["Возможности", "Вопросы"]);
    expect(
      Array.from(header.querySelectorAll("a, button")).map(
        (node) => node.getAttribute("aria-label") || node.textContent,
      ),
    ).toEqual([
      "Название",
      "Возможности",
      "Вопросы",
      "Тема",
      "Войти",
      "Начать",
      "Открыть меню",
    ]);
    expect(
      container.querySelector("a a, a button, button a, button button"),
    ).toBeNull();
    const navLink = within(nav).getByRole("link", { name: "Возможности" });
    expect(navLink).toHaveAttribute("href", "#features");
    await user.click(navLink);
    expect(link).toHaveBeenCalledOnce();
    await user.click(screen.getByRole("button", { name: "Тема" }));
    expect(theme).toHaveBeenCalledOnce();
    await user.tab();
    expect(screen.getByRole("link", { name: "Войти" })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole("button", { name: "Начать" })).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(start).toHaveBeenCalledOnce();
  });

  it("keeps the desktop content and starts with a closed compact menu", () => {
    render(example());
    const header = screen.getByRole("banner");
    expect(
      within(header).getByRole("link", { name: "Десктоп" }),
    ).toHaveAttribute("href", "#desktop");
    expect(
      screen.getByRole("button", { name: "Действие" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Тема" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Открыть меню" }),
    ).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText("Мобильная ссылка")).not.toBeInTheDocument();
    expect(header.querySelector("nav")).toHaveClass("hidden", "lg:block");
  });

  it("opens and closes by button, Escape, outside pointer, and a nested link", async () => {
    vi.stubGlobal("innerWidth", 390);
    const user = userEvent.setup();
    render(
      <>
        <button>Снаружи</button>
        {example()}
      </>,
    );
    const open = async () =>
      user.click(screen.getByRole("button", { name: "Открыть меню" }));
    await open();
    expect(
      screen.getByRole("button", { name: "Закрыть меню" }),
    ).toHaveAttribute("aria-expanded", "true");
    await user.click(
      screen.getByRole("button", { name: "Мобильное действие" }),
    );
    await user.click(screen.getByRole("button", { name: "Мобильная тема" }));
    expect(screen.getByText("Мобильная ссылка")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Закрыть меню" }));
    await open();
    await user.keyboard("{Escape}");
    expect(screen.getByRole("button", { name: "Открыть меню" })).toHaveFocus();
    await open();
    await user.click(screen.getByRole("button", { name: "Снаружи" }));
    expect(screen.queryByText("Мобильная ссылка")).not.toBeInTheDocument();
    await open();
    await user.click(screen.getByText("Мобильная ссылка"));
    expect(screen.queryByText("Мобильная ссылка")).not.toBeInTheDocument();
    vi.unstubAllGlobals();
  });

  it("closes at 1024 and stays closed after returning to 1023", async () => {
    vi.stubGlobal("innerWidth", 1023);
    const user = userEvent.setup();
    render(example());
    await user.click(screen.getByRole("button", { name: "Открыть меню" }));
    act(() => {
      vi.stubGlobal("innerWidth", 1024);
      fireEvent.resize(window);
    });
    expect(screen.queryByText("Мобильная ссылка")).not.toBeInTheDocument();
    act(() => {
      vi.stubGlobal("innerWidth", 1023);
      fireEvent.resize(window);
    });
    expect(
      screen.getByRole("button", { name: "Открыть меню" }),
    ).toHaveAttribute("aria-expanded", "false");
    vi.unstubAllGlobals();
  });

  it("does not steal focus from an outside field on Escape", async () => {
    vi.stubGlobal("innerWidth", 390);
    const user = userEvent.setup();
    render(
      <>
        {example()}
        <input aria-label="Снаружи" />
      </>,
    );
    await user.click(screen.getByRole("button", { name: "Открыть меню" }));
    screen.getByRole("button", { name: "Мобильная тема" }).focus();
    await user.tab();
    const outside = screen.getByRole("textbox", { name: "Снаружи" });
    expect(outside).toHaveFocus();
    await user.keyboard("{Escape}abc");
    expect(outside).toHaveFocus();
    expect(outside).toHaveValue("abc");
    expect(screen.queryByText("Мобильная ссылка")).not.toBeInTheDocument();
  });

  it("respects Escape handled by a nested control and restores focus on unhandled Escape", async () => {
    vi.stubGlobal("innerWidth", 390);
    const user = userEvent.setup();
    const { rerender } = render(example(true));
    await user.click(screen.getByRole("button", { name: "Открыть меню" }));
    const field = screen.getByRole("textbox", { name: "Вложенное поле" });
    await user.click(field);
    await user.keyboard("{Escape}");
    expect(field).toHaveFocus();
    expect(
      screen.getByRole("button", { name: "Закрыть меню" }),
    ).toHaveAttribute("aria-expanded", "true");
    rerender(example());
    await user.keyboard("{Escape}");
    expect(screen.getByRole("button", { name: "Открыть меню" })).toHaveFocus();
  });

  it("keeps the panel open while the header is partly visible and closes when it leaves the viewport", async () => {
    vi.stubGlobal("innerWidth", 390);
    vi.stubGlobal("innerHeight", 500);
    const rect = vi.spyOn(HTMLElement.prototype, "getBoundingClientRect");
    const user = userEvent.setup();
    render(example());
    await user.click(screen.getByRole("button", { name: "Открыть меню" }));
    rect.mockReturnValue({ bottom: 1 } as DOMRect);
    fireEvent.scroll(window);
    const panel = document.getElementById(
      screen
        .getByRole("button", { name: "Закрыть меню" })
        .getAttribute("aria-controls")!,
    );
    expect(panel).toHaveStyle({ maxHeight: "483px" });
    expect(
      within(panel!).getByRole("link", { name: "Мобильная ссылка" }),
    ).toBeInTheDocument();
    rect.mockReturnValue({ bottom: 0 } as DOMRect);
    fireEvent.scroll(window);
    expect(screen.queryByText("Мобильная ссылка")).not.toBeInTheDocument();
  });

  it("limits the scrollable panel to the space below the header and uses unique ids", async () => {
    vi.stubGlobal("innerWidth", 390);
    vi.stubGlobal("innerHeight", 500);
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
      bottom: 64,
    } as DOMRect);
    const user = userEvent.setup();
    render(
      <>
        {example()}
        {example()}
      </>,
    );
    const buttons = screen.getAllByRole("button", { name: "Открыть меню" });
    await user.click(buttons[0]!);
    const button = screen.getByRole("button", { name: "Закрыть меню" });
    const panel = document.getElementById(
      button.getAttribute("aria-controls")!,
    );
    expect(panel).toHaveStyle({ maxHeight: "420px" });
    expect(panel).toHaveClass("overflow-y-auto");
    await user.click(button);
    await user.click(buttons[1]!);
    expect(
      screen
        .getByRole("button", { name: "Закрыть меню" })
        .getAttribute("aria-controls"),
    ).not.toBe(panel?.id);
    vi.unstubAllGlobals();
  });
});
