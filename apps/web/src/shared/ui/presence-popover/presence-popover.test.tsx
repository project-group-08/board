import { readFileSync } from "node:fs";

import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { PresencePopover } from ".";
import type { PresenceParticipant, PresencePopoverProps } from ".";
import { Button } from "../button";

const participants: PresenceParticipant[] = [
  {
    id: "self",
    name: "Никита",
    role: "Владелец",
    avatarFallback: "Н",
    isCurrentUser: true,
    color: "rgb(37, 99, 235)",
    selectable: true,
  },
  {
    id: "other",
    name: "Андрей",
    role: "Редактор",
    avatarFallback: "А",
    isCurrentUser: false,
    color: "rgb(22, 163, 74)",
    selectable: false,
  },
];
const labels = {
  title: "На доске сейчас 2",
  currentUser: "Вы",
  hint: "Нажмите на имя",
};

function Example(props: Partial<PresencePopoverProps>) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button">Снаружи</button>
      <PresencePopover
        trigger={<Button>Участники</Button>}
        open={open}
        onOpenChange={setOpen}
        participants={participants}
        onParticipantSelect={() => {}}
        labels={labels}
        {...props}
      />
    </>
  );
}

describe("PresencePopover", () => {
  it("requests opening without changing controlled state", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn<(open: boolean) => void>();
    const { rerender } = render(
      <Example open={false} onOpenChange={onOpenChange} />,
    );
    await user.click(screen.getByRole("button", { name: "Участники" }));
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    rerender(<Example open onOpenChange={onOpenChange} />);
    expect(
      await screen.findByRole("dialog", { name: labels.title }),
    ).toBeVisible();
  });

  it("selects only explicitly available rows, including the current user, without closing", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn<(id: string) => void>();
    render(<Example onParticipantSelect={onSelect} />);
    await user.click(screen.getByRole("button", { name: "Участники" }));
    const dialog = await screen.findByRole("dialog", { name: labels.title });
    const current = within(dialog).getByRole("button", { name: /Никита/ });
    const other = within(dialog).getByRole("button", { name: /Андрей/ });
    expect(current).toBeEnabled();
    expect(other).toBeDisabled();
    expect(current).toHaveTextContent("Вы");
    expect(current).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(onSelect).toHaveBeenCalledExactlyOnceWith("self");
    await user.click(other);
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(dialog).toBeVisible();
  });

  it("updates participants, availability, labels and colors from the consumer", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn<(id: string) => void>();
    const { rerender } = render(<Example onParticipantSelect={onSelect} />);
    await user.click(screen.getByRole("button", { name: "Участники" }));
    await screen.findByRole("dialog");
    rerender(
      <Example
        onParticipantSelect={onSelect}
        participants={[
          { ...participants[1]!, name: "Катя", selectable: true, color: "red" },
        ]}
        labels={{
          title: "Один участник",
          currentUser: "Это вы",
          hint: "Подсказка",
        }}
      />,
    );
    const dialog = screen.getByRole("dialog", { name: "Один участник" });
    expect(within(dialog).queryByText("Никита")).not.toBeInTheDocument();
    expect(within(dialog).getByText("Подсказка")).toBeVisible();
    const row = within(dialog).getByRole("button", { name: /Катя/ });
    expect(row).toBeEnabled();
    expect(row.querySelector('[aria-hidden="true"][style]')).toHaveAttribute(
      "style",
      "background-color: red;",
    );
    await user.click(row);
    expect(onSelect).toHaveBeenCalledExactlyOnceWith("other");
    expect(dialog).toBeVisible();
  });

  it("opens with keyboard, requests close on Escape and restores trigger focus", async () => {
    const user = userEvent.setup();
    render(<Example />);
    const trigger = screen.getByRole("button", { name: "Участники" });
    await user.tab();
    await user.tab();
    expect(trigger).toHaveFocus();
    await user.keyboard("{Enter}");
    const row = await screen.findByRole("button", { name: /Никита/ });
    await waitFor(() => expect(row).toHaveFocus());
    expect(row.className).toContain("focus-visible:shadow-");
    await user.keyboard("{Escape}");
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it.each([
    ["empty list", []],
    [
      "all rows unavailable",
      participants.map((participant) => ({
        ...participant,
        selectable: false,
      })),
    ],
  ])(
    "shows panel focus with %s and returns focus on Escape",
    async (_, items) => {
      const user = userEvent.setup();
      render(<Example participants={items} />);
      const trigger = screen.getByRole("button", { name: "Участники" });
      await user.tab();
      await user.tab();
      expect(trigger).toHaveFocus();
      await user.keyboard("{Enter}");
      const dialog = await screen.findByRole("dialog");
      await waitFor(() => expect(dialog).toHaveFocus());
      expect(dialog).toHaveClass("focus-visible:shadow-[var(--shadow-focus)]");
      for (const row of within(dialog).queryAllByRole("button")) {
        expect(row).toBeDisabled();
      }
      await user.keyboard("{Escape}");
      await waitFor(() => expect(trigger).toHaveFocus());
    },
  );

  it("requests close on outside click and leaves focus on the outside control", async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(screen.getByRole("button", { name: "Участники" }));
    await screen.findByRole("dialog");
    const outside = screen.getByRole("button", { name: "Снаружи" });
    await user.click(outside);
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
    expect(outside).toHaveFocus();
  });

  it.each(["light", "dark"])(
    "uses theme tokens and narrow viewport constraints in %s theme",
    async (theme) => {
      const user = userEvent.setup();
      document.documentElement.dataset.theme = theme;
      try {
        render(<Example />);
        await user.click(screen.getByRole("button", { name: "Участники" }));
        const dialog = await screen.findByRole("dialog");
        expect(dialog).toHaveClass(
          "bg-background",
          "text-foreground",
          "border-border",
          "max-h-[var(--available-height)]",
          "overflow-y-auto",
        );
        expect(dialog.parentElement).toHaveClass(
          "w-[280px]",
          "max-w-[var(--available-width)]",
        );
        expect(within(dialog).getByText("Вы")).toHaveClass(
          "text-accent",
          "bg-[var(--color-accent-soft)]",
        );
        const css = readFileSync("src/_app/styles/globals.css", "utf8");
        expect(css).toContain(
          theme === "light"
            ? "--color-background: #fff"
            : "--color-background: #0e0e10",
        );
      } finally {
        delete document.documentElement.dataset.theme;
      }
    },
  );
});
