import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { EditLockLabel } from ".";

describe("EditLockLabel", () => {
  it("renders noninteractive text with a decorative pencil and theme colors", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <>
        <button>До</button>
        <EditLockLabel text="Катя редактирует" />
        <button>После</button>
      </>,
    );
    const label = screen.getByText("Катя редактирует").parentElement!;
    const icon = container.querySelector("svg")!;
    expect(label.tagName).toBe("SPAN");
    expect(label).toHaveClass("bg-[var(--color-success)]", "text-background");
    expect(label).not.toHaveAttribute("role");
    expect(label).not.toHaveAttribute("aria-live");
    expect(label).not.toHaveAttribute("tabindex");
    expect(icon).toHaveAttribute("aria-hidden", "true");
    expect(icon).toHaveAttribute("stroke-width", "1.5");
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    await user.tab();
    expect(screen.getByRole("button", { name: "До" })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole("button", { name: "После" })).toHaveFocus();
  });

  it("applies each custom color independently and lets the icon inherit text color", () => {
    const { container, rerender } = render(
      <EditLockLabel text="Редактирует" backgroundColor="#123456" />,
    );
    const label = screen.getByText("Редактирует").parentElement!;
    const icon = container.querySelector("svg")!;
    expect(label.style.backgroundColor).toBe("rgb(18, 52, 86)");
    expect(label.style.color).toBe("");
    rerender(<EditLockLabel text="Редактирует" textColor="#abcdef" />);
    expect(label.style.backgroundColor).toBe("");
    expect(label.style.color).toBe("rgb(171, 205, 239)");
    expect(icon).toHaveAttribute("stroke", "currentColor");
  });

  it("constrains long text and keeps the icon aligned with its first line", () => {
    const text = "ОченьДлинноеИмяУчастника редактирует содержимое элемента";
    const { container } = render(
      <div style={{ width: 140 }}>
        <EditLockLabel text={text} />
      </div>,
    );
    const content = screen.getByText(text);
    const label = content.parentElement!;
    const icon = container.querySelector("svg")!;
    expect(label).toHaveClass(
      "inline-flex",
      "max-w-full",
      "min-w-0",
      "items-start",
    );
    expect(content).toHaveClass("min-w-0", "[overflow-wrap:anywhere]");
    expect(icon).toHaveClass("shrink-0", "mt-[var(--space-2)]");
    expect(label).toHaveTextContent(text);
  });
});
