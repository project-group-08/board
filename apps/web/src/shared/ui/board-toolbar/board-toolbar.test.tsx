import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";

import { BoardToolbar, BoardToolbarViewLabel } from ".";
import { ToolButton } from "../tool-button";

describe("BoardToolbar", () => {
  it("renders a named group with children and forwards its ref and attributes", () => {
    const ref = createRef<HTMLFieldSetElement>();
    render(
      <BoardToolbar ref={ref} aria-label="Инструменты доски" id="board-tools">
        <span>Содержимое</span>
      </BoardToolbar>,
    );
    const group = screen.getByRole("group", { name: "Инструменты доски" });
    expect(ref.current).toBe(group);
    expect(group).toHaveAttribute("id", "board-tools");
    expect(group).toHaveTextContent("Содержимое");
    expect(screen.queryByRole("toolbar")).not.toBeInTheDocument();
  });

  it("leaves selection, availability and keyboard activation to children", async () => {
    const user = userEvent.setup();
    const action = vi.fn<() => void>();
    render(
      <BoardToolbar aria-label="Инструменты доски">
        <ToolButton aria-label="Выбрать" selected onClick={action}>
          A
        </ToolButton>
        <ToolButton aria-label="Недоступен" disabled onClick={action}>
          B
        </ToolButton>
        <ToolButton aria-label="Комментарий" onClick={action}>
          C
        </ToolButton>
      </BoardToolbar>,
    );
    const selected = screen.getByRole("button", { name: "Выбрать" });
    expect(selected).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Недоступен" })).toBeDisabled();
    await user.tab();
    expect(selected).toHaveFocus();
    await user.keyboard("{Enter}");
    await user.tab();
    expect(screen.getByRole("button", { name: "Комментарий" })).toHaveFocus();
    await user.keyboard(" ");
    expect(action).toHaveBeenCalledTimes(2);
  });
});

describe("BoardToolbarViewLabel", () => {
  it("renders a non-interactive label with a decorative lock and forwards its ref", () => {
    const ref = createRef<HTMLSpanElement>();
    render(
      <BoardToolbar aria-label="Инструменты доски">
        <BoardToolbarViewLabel ref={ref} />
      </BoardToolbar>,
    );
    const group = screen.getByRole("group", { name: "Инструменты доски" });
    const label = within(group).getByText("Просмотр");
    expect(ref.current).toBe(label);
    expect(label.tagName).toBe("SPAN");
    expect(label.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    expect(label).not.toHaveAttribute("tabindex");
    expect(within(group).queryByRole("button")).not.toBeInTheDocument();
  });
});
