import { render, screen, within } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import { DividerWithText } from ".";

describe("DividerWithText", () => {
  it("keeps text available and hides both lines from accessibility", () => {
    render(<DividerWithText data-testid="divider">или</DividerWithText>);
    const divider = screen.getByTestId("divider");
    expect(within(divider).getByText("или")).toBeVisible();
    const lines = divider.querySelectorAll('[aria-hidden="true"]');
    expect(lines).toHaveLength(2);
    for (const line of lines)
      expect(line).toHaveClass("h-px", "w-full", "bg-border");
    expect(within(divider).queryByRole("separator")).not.toBeInTheDocument();
    expect(divider).not.toHaveAttribute("aria-hidden");
  });

  it("forwards ref and native attributes and merges className", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <DividerWithText
        ref={ref}
        id="alternative"
        title="Другой способ"
        className="w-[200px]"
        data-testid="divider"
      >
        или
      </DividerWithText>,
    );
    const divider = screen.getByTestId("divider");
    expect(ref.current).toBe(divider);
    expect(divider).toHaveAttribute("id", "alternative");
    expect(divider).toHaveAttribute("title", "Другой способ");
    expect(divider).toHaveClass("w-[200px]");
    expect(divider).not.toHaveClass("w-full");
  });

  it("preserves long text without truncating its content", () => {
    const text = "ОченьДлиннаяСтрокаБезПробелов";
    render(<DividerWithText>{text}</DividerWithText>);
    expect(screen.getByText(text)).toHaveClass("[overflow-wrap:anywhere]");
  });
});
