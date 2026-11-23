import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { TrashRow } from ".";
import { Button } from "../button";

describe("TrashRow", () => {
  it("renders supplied values in order without adding placeholders or interactive wrappers", () => {
    const { container } = render(
      <TrashRow
        name="Доска"
        deletedBy=""
        deletedAt="—"
        restoreAction={<Button>Восстановить</Button>}
      />,
    );
    const row = container.querySelector('[data-slot="trash-row"]');
    expect(row).not.toBeNull();
    expect(row?.children).toHaveLength(4);
    expect(row?.children[0]).toHaveTextContent("Доска");
    expect(row?.children[1]).toBeEmptyDOMElement();
    expect(row?.children[2]).toHaveTextContent("—");
    expect(row?.children[3]).toContainElement(
      screen.getByRole("button", { name: "Восстановить" }),
    );
    expect(screen.getAllByRole("button")).toHaveLength(1);
    expect(row).not.toHaveAttribute("role");
    expect(row).not.toHaveAttribute("tabindex");
  });

  it("keeps long values intact and supplies container-based grid and wrapping classes", () => {
    const value = "ОченьДлинноеЗначениеБезПробелов".repeat(4);
    const { container } = render(
      <TrashRow
        name={value}
        deletedBy={value}
        deletedAt={value}
        restoreAction={<Button>Действие</Button>}
      />,
    );
    const row = container.querySelector('[data-slot="trash-row"]');
    expect(row?.parentElement).toHaveClass("@container");
    expect(row).toHaveClass(
      "grid-cols-1",
      "@min-[720px]:grid-cols-[minmax(0,1fr)_200px_183px_128px]",
      "hover:bg-muted",
    );
    for (const element of screen.getAllByText(value)) {
      expect(element).toHaveClass("[overflow-wrap:anywhere]");
    }
  });

  it("preserves the supplied action's keyboard behavior and disabled state", async () => {
    const user = userEvent.setup();
    const onRestore = vi.fn<() => void>();
    const { rerender } = render(
      <TrashRow
        name="Доска"
        deletedBy="Автор"
        deletedAt="Сегодня"
        restoreAction={<Button onClick={onRestore}>Восстановить доску</Button>}
      />,
    );
    const button = screen.getByRole("button", { name: "Восстановить доску" });
    await user.tab();
    expect(button).toHaveFocus();
    await user.keyboard("{Enter} ");
    expect(onRestore).toHaveBeenCalledTimes(2);

    rerender(
      <TrashRow
        name="Доска"
        deletedBy="Автор"
        deletedAt="Сегодня"
        restoreAction={<Button disabled>Восстановить доску</Button>}
      />,
    );
    expect(within(button.parentElement!).getByRole("button")).toBeDisabled();
  });
});
