import { readFileSync } from "node:fs";

import tailwindcss from "@tailwindcss/postcss";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import postcss from "postcss";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";

import { AiChatButton } from ".";

describe("AiChatButton", () => {
  it("generates the themed hover, open and reduced-motion styles", async () => {
    const css = (
      await postcss([tailwindcss()]).process(
        readFileSync("src/_app/styles/globals.css", "utf8"),
        { from: "src/_app/styles/globals.css" },
      )
    ).css;
    expect(css).toContain(
      ".hover\\:not-disabled\\:before\\:bg-muted:hover:not(:disabled)::before",
    );
    expect(css).toContain(".before\\:bg-accent-solid::before");
    expect(css).toContain("@media (prefers-reduced-motion: reduce)");
    expect(css).toContain(".motion-reduce\\:animate-none");

    render(<AiChatButton aria-label="ИИ-чат" />);
    const button = screen.getByRole("button");
    expect(button).toHaveClass(
      "size-[44px]",
      "border-border",
      "bg-background",
      "before:inset-[3px]",
    );
  });

  it("forwards the ref and exposes disclosure semantics and an accessible name", () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <AiChatButton ref={ref} aria-label="ИИ-чат" aria-controls="chat-panel" />,
    );
    const button = screen.getByRole("button", { name: "ИИ-чат" });
    expect(ref.current).toBe(button);
    expect(button).toHaveAttribute("type", "button");
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(button).toHaveAttribute("aria-controls", "chat-panel");
    expect(button).not.toHaveAttribute("aria-pressed");
    expect(button.querySelector("svg")?.parentElement).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    expect(button.querySelector("svg")).toHaveClass(
      "lucide-bot-message-square",
    );
  });

  it("keeps open and loading controlled, including their combination", async () => {
    const onClick = vi.fn<() => void>();
    const user = userEvent.setup();
    const { rerender } = render(
      <AiChatButton aria-label="ИИ-чат" onClick={onClick} />,
    );
    const button = screen.getByRole("button");
    await user.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(button).toHaveClass("hover:not-disabled:before:bg-muted");

    rerender(
      <AiChatButton aria-label="ИИ-чат" open loading onClick={onClick} />,
    );
    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(button).toHaveClass(
      "before:bg-accent-solid",
      "text-accent-foreground",
    );
    expect(button.querySelector("svg")).toHaveClass(
      "lucide-loader-circle",
      "animate-spin",
      "motion-reduce:animate-none",
    );
    expect(button).toBeEnabled();
    await user.click(button);
    expect(onClick).toHaveBeenCalledTimes(2);

    rerender(<AiChatButton aria-label="ИИ-чат" loading />);
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(button).not.toHaveClass("before:bg-accent-solid");
    rerender(<AiChatButton aria-label="ИИ-чат" open />);
    expect(button).not.toHaveAttribute("aria-busy");
    expect(button.querySelector("svg")).toHaveClass(
      "lucide-bot-message-square",
    );
  });

  it("supports keyboard activation and native disabled independently of loading", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn<() => void>();
    const { rerender } = render(
      <AiChatButton aria-label="ИИ-чат" loading onClick={onClick} />,
    );
    const button = screen.getByRole("button");
    await user.tab();
    expect(button).toHaveFocus();
    await user.keyboard("{Enter}[Space]");
    expect(onClick).toHaveBeenCalledTimes(2);
    rerender(
      <AiChatButton aria-label="ИИ-чат" loading disabled onClick={onClick} />,
    );
    expect(button).toBeDisabled();
    await user.click(button);
    await user.keyboard("{Enter}[Space]");
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it("supports an accessible name supplied by aria-labelledby", () => {
    render(
      <>
        <span id="chat-label">ИИ-чат</span>
        <AiChatButton aria-labelledby="chat-label" />
      </>,
    );
    expect(screen.getByRole("button", { name: "ИИ-чат" })).toBeInTheDocument();
  });
});
