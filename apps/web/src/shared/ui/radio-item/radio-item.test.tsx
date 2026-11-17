import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef, useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { RadioItem } from ".";

describe("RadioItem", () => {
  it("uses label as its name and combines its description with external descriptions", () => {
    const ref = createRef<HTMLInputElement>();
    render(
      <>
        <p id="extra">Внешняя подсказка</p>
        <RadioItem
          ref={ref}
          id="board"
          name="scope"
          value="board"
          required
          label="Вся доска"
          description="Всё на холсте"
          aria-describedby="extra"
        />
      </>,
    );
    const radio = screen.getByRole("radio", {
      name: "Вся доска",
      description: "Внешняя подсказка Всё на холсте",
    });
    expect(ref.current).toBe(radio);
    expect(radio).toHaveAttribute("type", "radio");
    expect(radio).toHaveAttribute("id", "board");
    expect(radio).toHaveAttribute("name", "scope");
    expect(radio).toHaveAttribute("value", "board");
    expect(radio).toBeRequired();
    expect(radio.getAttribute("aria-describedby")?.split(" ")).toEqual([
      "extra",
      screen.getByText("Всё на холсте").id,
    ]);
  });

  it("updates description references without losing an external reference", () => {
    const { rerender } = render(
      <RadioItem
        label="Вариант"
        description="Описание"
        aria-describedby="extra"
      />,
    );
    const radio = screen.getByRole("radio", { name: "Вариант" });
    const descriptionId = screen.getByText("Описание").id;
    rerender(<RadioItem label="Вариант" aria-describedby="extra" />);
    expect(radio).toHaveAttribute("aria-describedby", "extra");
    expect(document.getElementById(descriptionId)).toBeNull();
    rerender(<RadioItem label="Вариант" />);
    expect(radio).not.toHaveAttribute("aria-describedby");
  });

  it("selects by clicking label or description and preserves native uncontrolled grouping", async () => {
    const user = userEvent.setup();
    render(
      <fieldset>
        <legend>Область</legend>
        <RadioItem
          name="scope"
          value="board"
          label="Вся доска"
          description="Весь холст"
          defaultChecked
        />
        <RadioItem
          name="scope"
          value="selection"
          label="Выделение"
          description="Часть холста"
        />
      </fieldset>,
    );
    const board = screen.getByRole("radio", { name: "Вся доска" });
    const selection = screen.getByRole("radio", { name: "Выделение" });
    await user.click(screen.getByText("Часть холста"));
    expect(selection).toBeChecked();
    expect(board).not.toBeChecked();
    await user.click(screen.getByText("Вся доска"));
    expect(board).toBeChecked();
    expect(selection).not.toBeChecked();
  });

  it("supports a controlled group using native change events", async () => {
    const user = userEvent.setup();
    const changed = vi.fn<(value: string) => void>();
    function Controlled() {
      const [value, setValue] = useState("selection");
      return (
        <>
          <RadioItem
            name="scope"
            value="board"
            label="Доска"
            checked={value === "board"}
            onChange={(event) => {
              changed(event.currentTarget.value);
              setValue(event.currentTarget.value);
            }}
          />
          <RadioItem
            name="scope"
            value="selection"
            label="Выделение"
            checked={value === "selection"}
            onChange={(event) => {
              changed(event.currentTarget.value);
              setValue(event.currentTarget.value);
            }}
          />
        </>
      );
    }
    render(<Controlled />);
    const board = screen.getByRole("radio", { name: "Доска" });
    const selection = screen.getByRole("radio", { name: "Выделение" });
    expect(selection).toBeChecked();
    expect(board).not.toBeChecked();
    await user.click(screen.getByText("Доска"));
    expect(changed.mock.calls).toEqual([["board"]]);
    expect(board).toBeChecked();
    expect(selection).not.toBeChecked();
  });

  it("follows the parent selection without emitting change events", () => {
    const changed = vi.fn<() => void>();
    const group = (value: string) => (
      <fieldset>
        <legend>Область</legend>
        <RadioItem
          name="scope"
          value="board"
          label="Доска"
          checked={value === "board"}
          onChange={changed}
        />
        <RadioItem
          name="scope"
          value="selection"
          label="Выделение"
          checked={value === "selection"}
          onChange={changed}
        />
      </fieldset>
    );
    const { rerender } = render(group("selection"));
    const board = screen.getByRole("radio", { name: "Доска" });
    const selection = screen.getByRole("radio", { name: "Выделение" });
    expect(selection).toBeChecked();
    expect(board).not.toBeChecked();
    rerender(group("board"));
    expect(board).toBeChecked();
    expect(selection).not.toBeChecked();
    rerender(group("selection"));
    expect(selection).toBeChecked();
    expect(board).not.toBeChecked();
    expect(changed).not.toHaveBeenCalled();
  });

  it("reports a proposed value but retains the group selection when the parent rejects it", async () => {
    const user = userEvent.setup();
    const changed = vi.fn<(value: string) => void>();
    render(
      <fieldset>
        <legend>Область</legend>
        <RadioItem
          name="scope"
          value="board"
          label="Доска"
          checked={false}
          onChange={(event) => changed(event.currentTarget.value)}
        />
        <RadioItem
          name="scope"
          value="selection"
          label="Выделение"
          checked
          onChange={(event) => changed(event.currentTarget.value)}
        />
      </fieldset>,
    );
    const board = screen.getByRole("radio", { name: "Доска" });
    const selection = screen.getByRole("radio", { name: "Выделение" });
    expect(selection).toBeChecked();
    expect(board).not.toBeChecked();
    await user.click(screen.getByText("Доска"));
    expect(changed.mock.calls).toEqual([["board"]]);
    expect(selection).toBeChecked();
    expect(board).not.toBeChecked();
  });

  it("enters an unchecked group with Tab, selects with Space and tabs out of the group", async () => {
    const user = userEvent.setup();
    const changed = vi.fn<(value: string) => void>();
    render(
      <>
        <fieldset>
          <legend>Область</legend>
          <RadioItem
            name="scope"
            value="board"
            label="Доска"
            onChange={(event) => changed(event.currentTarget.value)}
          />
          <RadioItem name="scope" value="selection" label="Выделение" />
        </fieldset>
        <button>Далее</button>
      </>,
    );
    const board = screen.getByRole("radio", { name: "Доска" });
    const selection = screen.getByRole("radio", { name: "Выделение" });
    expect(board).not.toBeChecked();
    expect(selection).not.toBeChecked();
    await user.tab();
    expect(board).toHaveFocus();
    await user.keyboard(" ");
    expect(board).toBeChecked();
    expect(selection).not.toBeChecked();
    expect(changed.mock.calls).toEqual([["board"]]);
    await user.keyboard(" ");
    expect(board).toBeChecked();
    expect(changed).toHaveBeenCalledTimes(1);
    await user.tab();
    expect(screen.getByRole("button", { name: "Далее" })).toHaveFocus();
  });

  it.each([
    ["{ArrowRight}", "{ArrowLeft}"],
    ["{ArrowDown}", "{ArrowUp}"],
  ])(
    "moves focus and selection with %s/%s, skipping disabled radios",
    async (forward, backward) => {
      const user = userEvent.setup();
      const changed = vi.fn<(value: string) => void>();
      render(
        <fieldset>
          <legend>Область</legend>
          <RadioItem
            name="scope"
            value="board"
            label="Доска"
            defaultChecked
            onChange={(event) => changed(event.currentTarget.value)}
          />
          <RadioItem name="scope" value="off" label="Недоступно" disabled />
          <RadioItem
            name="scope"
            value="selection"
            label="Выделение"
            onChange={(event) => changed(event.currentTarget.value)}
          />
        </fieldset>,
      );
      const board = screen.getByRole("radio", { name: "Доска" });
      const selection = screen.getByRole("radio", { name: "Выделение" });
      const disabled = screen.getByRole("radio", { name: "Недоступно" });
      await user.tab();
      expect(board).toHaveFocus();
      await user.keyboard(forward);
      expect(selection).toHaveFocus();
      expect(selection).toBeChecked();
      expect(board).not.toBeChecked();
      expect(disabled).not.toBeChecked();
      expect(changed.mock.calls).toEqual([["selection"]]);
      await user.keyboard(backward);
      expect(board).toHaveFocus();
      expect(board).toBeChecked();
      expect(selection).not.toBeChecked();
      expect(disabled).not.toBeChecked();
      expect(changed.mock.calls).toEqual([["selection"], ["board"]]);
    },
  );

  it("prevents selection when disabled and submits only the selected enabled value", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn<() => void>();
    render(
      <form aria-label="Форма">
        <RadioItem name="scope" value="board" label="Доска" defaultChecked />
        <RadioItem
          name="scope"
          value="selection"
          label="Выделение"
          disabled
          onChange={onChange}
        />
      </form>,
    );
    await user.click(screen.getByText("Выделение"));
    expect(screen.getByRole("radio", { name: "Выделение" })).toBeDisabled();
    expect(onChange).not.toHaveBeenCalled();
    expect(
      new FormData(
        screen.getByRole<HTMLFormElement>("form", { name: "Форма" }),
      ).getAll("scope"),
    ).toEqual(["board"]);
  });
});
