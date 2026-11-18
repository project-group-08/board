import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SiteFooter } from ".";

describe("SiteFooter", () => {
  it("renders a footer with the supplied content in order and no navigation", () => {
    render(
      <SiteFooter
        brand="Название"
        copyright="© 2026 Название. Все права защищены"
      />,
    );

    const footer = screen.getByRole("contentinfo");
    expect(footer.tagName).toBe("FOOTER");
    expect(within(footer).queryByRole("navigation")).not.toBeInTheDocument();
    expect(within(footer).queryByRole("link")).not.toBeInTheDocument();
    const brand = within(footer).getByText("Название");
    const copyright = within(footer).getByText(
      "© 2026 Название. Все права защищены",
    );
    expect(
      brand.compareDocumentPosition(copyright) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it("preserves a supplied brand link and rich copyright content", () => {
    render(
      <SiteFooter
        brand={<a href="#home">На главную</a>}
        copyright={
          <span>
            © <strong>2026</strong> Название
          </span>
        }
      />,
    );

    const footer = screen.getByRole("contentinfo");
    const link = within(footer).getByRole("link", { name: "На главную" });
    expect(link).toHaveAttribute("href", "#home");
    expect(within(footer).getByText("2026").tagName).toBe("STRONG");
    expect(within(footer).queryByRole("navigation")).not.toBeInTheDocument();
    expect(footer.querySelectorAll("a")).toHaveLength(1);
  });

  it("provides responsive layout and allows long content to wrap", () => {
    const longText = "НеразрывныйТекст".repeat(12);
    render(<SiteFooter brand={longText} copyright={longText} />);
    const footer = screen.getByRole("contentinfo");
    const content = footer.firstElementChild;
    expect(footer).toHaveClass("w-full", "border-t");
    expect(content).toHaveClass(
      "w-[calc(100%-40px)]",
      "md:w-[calc(100%-80px)]",
      "max-w-[1120px]",
      "flex-col",
      "md:flex-row",
      "items-start",
      "md:items-center",
      "gap-[var(--space-4)]",
      "pb-[var(--space-32)]",
      "md:pb-[var(--space-24)]",
    );
    expect(within(footer).getAllByText(longText)).toHaveLength(2);
    for (const element of within(footer).getAllByText(longText)) {
      expect(element).toHaveClass(
        "min-w-0",
        "max-w-full",
        "[overflow-wrap:anywhere]",
      );
    }
  });
});
