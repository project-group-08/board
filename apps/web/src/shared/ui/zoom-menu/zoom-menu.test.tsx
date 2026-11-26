import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ZoomMenu } from ".";
import { Button } from "../button";

function createProps(zoomPercent = 100) {
  return {
    trigger: <Button>Масштаб</Button>,
    zoomPercent,
    onShowAll: vi.fn<() => void>(),
    onShowSelection: vi.fn<() => void>(),
    onZoomIn: vi.fn<() => void>(),
    onZoomOut: vi.fn<() => void>(),
    onSetZoom: vi.fn<(percent: number) => void>(),
  };
}

describe("ZoomMenu", () => {
  it("shows the ordered actions, shortcuts and separators and closes after each command", async () => {
    const user = userEvent.setup();
    const props = createProps();
    render(<ZoomMenu {...props} />);
    const trigger = screen.getByRole("button", { name: "Масштаб" });
    await user.click(trigger);
    const menu = await screen.findByRole("menu");
    const items = [
      ...within(menu).getAllByRole("menuitem"),
      ...within(menu).getAllByRole("menuitemradio"),
    ];
    expect(items.map((item) => item.textContent)).toEqual([
      "Показать всёShift 1",
      "К выделениюShift 2",
      "УвеличитьCtrl +",
      "УменьшитьCtrl −",
      "50%",
      "100%Shift 0",
      "200%",
    ]);
    expect(within(menu).getAllByRole("separator")).toHaveLength(2);

    for (const [name, callback] of [
      ["Показать всё", props.onShowAll],
      ["К выделению", props.onShowSelection],
      ["Увеличить", props.onZoomIn],
      ["Уменьшить", props.onZoomOut],
    ] as const) {
      await user.click(screen.getByRole("menuitem", { name }));
      expect(callback).toHaveBeenCalledExactlyOnceWith();
      expect(trigger).toHaveAttribute("aria-expanded", "false");
      await waitFor(() =>
        expect(document.querySelector('[role="menu"]')).not.toBeInTheDocument(),
      );
      await user.click(trigger);
      await screen.findByRole("menu");
    }
    expect(props.onSetZoom).not.toHaveBeenCalled();
  });

  it.each([50, 100, 200])(
    "checks only the exactly matching %i%% preset on the right",
    async (zoom) => {
      const user = userEvent.setup();
      render(<ZoomMenu {...createProps(zoom)} />);
      await user.click(screen.getByRole("button", { name: "Масштаб" }));
      const selected = await screen.findByRole("menuitemradio", {
        name: `${zoom}%`,
        checked: true,
      });
      expect(selected.querySelector("svg")).toBeInTheDocument();
      expect(selected.lastElementChild).toContainElement(
        selected.querySelector("svg"),
      );
      const others = screen.getAllByRole("menuitemradio", { checked: false });
      expect(others).toHaveLength(2);
      for (const item of others) {
        expect(item.querySelector("svg")).not.toBeInTheDocument();
      }
    },
  );

  it("does not select an intermediate or nearly matching value", async () => {
    const user = userEvent.setup();
    const props = createProps(75);
    const { rerender } = render(<ZoomMenu {...props} />);
    await user.click(screen.getByRole("button", { name: "Масштаб" }));
    for (const value of [75, 99.999, 100.001]) {
      rerender(<ZoomMenu {...props} zoomPercent={value} />);
      const items = await screen.findAllByRole("menuitemradio");
      for (const item of items) {
        expect(item).toHaveAttribute("aria-checked", "false");
        expect(item.querySelector("svg")).not.toBeInTheDocument();
      }
    }
  });

  it.each([50, 100, 200])(
    "sends preset %i and keeps the consumer value until it changes",
    async (preset) => {
      const user = userEvent.setup();
      const props = createProps(75);
      const { rerender } = render(<ZoomMenu {...props} />);
      const trigger = screen.getByRole("button", { name: "Масштаб" });
      await user.click(trigger);
      await user.click(
        await screen.findByRole("menuitemradio", { name: `${preset}%` }),
      );
      expect(props.onSetZoom).toHaveBeenCalledExactlyOnceWith(preset);
      expect(trigger).toHaveAttribute("aria-expanded", "false");
      await user.click(trigger);
      expect(
        await screen.findByRole("menuitemradio", {
          name: `${preset}%`,
          checked: false,
        }),
      ).toBeInTheDocument();
      rerender(<ZoomMenu {...props} zoomPercent={preset} />);
      expect(
        screen.getByRole("menuitemradio", {
          name: `${preset}%`,
          checked: true,
        }),
      ).toBeInTheDocument();
      expect(props.onSetZoom).toHaveBeenCalledOnce();
    },
  );

  it("supports keyboard selection and restores focus", async () => {
    const user = userEvent.setup();
    const props = createProps(75);
    render(<ZoomMenu {...props} />);
    await user.tab();
    const trigger = screen.getByRole("button", { name: "Масштаб" });
    expect(trigger).toHaveFocus();
    await user.keyboard("{Enter}");
    const first = await screen.findByRole("menuitem", { name: "Показать всё" });
    await waitFor(() => expect(first).toHaveFocus());
    await user.keyboard(
      "{ArrowDown}{ArrowDown}{ArrowDown}{ArrowDown}{ArrowDown}",
    );
    expect(screen.getByRole("menuitemradio", { name: "100%" })).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(props.onSetZoom).toHaveBeenCalledExactlyOnceWith(100);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it("closes on Escape and restores focus without invoking commands", async () => {
    const user = userEvent.setup();
    const props = createProps();
    render(<ZoomMenu {...props} />);
    await user.tab();
    const trigger = screen.getByRole("button", { name: "Масштаб" });
    await user.keyboard("{Enter}");
    await screen.findByRole("menu");
    await user.keyboard("{Escape}");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await waitFor(() => expect(trigger).toHaveFocus());
    for (const callback of [
      props.onShowAll,
      props.onShowSelection,
      props.onZoomIn,
      props.onZoomOut,
      props.onSetZoom,
    ]) {
      expect(callback).not.toHaveBeenCalled();
    }
  });

  it("does not register the displayed keyboard shortcuts", async () => {
    const user = userEvent.setup();
    const props = createProps();
    render(<ZoomMenu {...props} />);
    await user.keyboard("{Shift>}1{/Shift}{Shift>}2{/Shift}{Shift>}0{/Shift}");
    await user.keyboard("{Control>}+{/Control}{Control>}-{/Control}");
    for (const callback of [
      props.onShowAll,
      props.onShowSelection,
      props.onZoomIn,
      props.onZoomOut,
      props.onSetZoom,
    ]) {
      expect(callback).not.toHaveBeenCalled();
    }
  });
});
