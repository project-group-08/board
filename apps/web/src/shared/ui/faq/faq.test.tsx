import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { Faq } from ".";

function Group({
  multiple = false,
  defaultValue,
}: {
  multiple?: boolean;
  defaultValue?: string[];
}) {
  return (
    <Faq.Root multiple={multiple} defaultValue={defaultValue}>
      <Faq.Item value="one" question="Первый вопрос" answer="Первый ответ" />
      <Faq.Item
        value="two"
        question="Второй вопрос"
        answer="Второй ответ"
        as="h4"
      />
    </Faq.Root>
  );
}

describe("Faq", () => {
  it("opens and closes with a mouse and links the accessible panel", async () => {
    const user = userEvent.setup();
    const { container } = render(<Group />);
    const button = screen.getByRole("button", { name: "Первый вопрос" });
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText("Первый ответ")).not.toBeInTheDocument();
    expect(container.querySelector("svg")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    await user.click(button);
    expect(button).toHaveAttribute("aria-expanded", "true");
    const panel = screen.getByRole("region", { name: "Первый вопрос" });
    expect(panel).toHaveTextContent("Первый ответ");
    expect(button).toHaveAttribute("aria-controls", panel.id);
    expect(panel).toHaveAttribute("aria-labelledby", button.id);
    await user.click(button);
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(
      screen.queryByRole("region", { name: "Первый вопрос" }),
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Первый ответ")).not.toBeInTheDocument();
  });

  it("supports keyboard focus, Enter and Space for opening and closing", async () => {
    const user = userEvent.setup();
    render(<Group />);
    const button = screen.getByRole("button", { name: "Первый вопрос" });
    await user.tab();
    expect(button).toHaveFocus();
    for (const key of ["{Enter}", "{Enter}", " ", " "]) {
      const wasOpen = button.getAttribute("aria-expanded") === "true";
      await user.keyboard(key);
      expect(button).toHaveAttribute("aria-expanded", String(!wasOpen));
    }
    await user.tab();
    expect(screen.getByRole("button", { name: "Второй вопрос" })).toHaveFocus();
  });

  it("uses h3 by default and respects the selected heading level", () => {
    render(<Group />);
    expect(
      within(screen.getByRole("heading", { level: 3 })).getByRole("button"),
    ).toHaveTextContent("Первый вопрос");
    expect(
      within(screen.getByRole("heading", { level: 4 })).getByRole("button"),
    ).toHaveTextContent("Второй вопрос");
  });

  it("opens defaultValue and permits at most one open item by default", async () => {
    const user = userEvent.setup();
    render(<Group defaultValue={["one", "two"]} />);
    const first = screen.getByRole("button", { name: "Первый вопрос" });
    const second = screen.getByRole("button", { name: "Второй вопрос" });
    expect(first).toHaveAttribute("aria-expanded", "true");
    expect(second).toHaveAttribute("aria-expanded", "false");
    await user.click(second);
    expect(first).toHaveAttribute("aria-expanded", "false");
    expect(second).toHaveAttribute("aria-expanded", "true");
    await user.click(second);
    expect(second).toHaveAttribute("aria-expanded", "false");
  });

  it("allows multiple items to be opened and closed independently", async () => {
    const user = userEvent.setup();
    render(<Group multiple defaultValue={["one"]} />);
    const first = screen.getByRole("button", { name: "Первый вопрос" });
    const second = screen.getByRole("button", { name: "Второй вопрос" });
    await user.click(second);
    expect(first).toHaveAttribute("aria-expanded", "true");
    expect(second).toHaveAttribute("aria-expanded", "true");
    await user.click(first);
    expect(first).toHaveAttribute("aria-expanded", "false");
    expect(second).toHaveAttribute("aria-expanded", "true");
  });
});
