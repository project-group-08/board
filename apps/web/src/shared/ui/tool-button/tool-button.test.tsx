import { readFileSync } from "node:fs";

import tailwindcss from "@tailwindcss/postcss";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import postcss from "postcss";
import { createRef } from "react";
import { beforeAll, describe, expect, it, vi } from "vitest";

import { ToolButton } from ".";

let compiledCss: string;
beforeAll(async () => {
  compiledCss = (
    await postcss([tailwindcss()]).process(
      readFileSync("src/_app/styles/globals.css", "utf8"),
      { from: "src/_app/styles/globals.css" },
    )
  ).css;
});

describe("ToolButton", () => {
  it("exposes an accessible name, decorative icon, ref and button type", () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <ToolButton ref={ref} aria-label="Указатель">
        <svg>
          <title>Декоративная иконка</title>
        </svg>
      </ToolButton>,
    );
    const button = screen.getByRole("button", { name: "Указатель" });
    expect(ref.current).toBe(button);
    expect(button).toHaveAttribute("type", "button");
    expect(button).toHaveAttribute("aria-pressed", "false");
    expect(button.querySelector("svg")?.parentElement).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it("keeps selection controlled and exposes its changes through aria-pressed", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn<() => void>();
    const { rerender } = render(
      <ToolButton aria-label="Указатель" onClick={onClick}>
        иконка
      </ToolButton>,
    );
    const button = screen.getByRole("button", { name: "Указатель" });
    await user.tab();
    expect(button).toHaveFocus();
    await user.keyboard("{Enter}[Space]");
    expect(onClick).toHaveBeenCalledTimes(2);
    expect(button).toHaveAttribute("aria-pressed", "false");
    rerender(
      <ToolButton aria-label="Указатель" selected onClick={onClick}>
        иконка
      </ToolButton>,
    );
    expect(button).toHaveAttribute("aria-pressed", "true");
    expect(button).toHaveFocus();
    rerender(
      <ToolButton aria-label="Указатель" selected disabled onClick={onClick}>
        иконка
      </ToolButton>,
    );
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-pressed", "true");
    await user.click(button);
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it("supports aria-labelledby and an explicit button type", () => {
    render(
      <>
        <span id="tool-label">Указатель</span>
        <ToolButton aria-labelledby="tool-label" type="submit">
          иконка
        </ToolButton>
      </>,
    );
    expect(screen.getByRole("button", { name: "Указатель" })).toHaveAttribute(
      "type",
      "submit",
    );
  });

  it("keeps the specified size and state styles when selected or disabled", () => {
    const style = document.createElement("style");
    style.textContent = compiledCss;
    document.head.appendChild(style);
    try {
      const { rerender } = render(
        <ToolButton aria-label="Указатель">иконка</ToolButton>,
      );
      const button = screen.getByRole("button");
      expect(getComputedStyle(button).width).toBe("36px");
      expect(getComputedStyle(button).height).toBe("36px");
      expect(button).toHaveClass(
        "hover:not-disabled:bg-muted",
        "disabled:opacity-40",
        "focus-visible:shadow-[var(--shadow-focus)]",
      );
      rerender(
        <ToolButton aria-label="Указатель" selected disabled>
          иконка
        </ToolButton>,
      );
      expect(button).toHaveClass(
        "bg-accent-solid",
        "text-accent-foreground",
        "hover:not-disabled:bg-accent-solid",
        "focus-visible:bg-accent-solid",
        "disabled:opacity-40",
      );
      expect(button).not.toHaveClass(
        "hover:not-disabled:bg-muted-hover",
        "focus-visible:bg-background",
      );
    } finally {
      style.remove();
    }
  });
});
