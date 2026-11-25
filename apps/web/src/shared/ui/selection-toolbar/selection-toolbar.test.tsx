import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";

import { ColorSwatchButton, CompactValueButton, SelectionToolbar } from ".";

describe("SelectionToolbar", () => {
  it("renders a named group with its children and forwards the ref", () => {
    const ref = createRef<HTMLFieldSetElement>();
    render(
      <SelectionToolbar ref={ref} aria-label="Панель">
        <span>Содержимое</span>
      </SelectionToolbar>,
    );
    const group = screen.getByRole("group", { name: "Панель" });
    expect(ref.current).toBe(group);
    expect(group).toHaveTextContent("Содержимое");
    expect(group).not.toHaveAttribute("role", "toolbar");
  });

  it("moves between buttons with Tab and activates them with Enter and Space", async () => {
    const user = userEvent.setup();
    const onColor = vi.fn<() => void>();
    const onValue = vi.fn<() => void>();
    render(
      <SelectionToolbar aria-label="Панель">
        <ColorSwatchButton
          aria-label="Цвет"
          color="#fef3c7"
          onClick={onColor}
        />
        <CompactValueButton aria-label="Размер" value="14" onClick={onValue} />
      </SelectionToolbar>,
    );
    await user.tab();
    expect(screen.getByRole("button", { name: "Цвет" })).toHaveFocus();
    await user.keyboard("{Enter}");
    await user.tab();
    expect(screen.getByRole("button", { name: "Размер" })).toHaveFocus();
    await user.keyboard(" ");
    expect(onColor).toHaveBeenCalledOnce();
    expect(onValue).toHaveBeenCalledOnce();
  });
});

describe("toolbar buttons", () => {
  it("renders the supplied color and value, labels, refs and button types", () => {
    const colorRef = createRef<HTMLButtonElement>();
    const valueRef = createRef<HTMLButtonElement>();
    const { rerender } = render(
      <>
        <span id="color-label">Образец</span>
        <ColorSwatchButton
          ref={colorRef}
          aria-labelledby="color-label"
          color="#fef3c7"
        />
        <CompactValueButton ref={valueRef} aria-label="Размер" value="14" />
      </>,
    );
    const color = screen.getByRole("button", { name: "Образец" });
    const value = screen.getByRole("button", { name: "Размер" });
    expect(colorRef.current).toBe(color);
    expect(valueRef.current).toBe(value);
    expect(color).toHaveAttribute("type", "button");
    expect(value).toHaveAttribute("type", "button");
    expect(color.querySelector("[style]")).toHaveStyle({
      backgroundColor: "#fef3c7",
    });
    expect(value).toHaveTextContent("14");
    expect(value.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    rerender(
      <>
        <ColorSwatchButton aria-label="Цвет" color="#ffffff" />
        <CompactValueButton aria-label="Размер" value="24" />
      </>,
    );
    expect(
      screen.getByRole("button", { name: "Цвет" }).querySelector("[style]"),
    ).toHaveStyle({ backgroundColor: "#ffffff" });
    expect(screen.getByRole("button", { name: "Размер" })).toHaveTextContent(
      "24",
    );
  });

  it("calls each handler on click and blocks disabled controls", async () => {
    const user = userEvent.setup();
    const onColor = vi.fn<() => void>();
    const onValue = vi.fn<() => void>();
    const { rerender } = render(
      <>
        <ColorSwatchButton aria-label="Цвет" color="red" onClick={onColor} />
        <CompactValueButton aria-label="Размер" value="14" onClick={onValue} />
      </>,
    );
    await user.click(screen.getByRole("button", { name: "Цвет" }));
    await user.click(screen.getByRole("button", { name: "Размер" }));
    rerender(
      <>
        <ColorSwatchButton
          aria-label="Цвет"
          color="red"
          onClick={onColor}
          disabled
        />
        <CompactValueButton
          aria-label="Размер"
          value="14"
          onClick={onValue}
          disabled
        />
      </>,
    );
    for (const button of screen.getAllByRole("button")) {
      expect(button).toBeDisabled();
      await user.click(button);
    }
    expect(onColor).toHaveBeenCalledOnce();
    expect(onValue).toHaveBeenCalledOnce();
  });
});
