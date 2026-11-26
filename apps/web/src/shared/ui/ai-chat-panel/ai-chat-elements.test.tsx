import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AiChatMessage, AiChatStatus } from ".";

describe("AiChatMessage", () => {
  it.each(["user", "assistant"] as const)(
    "renders %s content supplied by the consumer",
    (variant) => {
      render(
        <AiChatMessage variant={variant}>
          Текст <strong>сообщения</strong>
        </AiChatMessage>,
      );
      expect(screen.getByText("сообщения").tagName).toBe("STRONG");
      expect(screen.getByText(/Текст/)).toHaveClass("whitespace-pre-wrap");
    },
  );
  it("uses the user bubble only for user messages", () => {
    const { rerender } = render(
      <AiChatMessage variant="user">Текст</AiChatMessage>,
    );
    expect(screen.getByText("Текст")).toHaveClass("bg-muted");
    rerender(<AiChatMessage variant="assistant">Текст</AiChatMessage>);
    expect(screen.getByText("Текст")).not.toHaveClass("bg-muted");
  });
});

describe("AiChatStatus", () => {
  it("animates only the loading icon and respects reduced motion", () => {
    const { container, rerender } = render(
      <AiChatStatus variant="loading">Загрузка</AiChatStatus>,
    );
    expect(container.querySelector("svg")).toHaveClass(
      "animate-spin",
      "motion-reduce:animate-none",
    );
    rerender(<AiChatStatus variant="error">Ошибка</AiChatStatus>);
    expect(container.querySelector("svg")).not.toHaveClass("animate-spin");
    rerender(<AiChatStatus variant="notice">Уведомление</AiChatStatus>);
    expect(container.querySelector("svg")).not.toHaveClass("animate-spin");
  });
  it.each([
    ["loading", "text-muted-foreground"],
    ["error", "text-destructive"],
    ["notice", "bg-muted"],
  ] as const)(
    "renders %s as a visual status without imposing live announcements",
    (variant, className) => {
      const { container } = render(
        <AiChatStatus variant={variant}>
          <span>Текст статуса</span>
        </AiChatStatus>,
      );
      expect(screen.getByText("Текст статуса")).toBeInTheDocument();
      expect(container.firstElementChild).toHaveClass(className);
      expect(container.querySelector("svg")).toHaveAttribute(
        "aria-hidden",
        "true",
      );
      expect(container.firstElementChild).not.toHaveAttribute("role");
    },
  );
});
