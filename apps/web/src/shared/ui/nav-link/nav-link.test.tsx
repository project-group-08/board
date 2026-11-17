import { readFileSync } from "node:fs";

import tailwindcss from "@tailwindcss/postcss";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import postcss from "postcss";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import { NavLink } from ".";

describe("NavLink", () => {
  it("preserves link semantics, children, attributes, className, ref and keyboard focus", async () => {
    const user = userEvent.setup();
    const ref = createRef<HTMLAnchorElement>();
    render(
      <NavLink
        ref={ref}
        href="#features"
        target="_blank"
        rel="noopener"
        data-test="navigation"
        className="custom-class"
      >
        Возможности
      </NavLink>,
    );
    const link = screen.getByRole("link", { name: "Возможности" });
    expect(link).toHaveAttribute("href", "#features");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener");
    expect(link).toHaveAttribute("data-test", "navigation");
    expect(link).toHaveClass("custom-class");
    expect(link).toHaveTextContent("Возможности");
    expect(ref.current).toBe(link);
    await user.tab();
    expect(link).toHaveFocus();
  });

  it("provides theme-aware default, hover, typography and focus utilities", async () => {
    const css = (
      await postcss([tailwindcss()]).process(
        readFileSync("src/_app/styles/globals.css", "utf8"),
        {
          from: "src/_app/styles/globals.css",
        },
      )
    ).css;
    render(<NavLink href="#features">Возможности</NavLink>);
    const link = screen.getByRole("link", { name: "Возможности" });
    expect(link).toHaveClass(
      "[font:var(--type-label)]",
      "text-muted-foreground",
      "hover:text-foreground",
      "focus-visible:shadow-[var(--shadow-focus)]",
    );
    expect(css).toContain("var(--color-muted-foreground)");
    expect(css).toContain(".hover\\:text-foreground");
    expect(css).toContain(".focus-visible\\:shadow-");
  });
});
