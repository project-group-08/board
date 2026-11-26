import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { ConnectionStatus } from ".";

describe("ConnectionStatus", () => {
  it.each([
    ["offline", "Нет соединения", "lucide-wifi-off"],
    ["reconnecting", "Переподключаемся", "lucide-loader-circle"],
  ] as const)("renders %s with a decorative icon", (state, text, iconClass) => {
    const { container } = render(
      <ConnectionStatus state={state} text={text} />,
    );
    const label = screen.getByText(text).parentElement!;
    const icon = container.querySelector("svg")!;
    expect(label.tagName).toBe("SPAN");
    expect(label).toHaveClass("bg-muted", "text-muted-foreground");
    expect(label).not.toHaveAttribute("role");
    expect(label).not.toHaveAttribute("aria-live");
    expect(label).not.toHaveAttribute("tabindex");
    expect(icon).toHaveClass(iconClass);
    expect(icon).toHaveAttribute("aria-hidden", "true");
    expect(icon).toHaveAttribute("stroke-width", "1.5");
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("animates only reconnecting and respects reduced motion", () => {
    const { container, rerender } = render(
      <ConnectionStatus state="reconnecting" text="Повторное подключение" />,
    );
    expect(container.querySelector("svg")).toHaveClass(
      "animate-spin",
      "motion-reduce:animate-none",
    );
    rerender(<ConnectionStatus state="offline" text="Нет связи" />);
    expect(container.querySelector("svg")).not.toHaveClass("animate-spin");
  });

  it("keeps long text within its parent and the icon at the first line", () => {
    const text = "ОченьДлиннаяПодписьСостояния переподключения к доске";
    const { container } = render(
      <div style={{ width: 140 }}>
        <ConnectionStatus state="reconnecting" text={text} />
      </div>,
    );
    const content = screen.getByText(text);
    const label = content.parentElement!;
    expect(label).toHaveClass(
      "inline-flex",
      "max-w-full",
      "min-w-0",
      "items-start",
    );
    expect(content).toHaveClass("min-w-0", "[overflow-wrap:anywhere]");
    expect(container.querySelector("svg")).toHaveClass(
      "shrink-0",
      "mt-[var(--space-2)]",
    );
    expect(label).toHaveTextContent(text);
  });

  it("is skipped by keyboard navigation", async () => {
    const user = userEvent.setup();
    render(
      <>
        <button>До</button>
        <ConnectionStatus state="offline" text="Нет связи" />
        <button>После</button>
      </>,
    );
    await user.tab();
    expect(screen.getByRole("button", { name: "До" })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole("button", { name: "После" })).toHaveFocus();
  });
});
