import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { TableHeader } from ".";

describe("TableHeader", () => {
  it("renders the trash labels in order and reserves an unlabelled action column", () => {
    const { container } = render(
      <TableHeader
        kind="trash"
        labels={{ name: "Название", deletedBy: "Удалил", deletedAt: "Удалена" }}
      />,
    );
    const header = container.querySelector('[data-slot="table-header"]');
    expect(header?.children).toHaveLength(4);
    expect(header?.children[0]).toHaveTextContent("Название");
    expect(header?.children[1]).toHaveTextContent("Удалил");
    expect(header?.children[2]).toHaveTextContent("Удалена");
    expect(header?.children[3]).toBeEmptyDOMElement();
    expect(header?.children[3]).toHaveAttribute("aria-hidden", "true");
    expect(header).not.toHaveAttribute("role");
    expect(header).not.toHaveAttribute("tabindex");
    expect(header?.parentElement).toHaveClass("@container");
    expect(header).toHaveClass(
      "hidden",
      "@min-[720px]:grid",
      "@min-[720px]:grid-cols-[minmax(0,1fr)_200px_183px_128px]",
      "gap-[var(--space-16)]",
      "px-[var(--space-16)]",
      "py-[var(--space-8)]",
    );
  });

  it("renders member labels and retains long values with wrapping", () => {
    const longLabel = "ДлиннаяПодписьБезПробелов".repeat(8);
    const { container } = render(
      <TableHeader
        kind="members"
        labels={{ member: longLabel, role: "Роль" }}
      />,
    );
    const header = container.querySelector('[data-slot="table-header"]');
    expect(header?.children).toHaveLength(3);
    expect(header?.children[1]).toHaveTextContent("Роль");
    expect(header?.children[2]).toHaveAttribute("aria-hidden", "true");
    expect(header).toHaveClass(
      "hidden",
      "@min-[720px]:grid",
      "@min-[720px]:grid-cols-[minmax(0,1fr)_200px_32px]",
    );
    expect(screen.getByText(longLabel)).toHaveClass(
      "min-w-0",
      "[overflow-wrap:anywhere]",
    );
  });
});
