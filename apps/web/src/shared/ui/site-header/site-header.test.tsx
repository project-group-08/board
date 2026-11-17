import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { SiteHeader } from ".";
import { Button } from "../button";
import { IconButton } from "../icon-button";

describe("SiteHeader", () => {
  it("preserves semantic landmarks, accessible names and content order without nested controls", () => {
    const { container } = render(
      <SiteHeader
        brand={<a href="#home">Название</a>}
        navigationLabel="Основная навигация"
        navigation={
          <ul>
            <li>
              <a href="#features">Возможности</a>
            </li>
            <li>
              <a href="#faq">Вопросы</a>
            </li>
          </ul>
        }
        themeAction={
          <IconButton aria-label="Тема">
            <svg />
          </IconButton>
        }
        actions={
          <>
            <a href="#login">Войти</a>
            <Button>Начать</Button>
          </>
        }
      />,
    );
    const header = screen.getByRole("banner");
    const nav = within(header).getByRole("navigation", {
      name: "Основная навигация",
    });
    expect(
      within(nav)
        .getAllByRole("link")
        .map((link) => link.textContent),
    ).toEqual(["Возможности", "Вопросы"]);
    expect(
      within(header)
        .getAllByRole("link")
        .map((link) => link.textContent),
    ).toEqual(["Название", "Возможности", "Вопросы", "Войти"]);
    expect(
      within(header).getByRole("button", { name: "Тема" }),
    ).toBeInTheDocument();
    expect(
      within(header).getByRole("button", { name: "Начать" }),
    ).toBeInTheDocument();
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
    ]);
    expect(
      container.querySelector("a a, a button, button a, button button"),
    ).toBeNull();
    expect(
      header.querySelectorAll('span[aria-hidden="true"].bg-border'),
    ).toHaveLength(2);
  });

  it("preserves link destinations and activates supplied actions by mouse and keyboard", async () => {
    const user = userEvent.setup();
    const theme = vi.fn<() => void>();
    const start = vi.fn<() => void>();
    const link = vi.fn<(event: React.MouseEvent<HTMLAnchorElement>) => void>(
      (event) => event.preventDefault(),
    );
    render(
      <SiteHeader
        brand={
          <a href="#home" onClick={link}>
            Название
          </a>
        }
        navigationLabel="Навигация"
        navigation={
          <a href="#features" onClick={link}>
            Возможности
          </a>
        }
        themeAction={
          <IconButton aria-label="Тема" onClick={theme}>
            <svg />
          </IconButton>
        }
        actions={<Button onClick={start}>Начать</Button>}
      />,
    );
    const navLink = screen.getByRole("link", { name: "Возможности" });
    expect(navLink).toHaveAttribute("href", "#features");
    await user.click(navLink);
    expect(link).toHaveBeenCalledOnce();
    await user.click(screen.getByRole("button", { name: "Тема" }));
    expect(theme).toHaveBeenCalledOnce();
    await user.tab();
    expect(screen.getByRole("button", { name: "Начать" })).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(start).toHaveBeenCalledOnce();
  });
});
