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
});
