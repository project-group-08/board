import { readFileSync } from "node:fs";

import tailwindcss from "@tailwindcss/postcss";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ZoomIn } from "lucide-react";
import postcss from "postcss";
import { beforeAll, describe, expect, it } from "vitest";

import { IconTile } from ".";

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

describe("IconTile", () => {
  it("renders the provided icon without changing its stroke and hides it from accessibility", () => {
    const { container } = render(
      <IconTile icon={<ZoomIn aria-label="Увеличить" strokeWidth={3} />} />,
    );
    const tile = container.firstElementChild!;
    const icon = tile.querySelector("svg")!;
    expect(icon).toHaveAttribute("stroke-width", "3");
    expect(tile).toHaveAttribute("aria-hidden", "true");
    expect(
      screen.queryByRole("img", { name: "Увеличить" }),
    ).not.toBeInTheDocument();
    expect(tile).not.toHaveAttribute("role");
    expect(tile).not.toHaveAttribute("tabindex");
  });

  it("is skipped during keyboard navigation", async () => {
    const user = userEvent.setup();
    render(
      <>
        <button>До</button>
        <IconTile icon={<ZoomIn />} />
        <button>После</button>
      </>,
    );
    await user.tab();
    expect(screen.getByRole("button", { name: "До" })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole("button", { name: "После" })).toHaveFocus();
  });

  it("keeps the tile and icon sizes fixed at different root font sizes", () => {
    const style = document.createElement("style");
    style.textContent = compiledCss;
    document.head.appendChild(style);
    const originalFontSize = document.documentElement.style.fontSize;
    try {
      const { container } = render(<IconTile icon={<ZoomIn />} />);
      const tile = container.firstElementChild!;
      const iconBox = tile.firstElementChild!;
      for (const size of ["16px", "20px"]) {
        document.documentElement.style.fontSize = size;
        expect(getComputedStyle(tile).width).toBe("32px");
        expect(getComputedStyle(tile).height).toBe("32px");
        expect(getComputedStyle(iconBox).width).toBe("16px");
        expect(getComputedStyle(iconBox).height).toBe("16px");
      }
    } finally {
      document.documentElement.style.fontSize = originalFontSize;
      style.remove();
    }
  });
});
