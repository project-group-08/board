import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ContextMenu } from ".";
import type { ContextMenuProps } from ".";

const commands = [
  ["Копировать", "copy", "onCopy"],
  ["Сгруппировать", "group", "onGroup"],
  ["Экспортировать выделенное", "exportSelection", "onExportSelection"],
  ["Удалить", "delete", "onDelete"],
] as const;

function setup(disabled?: ContextMenuProps["disabled"]) {
  const actions = {
    onCopy: vi.fn<() => void>(),
    onGroup: vi.fn<() => void>(),
    onExportSelection: vi.fn<() => void>(),
    onDelete: vi.fn<() => void>(),
  };
  render(
    <ContextMenu
      trigger={<button>Открыть меню</button>}
      disabled={disabled}
      {...actions}
    />,
  );
  return actions;
}

describe("ContextMenu", () => {
  it("renders the fixed commands and separates the destructive action", async () => {
    const user = userEvent.setup();
    setup();
    await user.click(screen.getByRole("button", { name: "Открыть меню" }));
    const menu = await screen.findByRole("menu");
    const items = within(menu).getAllByRole("menuitem");
    expect(items.map((item) => item.textContent)).toEqual(
      commands.map(([label]) => label),
    );
    expect(items[3]).toHaveClass("text-destructive");
    expect(items[3]?.previousElementSibling).toHaveAttribute(
      "role",
      "separator",
    );
  });

  it.each(commands)("calls only the handler for %s", async (label, _, key) => {
    const user = userEvent.setup();
    const actions = setup();
    const trigger = screen.getByRole("button", { name: "Открыть меню" });
    await user.click(trigger);
    await user.click(await screen.findByRole("menuitem", { name: label }));
    for (const [name, handler] of Object.entries(actions)) {
      expect(handler).toHaveBeenCalledTimes(name === key ? 1 : 0);
    }
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it.each(commands)("does not activate disabled %s", async (label, key) => {
    const user = userEvent.setup();
    const actions = setup({ [key]: true });
    const trigger = screen.getByRole("button", { name: "Открыть меню" });
    await user.click(trigger);
    const item = await screen.findByRole("menuitem", { name: label });
    expect(item).toHaveAttribute("aria-disabled", "true");
    await user.click(item);
    for (const handler of Object.values(actions)) {
      expect(handler).not.toHaveBeenCalled();
    }
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("opens and navigates with the keyboard, activates and restores focus", async () => {
    const user = userEvent.setup();
    const actions = setup();
    await user.tab();
    const trigger = screen.getByRole("button", { name: "Открыть меню" });
    await user.keyboard("{Enter}");
    const copy = await screen.findByRole("menuitem", { name: "Копировать" });
    await waitFor(() => expect(copy).toHaveFocus());
    await user.keyboard("{ArrowDown}");
    expect(
      screen.getByRole("menuitem", { name: "Сгруппировать" }),
    ).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(actions.onGroup).toHaveBeenCalledOnce();
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it("closes on Escape and restores focus", async () => {
    const user = userEvent.setup();
    setup();
    await user.tab();
    const trigger = screen.getByRole("button", { name: "Открыть меню" });
    await user.keyboard("{Enter}");
    await screen.findByRole("menuitem", { name: "Копировать" });
    await user.keyboard("{Escape}");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await waitFor(() => expect(trigger).toHaveFocus());
  });
});
