import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import { Kbd } from ".";

describe("Kbd", () => {
  it("renders visible keyboard input with the default variant", () => {
    render(<Kbd>Ctrl K</Kbd>);
    const kbd = screen.getByText("Ctrl K");
    expect(kbd.tagName).toBe("KBD");
    expect(kbd).toBeVisible();
    expect(kbd).not.toHaveAttribute("aria-hidden");
    expect(kbd).toHaveClass(
      "border-border",
      "bg-muted",
      "text-muted-foreground",
    );
    expect(kbd).not.toHaveAttribute("tabindex");
  });

  it("renders the inverted variant without hiding its text", () => {
    render(<Kbd variant="inverted">T</Kbd>);
    const kbd = screen.getByText("T");
    expect(kbd.tagName).toBe("KBD");
    expect(kbd).not.toHaveAttribute("aria-hidden");
    expect(kbd).toHaveClass(
      "border-inverse-foreground",
      "bg-transparent",
      "text-inverse-foreground",
      "opacity-70",
    );
  });

  it("forwards native attributes and ref and merges className", () => {
    const ref = createRef<HTMLElement>();
    render(
      <Kbd
        ref={ref}
        id="shortcut"
        title="Поиск"
        className="px-[8px]"
        data-testid="kbd"
      >
        Ctrl K
      </Kbd>,
    );
    const kbd = screen.getByTestId("kbd");
    expect(ref.current).toBe(kbd);
    expect(kbd).toHaveAttribute("id", "shortcut");
    expect(kbd).toHaveAttribute("title", "Поиск");
    expect(kbd).toHaveClass("px-[8px]");
    expect(kbd).not.toHaveClass("px-[6px]");
  });
});
