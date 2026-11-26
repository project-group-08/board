import { readFileSync } from "node:fs";

import tailwindcss from "@tailwindcss/postcss";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import postcss from "postcss";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";

import { HistoryButton } from ".";

describe("HistoryButton", () => {
  it("generates the themed hover and open styles", async () => {
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

    render(<HistoryButton aria-label="История" />);
    const button = screen.getByRole("button");
    expect(button).toHaveClass(
      "size-[44px]",
      "border-border",
      "bg-background",
      "before:inset-[3px]",
      "hover:not-disabled:before:bg-muted",
    );
  });

  it("forwards the ref, controls and accessible name without pressed semantics", () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <HistoryButton
        ref={ref}
        aria-label="История"
        aria-controls="history-panel"
      />,
    );
    const button = screen.getByRole("button", { name: "История" });
    expect(ref.current).toBe(button);
    expect(button).toHaveAttribute("type", "button");
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(button).toHaveAttribute("aria-controls", "history-panel");
    expect(button).not.toHaveAttribute("aria-pressed");
    expect(button.querySelector("svg")).toHaveClass("lucide-history");
    expect(button.querySelector("svg")).toHaveAttribute("stroke-width", "1.5");
    expect(button.querySelector("svg")?.parentElement).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it("keeps open controlled and forwards clicks", async () => {
    const onClick = vi.fn<() => void>();
    const user = userEvent.setup();
    const { rerender } = render(
      <HistoryButton aria-label="История" onClick={onClick} />,
    );
    const button = screen.getByRole("button");
    await user.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(button).toHaveAttribute("aria-expanded", "false");

    rerender(<HistoryButton aria-label="История" open onClick={onClick} />);
    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(button).toHaveClass(
      "before:bg-accent-solid",
      "text-accent-foreground",
    );
    expect(button).not.toHaveClass("hover:not-disabled:before:bg-muted");
    expect(button).not.toHaveAttribute("aria-pressed");
    await user.click(button);
    expect(onClick).toHaveBeenCalledTimes(2);
    expect(button).toHaveAttribute("aria-expanded", "true");
  });

  it("supports keyboard activation and native disabled", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn<() => void>();
    const { rerender } = render(
      <HistoryButton aria-label="История" onClick={onClick} />,
    );
    const button = screen.getByRole("button");
    await user.tab();
    expect(button).toHaveFocus();
    await user.keyboard("{Enter}[Space]");
    expect(onClick).toHaveBeenCalledTimes(2);
    rerender(<HistoryButton aria-label="История" disabled onClick={onClick} />);
    expect(button).toBeDisabled();
    await user.click(button);
    await user.keyboard("{Enter}[Space]");
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it("supports an accessible name supplied by aria-labelledby", () => {
    render(
      <>
        <span id="history-label">История</span>
        <HistoryButton aria-labelledby="history-label" />
      </>,
    );
    expect(screen.getByRole("button", { name: "История" })).toBeInTheDocument();
  });
});
