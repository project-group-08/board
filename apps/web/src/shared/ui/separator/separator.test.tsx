import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import { Separator } from ".";

describe("Separator", () => {
  it("renders a horizontal semantic separator by default and forwards attributes and ref", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Separator
        ref={ref}
        id="section-divider"
        aria-label="Разделы"
        data-testid="separator"
      />,
    );
    const separator = screen.getByRole("separator", { name: "Разделы" });
    expect(ref.current).toBe(separator);
    expect(separator).toHaveAttribute("id", "section-divider");
    expect(separator).toHaveClass("h-px", "w-full", "bg-border");
    expect(separator).not.toHaveAttribute("tabindex");
    expect(separator).not.toHaveAttribute("aria-orientation");
  });

  it("exposes vertical orientation without keyboard interaction", () => {
    render(<Separator orientation="vertical" />);
    const separator = screen.getByRole("separator");
    expect(separator).toHaveAttribute("aria-orientation", "vertical");
    expect(separator).toHaveClass("h-[20px]", "w-px");
    expect(separator).not.toHaveAttribute("tabindex");
  });

  it.each(["horizontal", "vertical"] as const)(
    "hides a decorative %s separator from accessibility",
    (orientation) => {
      render(
        <Separator
          orientation={orientation}
          decorative
          data-testid="separator"
        />,
      );
      const separator = screen.getByTestId("separator");
      expect(separator).toHaveAttribute("aria-hidden", "true");
      expect(separator).not.toHaveAttribute("role");
      expect(separator).not.toHaveAttribute("aria-orientation");
      expect(screen.queryByRole("separator")).not.toBeInTheDocument();
    },
  );

  it("allows className to override the vertical height", () => {
    render(
      <Separator
        orientation="vertical"
        decorative
        className="h-[32px]"
        data-testid="separator"
      />,
    );
    const separator = screen.getByTestId("separator");
    expect(separator).toHaveClass("h-[32px]", "w-px");
    expect(separator).not.toHaveClass("h-[20px]");
  });
});
