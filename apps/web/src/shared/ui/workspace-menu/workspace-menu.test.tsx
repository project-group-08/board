import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { WorkspaceMenu } from ".";
import { WorkspaceSwitcher } from "../workspace-switcher";

const items = [
  {
    id: "team",
    name: "Проектная группа",
    meta: "8 участников",
    markFallback: "П",
  },
  {
    id: "personal",
    name: "Личное пространство",
    meta: "1 участник",
    markFallback: "Л",
  },
];

function Example({ onCreate = () => {} }: { onCreate?: () => void }) {
  const [selectedId, setSelectedId] = useState("team");
  const selected = items.find((item) => item.id === selectedId)!;
  return (
    <WorkspaceMenu
      trigger={
        <WorkspaceSwitcher
          name={selected.name}
          meta={selected.meta}
          markFallback={selected.markFallback}
        />
      }
      items={items}
      selectedId={selectedId}
      onSelect={setSelectedId}
      onCreate={onCreate}
    />
  );
}

describe("WorkspaceMenu", () => {
  it("opens, exposes the selected item, selects and updates the trigger", async () => {
    const user = userEvent.setup();
    render(<Example />);
    const trigger = screen.getByRole("button", {
      name: "Проектная группа 8 участников",
    });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await user.click(trigger);
    await waitFor(() =>
      expect(trigger).toHaveAttribute("aria-expanded", "true"),
    );
    expect(trigger).toHaveAttribute("data-popup-open");
    expect(
      screen.getByRole("group", { name: "Пространства" }),
    ).toBeInTheDocument();
    const selected = screen.getByRole("menuitemradio", {
      name: "Проектная группа 8 участников",
      checked: true,
    });
    expect(selected.querySelector("svg")).toBeInTheDocument();
    expect(selected).not.toHaveClass("bg-muted");
    expect(within(selected).queryByRole("figure")).not.toBeInTheDocument();
    await user.click(
      screen.getByRole("menuitemradio", {
        name: "Личное пространство 1 участник",
      }),
    );
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).not.toHaveAttribute("data-popup-open");
    expect(trigger).toHaveAccessibleName("Личное пространство 1 участник");
    await user.click(trigger);
    await screen.findByRole("menuitemradio", {
      name: "Личное пространство 1 участник",
    });
    expect(
      screen.getByRole("menuitemradio", {
        name: "Личное пространство 1 участник",
        checked: true,
      }),
    ).toBeInTheDocument();
  });

  it("opens with keyboard, navigates, selects and restores focus", async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.tab();
    const trigger = screen.getByRole("button");
    expect(trigger).toHaveFocus();
    await user.keyboard("{Enter}");
    const first = await screen.findByRole("menuitemradio", {
      name: "Проектная группа 8 участников",
    });
    await waitFor(() => expect(first).toHaveFocus());
    await user.keyboard("{ArrowDown}");
    const second = screen.getByRole("menuitemradio", {
      name: "Личное пространство 1 участник",
    });
    expect(second).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await waitFor(() => expect(trigger).toHaveFocus());
    expect(trigger).toHaveAccessibleName("Личное пространство 1 участник");
  });

  it("closes on Escape and returns focus to the trigger", async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.tab();
    const trigger = screen.getByRole("button");
    await user.keyboard("{Enter}{Escape}");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it("calls creation without changing the selected workspace", async () => {
    const user = userEvent.setup();
    const onCreate = vi.fn<() => void>();
    render(<Example onCreate={onCreate} />);
    const trigger = screen.getByRole("button");
    await user.click(trigger);
    await user.click(
      await screen.findByRole("menuitem", { name: "Создать пространство" }),
    );
    expect(onCreate).toHaveBeenCalledOnce();
    expect(trigger).toHaveAccessibleName("Проектная группа 8 участников");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("does not change a controlled selection unless the consumer accepts it", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn<(id: string) => void>();
    render(
      <WorkspaceMenu
        trigger={
          <WorkspaceSwitcher
            name="Проектная группа"
            meta="8 участников"
            markFallback="П"
          />
        }
        items={items}
        selectedId="team"
        onSelect={onSelect}
        onCreate={() => {}}
      />,
    );
    const trigger = screen.getByRole("button");
    await user.click(trigger);
    await user.click(
      await screen.findByRole("menuitemradio", {
        name: "Личное пространство 1 участник",
      }),
    );
    expect(onSelect).toHaveBeenCalledWith("personal");
    await user.click(trigger);
    await screen.findByRole("menuitemradio", {
      name: "Проектная группа 8 участников",
    });
    expect(
      screen.getByRole("menuitemradio", {
        name: "Проектная группа 8 участников",
        checked: true,
      }),
    ).toBeInTheDocument();
  });
});
