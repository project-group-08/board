import { readFileSync } from "node:fs";

import tailwindcss from "@tailwindcss/postcss";
import { fireEvent, render, screen, within } from "@testing-library/react";
import postcss from "postcss";
import { beforeAll, describe, expect, it, vi } from "vitest";

import { Avatar } from ".";

let compiledCss: string;

beforeAll(async () => {
  compiledCss = (
    await postcss([tailwindcss()]).process(
      readFileSync("src/_app/styles/globals.css", "utf8"),
      { from: "src/_app/styles/globals.css" },
    )
  ).css;
});

describe("Avatar", () => {
  it.each([
    ["default", "32px"],
    ["large", "64px"],
  ] as const)("renders %s at %s without a border", (size, pixels) => {
    const style = document.createElement("style");
    style.textContent = compiledCss;
    document.head.appendChild(style);
    try {
      render(<Avatar name="Надежда Иванова" fallback="НИ" size={size} />);
      const avatar = screen.getByRole("figure", {
        name: "Надежда Иванова",
      });
      expect(getComputedStyle(avatar).width).toBe(pixels);
      expect(getComputedStyle(avatar).height).toBe(pixels);
      expect(getComputedStyle(avatar).borderWidth).toBe("0px");
      expect(avatar).toHaveClass("rounded-full", "bg-muted", "text-foreground");
      expect(avatar).not.toHaveAttribute("tabindex");
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
      expect(screen.queryByRole("link")).not.toBeInTheDocument();
    } finally {
      style.remove();
    }
  });

  it("uses the existing theme and typography tokens", () => {
    const css = readFileSync("src/_app/styles/globals.css", "utf8");
    expect(css).toMatch(/--color-muted:\s*#f4f4f5/i);
    expect(css).toMatch(/--color-foreground:\s*#18181b/i);
    expect(css).toMatch(/--color-muted:\s*#1c1c1f/i);
    expect(css).toMatch(/--color-foreground:\s*#f4f4f5/i);
    render(<Avatar name="Надежда Иванова" fallback="НИ" />);
    expect(screen.getByRole("figure")).toHaveClass("[font:var(--type-label)]");
  });

  it("shows only the supplied fallback and full accessible name without src", () => {
    render(<Avatar name="Надежда Иванова" fallback="НИ" />);
    const avatar = screen.getByRole("figure", {
      name: "Надежда Иванова",
    });
    expect(avatar).toHaveTextContent("НИ");
    expect(avatar.querySelectorAll("img")).toHaveLength(0);
    expect(screen.getAllByRole("figure")).toHaveLength(1);
  });

  it("shows fallback while loading and the image on success without duplicating its name", () => {
    const image = document.createElement("img");
    vi.spyOn(window, "Image").mockImplementation(function () {
      return image;
    });
    render(<Avatar name="Надежда Иванова" fallback="НИ" src="/photo.png" />);
    const avatar = screen.getByRole("figure", {
      name: "Надежда Иванова",
    });
    expect(avatar).toHaveTextContent("НИ");
    expect(avatar.querySelectorAll("img")).toHaveLength(0);
    fireEvent.load(image);
    const displayed = avatar.querySelector('img[src="/photo.png"]');
    expect(displayed).toHaveAttribute("src", "/photo.png");
    expect(displayed).toHaveAttribute("alt", "");
    expect(displayed).toHaveAttribute("aria-hidden", "true");
    expect(displayed).toHaveClass("object-cover", "size-full");
    expect(avatar).not.toHaveTextContent("НИ");
    expect(screen.getAllByRole("figure")).toHaveLength(1);
    expect(within(avatar).queryByRole("img")).not.toBeInTheDocument();
  });

  it("keeps fallback on image error and resets while a new image loads", () => {
    const images: HTMLImageElement[] = [];
    vi.spyOn(window, "Image").mockImplementation(function () {
      const image = document.createElement("img");
      images.push(image);
      return image;
    });
    const { rerender } = render(
      <Avatar name="Надежда Иванова" fallback="НИ" src="/one.png" />,
    );
    fireEvent.load(images[0]!);
    expect(
      screen.getByRole("figure").querySelector('img[src="/one.png"]'),
    ).toBeInTheDocument();
    rerender(<Avatar name="Надежда Иванова" fallback="НИ" src="/two.png" />);
    expect(screen.getByRole("figure")).toHaveTextContent("НИ");
    fireEvent.error(images[1]!);
    expect(
      screen.getByRole("figure", { name: "Надежда Иванова" }),
    ).toHaveTextContent("НИ");
    expect(screen.getAllByRole("figure")).toHaveLength(1);
    rerender(<Avatar name="Надежда Иванова" fallback="НИ" />);
    expect(screen.getByRole("figure")).toHaveTextContent("НИ");
  });
});
