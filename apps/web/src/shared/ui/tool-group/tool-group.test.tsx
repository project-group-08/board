import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { ToolGroup } from ".";
import { MenuItem } from "../menu";

describe("ToolGroup", () => {
  it("keeps actions independent and lets the consumer update the icon", async () => {
    const user = userEvent.setup();
    const select = vi.fn<() => void>();
    function Example() {
      const [tool, setTool] = useState("Указатель");
      return (
        <ToolGroup
          label={tool}
          menuLabel="Инструменты"
          icon={<span data-testid={tool} />}
          selected
          onSelect={select}
        >
          <MenuItem onClick={() => setTool("Карандаш")}>Карандаш</MenuItem>
        </ToolGroup>
      );
    }
    render(<Example />);
    await user.click(screen.getByRole("button", { name: "Указатель" }));
    expect(select).toHaveBeenCalledOnce();
    const arrow = screen.getByRole("button", { name: "Инструменты" });
    await user.click(arrow);
    expect(select).toHaveBeenCalledOnce();
    await waitFor(() => expect(arrow).toHaveAttribute("aria-expanded", "true"));
    await user.click(await screen.findByRole("menuitem", { name: "Карандаш" }));
    expect(arrow).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByRole("button", { name: "Карандаш" })).toContainElement(
      screen.getByTestId("Карандаш"),
    );
  });

  it("supports keyboard focus, menu navigation and Escape", async () => {
    const user = userEvent.setup();
    render(
      <ToolGroup
        label="Указатель"
        menuLabel="Инструменты"
        icon="иконка"
        onSelect={() => {}}
      >
        <MenuItem>Первый</MenuItem>
        <MenuItem>Второй</MenuItem>
      </ToolGroup>,
    );
    await user.tab();
    expect(screen.getByRole("button", { name: "Указатель" })).toHaveFocus();
    await user.tab();
    const arrow = screen.getByRole("button", { name: "Инструменты" });
    expect(arrow).toHaveFocus();
    await user.keyboard("{Enter}");
    await waitFor(() =>
      expect(screen.getByRole("menuitem", { name: "Первый" })).toHaveFocus(),
    );
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("menuitem", { name: "Второй" })).toHaveFocus();
    await user.keyboard("{Escape}");
    await waitFor(() => expect(arrow).toHaveFocus());
    expect(arrow).toHaveAttribute("aria-expanded", "false");
  });

  it("disables both buttons and preserves selection", async () => {
    const user = userEvent.setup();
    const select = vi.fn<() => void>();
    render(
      <ToolGroup
        label="Указатель"
        menuLabel="Инструменты"
        icon="иконка"
        selected
        disabled
        onSelect={select}
      >
        <MenuItem>Пункт</MenuItem>
      </ToolGroup>,
    );
    const main = screen.getByRole("button", { name: "Указатель" });
    const arrow = screen.getByRole("button", { name: "Инструменты" });
    expect(main).toBeDisabled();
    expect(main).toHaveAttribute("aria-pressed", "true");
    expect(main).toHaveClass("bg-accent-solid");
    expect(arrow).toBeDisabled();
    await user.click(main);
    await user.click(arrow);
    expect(select).not.toHaveBeenCalled();
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("closes an open menu without remounting buttons and stays closed on enable", async () => {
    const user = userEvent.setup();
    const group = (disabled: boolean) => (
      <ToolGroup
        label="Указатель"
        menuLabel="Инструменты"
        icon="иконка"
        selected
        disabled={disabled}
        onSelect={() => {}}
      >
        <MenuItem>Пункт</MenuItem>
      </ToolGroup>
    );
    const { rerender } = render(group(false));
    const main = screen.getByRole("button", { name: "Указатель" });
    const arrow = screen.getByRole("button", { name: "Инструменты" });
    await user.click(arrow);
    await screen.findByRole("menuitem", { name: "Пункт" });
    rerender(group(true));
    expect(screen.getByRole("button", { name: "Указатель" })).toBe(main);
    expect(screen.getByRole("button", { name: "Инструменты" })).toBe(arrow);
    expect(main).toBeDisabled();
    expect(main).toHaveAttribute("aria-pressed", "true");
    expect(arrow).toBeDisabled();
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    rerender(group(false));
    expect(main).toBeEnabled();
    expect(main).toHaveAttribute("aria-pressed", "true");
    expect(arrow).toBeEnabled();
    expect(arrow).toHaveAttribute("aria-expanded", "false");
    await user.click(arrow);
    expect(
      await screen.findByRole("menuitem", { name: "Пункт" }),
    ).toBeInTheDocument();
  });

  it("does not focus disabled buttons or steal outside focus when disabled", async () => {
    const user = userEvent.setup();
    const group = (disabled: boolean) => (
      <>
        <button>Снаружи</button>
        <ToolGroup
          label="Указатель"
          menuLabel="Инструменты"
          icon="иконка"
          disabled={disabled}
          onSelect={() => {}}
        >
          <MenuItem>Пункт</MenuItem>
        </ToolGroup>
      </>
    );
    const { rerender } = render(group(false));
    await user.click(screen.getByRole("button", { name: "Инструменты" }));
    const item = await screen.findByRole("menuitem", { name: "Пункт" });
    item.focus();
    rerender(group(true));
    await waitFor(() => expect(item).not.toHaveFocus());
    expect(
      screen.getByRole("button", { name: "Инструменты" }),
    ).not.toHaveFocus();
    expect(screen.getByRole("button", { name: "Указатель" })).not.toHaveFocus();
    rerender(group(false));
    await user.click(screen.getByRole("button", { name: "Инструменты" }));
    await screen.findByRole("menuitem", { name: "Пункт" });
    const outside = screen.getByRole("button", { name: "Снаружи" });
    outside.focus();
    rerender(group(true));
    await waitFor(() => expect(outside).toHaveFocus());
  });
});
