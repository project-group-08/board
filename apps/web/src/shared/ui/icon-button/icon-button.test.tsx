import { readFileSync } from "node:fs";

import tailwindcss from "@tailwindcss/postcss";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Ellipsis } from "lucide-react";
import postcss from "postcss";
import { createRef } from "react";
import { beforeAll, describe, expect, it, vi } from "vitest";

import { IconButton } from ".";

let compiledCss: string;
beforeAll(async () => {
  compiledCss = (
    await postcss([tailwindcss()]).process(
      readFileSync("src/_app/styles/globals.css", "utf8"),
      {
        from: "src/_app/styles/globals.css",
      },
    )
  ).css;
});

describe("IconButton", () => {
  it("uses the supplied accessible name, hides the decorative icon, and forwards the ref", () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <IconButton ref={ref} aria-label="Открыть меню">
        <svg>
          <title>Другое название</title>
        </svg>
      </IconButton>,
    );
    const button = screen.getByRole("button", { name: "Открыть меню" });
    expect(ref.current).toBe(button);
    expect(button).toHaveAttribute("type", "button");
    expect(button.querySelector("svg")?.parentElement).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    expect(button).not.toHaveAttribute("aria-pressed");
  });

  it("supports aria-labelledby and an explicit submit type", () => {
    render(
      <>
        <span id="menu-label">Меню</span>
        <IconButton aria-labelledby="menu-label" type="submit">
          <Ellipsis />
        </IconButton>
      </>,
    );
    expect(screen.getByRole("button", { name: "Меню" })).toHaveAttribute(
      "type",
      "submit",
    );
  });

  it("activates by keyboard and prevents activation when disabled", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn<() => void>();
    const { rerender } = render(
      <IconButton aria-label="Меню" onClick={onClick}>
        <Ellipsis />
      </IconButton>,
    );
    const button = screen.getByRole("button", { name: "Меню" });
    await user.tab();
    expect(button).toHaveFocus();
    await user.keyboard("{Enter}[Space]");
    expect(onClick).toHaveBeenCalledTimes(2);
    rerender(
      <IconButton aria-label="Меню" onClick={onClick} disabled>
        <Ellipsis />
      </IconButton>,
    );
    expect(button).toBeDisabled();
    await user.click(button);
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it("keeps the button and icon sizes fixed at different root font sizes", () => {
    const style = document.createElement("style");
    style.textContent = compiledCss;
    document.head.appendChild(style);
    const originalFontSize = document.documentElement.style.fontSize;
    try {
      render(
        <IconButton aria-label="Меню">
          <Ellipsis />
        </IconButton>,
      );
      const button = screen.getByRole("button");
      const icon = button.querySelector("svg")!.parentElement!;
      for (const size of ["16px", "20px"]) {
        document.documentElement.style.fontSize = size;
        expect(getComputedStyle(button).width).toBe("32px");
        expect(getComputedStyle(button).height).toBe("32px");
        expect(getComputedStyle(icon).width).toBe("16px");
        expect(getComputedStyle(icon).height).toBe("16px");
      }
    } finally {
      document.documentElement.style.fontSize = originalFontSize;
      style.remove();
    }
  });
});
