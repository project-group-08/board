import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import { WorkspaceSwitcher } from ".";

describe("WorkspaceSwitcher", () => {
  it("renders a named button with decorative mark and forwards its ref", () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <WorkspaceSwitcher
        ref={ref}
        name="Проектная группа"
        meta="8 участников"
        markFallback="П"
      />,
    );
    const button = screen.getByRole("button", {
      name: "Проектная группа 8 участников",
    });
    expect(ref.current).toBe(button);
    expect(button).toHaveAttribute("type", "button");
    expect(button).toHaveClass(
      "w-[224px]",
      "min-h-[48px]",
      "data-[popup-open]:bg-muted",
      "focus-visible:shadow-[var(--shadow-focus)]",
    );
    expect(screen.queryByRole("figure")).not.toBeInTheDocument();
    expect(button).toHaveTextContent("П");
  });
});
