import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";

import { Tooltip, TooltipProvider } from ".";
import { Button } from "../button";
import { IconButton } from "../icon-button";

describe("Tooltip", () => {
  it("composes an icon button, preserves its name and handler, and closes with Escape", async () => {
    const user = userEvent.setup();
    const click = vi.fn<() => void>();
    const ref = createRef<HTMLButtonElement>();
    render(
      <TooltipProvider>
        <Tooltip label="Выбрать инструмент" shortcut="T">
          <IconButton ref={ref} aria-label="Инструмент" onClick={click}>
            +
          </IconButton>
        </Tooltip>
      </TooltipProvider>,
    );
    const button = screen.getByRole("button", { name: "Инструмент" });
    expect(ref.current).toBe(button);
    expect(button.querySelector("button")).not.toBeInTheDocument();
    await user.tab();
    expect(button).toHaveFocus();
    expect(await screen.findByText("Выбрать инструмент")).toBeVisible();
    expect(screen.getByText("T").tagName).toBe("KBD");
    await user.keyboard("{Escape}");
    await waitFor(() =>
      expect(screen.queryByText("Выбрать инструмент")).not.toBeInTheDocument(),
    );
    await user.click(button);
    expect(click).toHaveBeenCalledOnce();
  });

  it("composes an ordinary button without adding another button", async () => {
    const user = userEvent.setup();
    const click = vi.fn<() => void>();
    render(
      <TooltipProvider>
        <Tooltip label="Сохранить изменения" side="bottom">
          <Button onClick={click}>Сохранить</Button>
        </Tooltip>
      </TooltipProvider>,
    );
    const button = screen.getByRole("button", { name: "Сохранить" });
    expect(screen.getAllByRole("button")).toHaveLength(1);
    await user.tab();
    expect(button).toHaveFocus();
    expect(await screen.findByText("Сохранить изменения")).toBeVisible();
    await user.keyboard("{Enter}");
    expect(click).toHaveBeenCalledOnce();
  });
});
