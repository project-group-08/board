import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { BoardMenu } from ".";

const labels = {
  open: "Открыть",
  rename: "Переименовать",
  copy: "Копировать",
  delete: "Удалить",
};

function setup() {
  const actions = {
    onRename: vi.fn<() => void>(),
    onCopy: vi.fn<() => void>(),
    onDelete: vi.fn<() => void>(),
  };
  render(
    <BoardMenu
      trigger={<button>Действия</button>}
      href="#board"
      labels={labels}
      {...actions}
    />,
  );
  return actions;
}

describe("BoardMenu", () => {
  it("renders a link, the supplied labels and a separated destructive action", async () => {
    const user = userEvent.setup();
    setup();
    await user.click(screen.getByRole("button", { name: "Действия" }));
    const menu = await screen.findByRole("menu");
    const items = within(menu).getAllByRole("menuitem");
    expect(items.map((item) => item.textContent)).toEqual(
      Object.values(labels),
    );
    const open = within(menu).getByRole("menuitem", { name: labels.open });
    const rename = within(menu).getByRole("menuitem", { name: labels.rename });
    const remove = within(menu).getByRole("menuitem", { name: labels.delete });
    expect(open.tagName).toBe("A");
    expect(open).toHaveAttribute("href", "#board");
    expect(remove).toHaveClass("text-destructive");
    expect(remove.previousElementSibling).toHaveAttribute("role", "separator");
    expect(rename).toHaveClass("group", "data-[highlighted]:bg-muted");
    expect(rename.querySelector("svg")).toHaveClass(
      "group-data-[highlighted]:text-foreground",
    );
  });

  it.each([
    ["Переименовать", "onRename"],
    ["Копировать", "onCopy"],
    ["Удалить", "onDelete"],
  ] as const)("calls only %s action and closes", async (label, key) => {
    const user = userEvent.setup();
    const actions = setup();
    const trigger = screen.getByRole("button", { name: "Действия" });
    await user.click(trigger);
    await user.click(await screen.findByRole("menuitem", { name: label }));
    expect(actions[key]).toHaveBeenCalledOnce();
    const otherActions = Object.entries(actions).filter(
      ([name]) => name !== key,
    );
    expect(otherActions.map(([, action]) => action.mock.calls.length)).toEqual([
      0, 0,
    ]);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("navigates with arrows, activates an action and restores focus", async () => {
    const user = userEvent.setup();
    const actions = setup();
    await user.tab();
    const trigger = screen.getByRole("button", { name: "Действия" });
    await user.keyboard("{Enter}");
    const open = await screen.findByRole("menuitem", { name: labels.open });
    await waitFor(() => expect(open).toHaveFocus());
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("menuitem", { name: labels.rename })).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(actions.onRename).toHaveBeenCalledOnce();
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it("activates the native link with Enter", async () => {
    const user = userEvent.setup();
    setup();
    await user.tab();
    await user.keyboard("{Enter}");
    const link = await screen.findByRole("menuitem", { name: labels.open });
    await waitFor(() => expect(link).toHaveFocus());
    const click = vi.fn<(event: MouseEvent) => void>((event) =>
      event.preventDefault(),
    );
    link.addEventListener("click", click);
    await user.keyboard("{Enter}");
    expect(click).toHaveBeenCalledOnce();
  });

  it("closes on Escape and restores focus", async () => {
    const user = userEvent.setup();
    setup();
    await user.tab();
    const trigger = screen.getByRole("button", { name: "Действия" });
    await user.keyboard("{Enter}");
    await screen.findByRole("menuitem", { name: labels.open });
    await user.keyboard("{Escape}");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await waitFor(() => expect(trigger).toHaveFocus());
  });
});
