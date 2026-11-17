import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SectionDescription } from ".";

describe("SectionDescription", () => {
  it("renders children in a paragraph with body typography and muted foreground", () => {
    render(
      <SectionDescription>
        Текст, <strong>стикеры</strong> и фигуры в одном месте.
      </SectionDescription>,
    );
    const paragraph = screen.getByText("стикеры").closest("p");
    expect(paragraph).toHaveTextContent(
      "Текст, стикеры и фигуры в одном месте.",
    );
    expect(paragraph).toHaveClass(
      "[font:var(--type-body-l)]",
      "text-muted-foreground",
    );
    expect(paragraph).not.toHaveClass("text-inverse-foreground");
  });

  it("uses inverse foreground on the inverse surface", () => {
    render(
      <SectionDescription tone="on-inverse">
        Создайте доску и отправьте ссылку коллегам.
      </SectionDescription>,
    );
    const paragraph = screen.getByText(
      "Создайте доску и отправьте ссылку коллегам.",
    );
    expect(paragraph.tagName).toBe("P");
    expect(paragraph).toHaveClass(
      "[font:var(--type-body-l)]",
      "text-inverse-foreground",
    );
    expect(paragraph).not.toHaveClass("text-muted-foreground");
  });
});
