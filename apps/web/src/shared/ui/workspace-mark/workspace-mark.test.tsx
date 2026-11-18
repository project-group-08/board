import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { WorkspaceMark } from ".";

describe("WorkspaceMark", () => {
  it.each([
    [
      "default",
      "size-[32px]",
      "rounded-[var(--radius-sm)]",
      "[font:var(--type-label)]",
    ],
    [
      "large",
      "size-[64px]",
      "rounded-[var(--radius-md)]",
      "[font:var(--type-title)]",
    ],
  ] as const)(
    "uses the %s size and typography",
    (size, dimension, radius, font) => {
      render(
        <WorkspaceMark name="Продуктовая команда" fallback="П" size={size} />,
      );
      const mark = screen.getByRole("figure", { name: "Продуктовая команда" });
      expect(mark).toHaveClass(
        dimension,
        radius,
        font,
        "bg-inverse",
        "text-inverse-foreground",
      );
      expect(
        mark.classList.contains("[letter-spacing:var(--tracking-title)]"),
      ).toBe(size === "large");
      expect(mark).not.toHaveAttribute("tabindex");
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
      expect(screen.queryByRole("link")).not.toBeInTheDocument();
    },
  );

  it("shows the supplied fallback unchanged when src is absent", () => {
    render(<WorkspaceMark name="Продуктовая команда" fallback="Текст" />);
    const mark = screen.getByRole("figure", { name: "Продуктовая команда" });
    expect(mark).toHaveTextContent("Текст");
    expect(mark.querySelector("img")).not.toBeInTheDocument();
    expect(screen.getAllByRole("figure")).toHaveLength(1);
  });

  it("shows fallback while loading, then a decorative image with the same accessible name", () => {
    const image = document.createElement("img");
    vi.spyOn(window, "Image").mockImplementation(function () {
      return image;
    });
    render(
      <WorkspaceMark name="Продуктовая команда" fallback="П" src="/logo.png" />,
    );
    const mark = screen.getByRole("figure", { name: "Продуктовая команда" });
    expect(mark).toHaveTextContent("П");
    expect(mark.querySelector("img")).not.toBeInTheDocument();
    fireEvent.load(image);
    const displayed = mark.querySelector('img[src="/logo.png"]');
    expect(displayed).toHaveAttribute("alt", "");
    expect(displayed).toHaveAttribute("aria-hidden", "true");
    expect(displayed).toHaveClass("size-full", "object-cover");
    expect(mark).not.toHaveTextContent("П");
    expect(screen.getAllByRole("figure")).toHaveLength(1);
    expect(within(mark).queryByRole("img")).not.toBeInTheDocument();
  });

  it("shows fallback after an error and when a loaded source changes or disappears", () => {
    const images: HTMLImageElement[] = [];
    vi.spyOn(window, "Image").mockImplementation(function () {
      const image = document.createElement("img");
      images.push(image);
      return image;
    });
    const { rerender } = render(
      <WorkspaceMark name="Продуктовая команда" fallback="П" src="/one.png" />,
    );
    fireEvent.load(images[0]!);
    expect(
      screen.getByRole("figure").querySelector('img[src="/one.png"]'),
    ).toBeInTheDocument();
    rerender(
      <WorkspaceMark name="Продуктовая команда" fallback="П" src="/two.png" />,
    );
    expect(screen.getByRole("figure")).toHaveTextContent("П");
    fireEvent.error(images[1]!);
    expect(
      screen.getByRole("figure", { name: "Продуктовая команда" }),
    ).toHaveTextContent("П");
    expect(screen.getAllByRole("figure")).toHaveLength(1);
    rerender(<WorkspaceMark name="Продуктовая команда" fallback="П" />);
    expect(screen.getByRole("figure")).toHaveTextContent("П");
  });
});
