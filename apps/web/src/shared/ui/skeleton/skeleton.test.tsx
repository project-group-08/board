import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Skeleton } from ".";

describe("Skeleton", () => {
  it("renders an empty, hidden decorative element with the theme styles", () => {
    const { container } = render(<Skeleton />);
    const skeleton = container.firstElementChild;
    expect(skeleton?.tagName).toBe("DIV");
    expect(skeleton).toBeEmptyDOMElement();
    expect(skeleton).toHaveAttribute("aria-hidden", "true");
    expect(skeleton).not.toHaveAttribute("role");
    expect(skeleton).not.toHaveAttribute("tabindex");
    expect(skeleton).toHaveClass(
      "bg-muted",
      "rounded-[var(--radius-xs)]",
      "motion-safe:animate-pulse",
    );
  });

  it("accepts consumer dimensions and merges classes", () => {
    const { container } = render(
      <Skeleton className="h-[16px] w-[200px] rounded-[8px]" />,
    );
    const skeleton = container.firstElementChild;
    expect(skeleton).toHaveClass("h-[16px]", "w-[200px]", "rounded-[8px]");
    expect(skeleton).not.toHaveClass("rounded-[var(--radius-xs)]");
  });
});
