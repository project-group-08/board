import { readFileSync } from "node:fs";

import { render, screen } from "@testing-library/react";
import postcss from "postcss";
import { describe, expect, it } from "vitest";

import { SectionTitle } from ".";

describe("SectionTitle", () => {
  it("defines separate inverse surface and foreground tokens for both themes", () => {
    const css = postcss.parse(
      readFileSync("src/_app/styles/globals.css", "utf8"),
    );
    const colors: Record<string, Record<string, string>> = {};
    css.walkRules((rule) => {
      const selector = rule.selector.replaceAll('"', "'");
      if (selector !== ":root" && selector !== "[data-theme='dark']") return;
      const values: Record<string, string> = {};
      rule.walkDecls((decl) => {
        values[decl.prop] = decl.value;
      });
      colors[selector] = values;
    });
    expect(colors[":root"]).toMatchObject({
      "--color-inverse": "#18181b",
      "--color-inverse-foreground": "#fafafa",
    });
    expect(colors["[data-theme='dark']"]).toMatchObject({
      "--color-inverse": "#f4f4f5",
      "--color-inverse-foreground": "#18181b",
    });
  });

  it("renders the label as text and the title as an h2 by default", () => {
    render(<SectionTitle label="01 / Возможности" title="Доска для идей" />);
    expect(screen.getByText("01 / Возможности").tagName).toBe("P");
    expect(
      screen.getByRole("heading", { level: 2, name: "Доска для идей" }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("heading")).toHaveLength(1);
    expect(screen.getByText("01 / Возможности")).toHaveClass(
      "text-muted-foreground",
    );
    expect(screen.getByRole("heading")).toHaveClass("text-foreground");
  });

  it("uses inverse foreground for both texts without changing alignment, typography or heading level", () => {
    render(
      <SectionTitle
        title="Заголовок"
        label="Метка"
        tone="on-inverse"
        align="center"
        as="h3"
      />,
    );
    const title = screen.getByRole("heading", { level: 3, name: "Заголовок" });
    expect(title).toHaveClass(
      "text-inverse-foreground",
      "[font:var(--type-heading-2)]",
      "tracking-[var(--tracking-heading-2)]",
    );
    expect(title).not.toHaveClass("text-foreground");
    expect(screen.getByText("Метка")).toHaveClass(
      "text-inverse-foreground",
      "[font:var(--type-mono)]",
    );
    expect(title.parentElement).toHaveClass("text-center");
  });

  it("does not render a label or its spacing when absent or empty", () => {
    const { container, rerender } = render(<SectionTitle title="Заголовок" />);
    expect(container.firstElementChild?.children).toHaveLength(1);
    rerender(<SectionTitle title="Заголовок" label="" />);
    expect(container.firstElementChild?.children).toHaveLength(1);
  });

  it("aligns both texts left by default or centered when requested", () => {
    const { rerender } = render(
      <SectionTitle label="Метка" title="Заголовок" />,
    );
    const wrapper = screen.getByRole("heading").parentElement;
    expect(wrapper).toHaveClass("text-left");
    expect(wrapper).toContainElement(screen.getByText("Метка"));
    rerender(<SectionTitle label="Метка" title="Заголовок" align="center" />);
    expect(wrapper).toHaveClass("text-center");
    expect(wrapper).not.toHaveClass("text-left");
  });

  it.each(["h1", "h2", "h3", "h4", "h5", "h6"] as const)(
    "renders the requested %s heading",
    (as) => {
      render(<SectionTitle title="Заголовок" as={as} />);
      expect(
        screen
          .getByRole("heading", { name: "Заголовок" })
          .tagName.toLowerCase(),
      ).toBe(as);
    },
  );
});
