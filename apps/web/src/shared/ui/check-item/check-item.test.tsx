import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { CheckItem } from ".";

describe("CheckItem", () => {
  it.each([
    "Создаст черновик",
    "Накидает идеи для мозгового штурма на стикеры",
  ])("aligns the icon with the text block: %s", (text) => {
    const { container } = render(<CheckItem text={text} />);
    const item = screen.getByText(text).parentElement;
    const icon = container.querySelector("svg");
    expect(item).toHaveClass("items-center");
    expect(icon).not.toHaveClass("mt-[var(--space-4)]");
    expect(icon).toHaveAttribute("stroke-width", "2.25");
  });

  it("renders the text and hides the decorative check", () => {
    const { container } = render(<CheckItem text="Создаст черновик схемы" />);
    expect(screen.getByText("Создаст черновик схемы")).toBeInTheDocument();
    const icon = container.querySelector("svg")!;
    expect(icon).toHaveAttribute("aria-hidden", "true");
    expect(icon).toHaveAttribute("stroke-width", "2.25");
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("has no interactive or list semantics and is skipped by keyboard navigation", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <>
        <button>До</button>
        <CheckItem text="Пункт" />
        <button>После</button>
      </>,
    );
    const item = screen.getByText("Пункт").parentElement!;
    expect(item.tagName).toBe("DIV");
    expect(item).not.toHaveAttribute("role");
    expect(item).not.toHaveAttribute("tabindex");
    expect(container.querySelector("li")).toBeNull();
    await user.tab();
    expect(screen.getByRole("button", { name: "До" })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole("button", { name: "После" })).toHaveFocus();
  });

  it("works inside a semantic list", () => {
    render(
      <ul>
        <li>
          <CheckItem text="Первый" />
        </li>
        <li>
          <CheckItem text="Второй" />
        </li>
      </ul>,
    );
    const list = screen.getByRole("list");
    const items = within(list).getAllByRole("listitem");
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent("Первый");
    expect(items[1]).toHaveTextContent("Второй");
  });
});
