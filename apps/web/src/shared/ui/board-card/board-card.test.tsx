import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Image from "next/image";
import { describe, expect, it, vi } from "vitest";

import { BoardCard } from ".";

describe("BoardCard", () => {
  it("keeps the menu independent from the board link and keyboard navigation", async () => {
    const user = userEvent.setup();
    const onMenuClick = vi.fn<() => void>();
    render(
      <BoardCard
        href="/b/example"
        title="Доска проекта"
        meta="Изменена сегодня"
        preview={
          <Image
            src="/preview.png"
            alt="Превью проекта"
            width={252}
            height={152}
          />
        }
        menu={<button onClick={onMenuClick}>Меню доски</button>}
      />,
    );

    const link = screen.getByRole("link", { name: /Доска проекта/ });
    const button = screen.getByRole("button", { name: "Меню доски" });
    expect(link).toHaveAttribute("href", "/b/example");
    expect(within(link).getByText("Изменена сегодня")).toBeInTheDocument();
    expect(
      within(link).getByRole("img", { name: "Превью проекта" }),
    ).toBeInTheDocument();
    expect(link).not.toContainElement(button);

    await user.tab();
    expect(link).toHaveFocus();
    await user.tab();
    expect(button).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(onMenuClick).toHaveBeenCalledOnce();
    expect(button).toHaveFocus();
  });

  it("shows a decorative placeholder when preview is absent", () => {
    const { container } = render(
      <BoardCard href="/b/example" title="Пустая доска" meta="Сегодня" />,
    );
    expect(
      screen.getByRole("link", { name: /Пустая доска/ }),
    ).toBeInTheDocument();
    expect(
      container.querySelector("svg")?.closest('[aria-hidden="true"]'),
    ).toBeTruthy();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("renders only non-interactive placeholders during loading", () => {
    render(<BoardCard loading />);
    expect(
      screen.getByRole("status", { name: "Загрузка доски" }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
