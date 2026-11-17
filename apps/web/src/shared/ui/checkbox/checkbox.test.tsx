import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef, useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { Checkbox } from ".";

describe("Checkbox", () => {
  it("forwards ref and native attributes to the input and accepts an accessible name", () => {
    const ref = createRef<HTMLInputElement>();
    render(
      <Checkbox
        ref={ref}
        id="board"
        aria-label="Выбрать доску"
        aria-describedby="hint"
        aria-invalid="true"
        name="board"
        value="one"
        required
      />,
    );
    const input = screen.getByRole("checkbox", { name: "Выбрать доску" });
    expect(ref.current).toBe(input);
    expect(input).toHaveAttribute("type", "checkbox");
    expect(input).toHaveAttribute("id", "board");
    expect(input).toHaveAttribute("name", "board");
    expect(input).toHaveAttribute("value", "one");
    expect(input).toBeRequired();
    expect(input).toHaveAttribute("aria-describedby", "hint");
    expect(input).toHaveAttribute("aria-invalid", "true");
  });

  it("associates a visible label and toggles uncontrolled state by click and Space", async () => {
    const user = userEvent.setup();
    render(
      <>
        <label htmlFor="agree">Согласен</label>
        <Checkbox id="agree" defaultChecked />
      </>,
    );
    const input = screen.getByRole("checkbox", { name: "Согласен" });
    expect(input).toBeChecked();
    await user.click(screen.getByText("Согласен"));
    expect(input).not.toBeChecked();
    expect(input).toHaveFocus();
    await user.keyboard(" ");
    expect(input).toBeChecked();
  });

  it("supports controlled state and native change events", async () => {
    const user = userEvent.setup();
    const changed = vi.fn<(checked: boolean) => void>();
    function Controlled() {
      const [checked, setChecked] = useState(true);
      return (
        <Checkbox
          aria-label="Управляемый"
          checked={checked}
          onChange={(event) => {
            changed(event.target.checked);
            setChecked(event.target.checked);
          }}
        />
      );
    }
    render(<Controlled />);
    const input = screen.getByRole("checkbox", { name: "Управляемый" });
    expect(input).toBeChecked();
    await user.click(input);
    expect(changed.mock.calls).toEqual([[false]]);
    expect(input).not.toBeChecked();
  });

  it("follows parent checked updates without emitting change events", () => {
    const changed = vi.fn<() => void>();
    const { rerender } = render(
      <Checkbox aria-label="Управляемый" checked onChange={changed} />,
    );
    const input = screen.getByRole("checkbox", { name: "Управляемый" });
    expect(input).toBeChecked();
    rerender(
      <Checkbox aria-label="Управляемый" checked={false} onChange={changed} />,
    );
    expect(input).not.toBeChecked();
    rerender(<Checkbox aria-label="Управляемый" checked onChange={changed} />);
    expect(input).toBeChecked();
    expect(changed).not.toHaveBeenCalled();
  });

  it.each([true, false])(
    "retains controlled checked=%s when the parent rejects click and Space changes",
    async (checked) => {
      const user = userEvent.setup();
      const changed = vi.fn<(checked: boolean) => void>();
      render(
        <Checkbox
          aria-label="Управляемый"
          checked={checked}
          onChange={(event) => changed(event.currentTarget.checked)}
        />,
      );
      const input = screen.getByRole("checkbox", { name: "Управляемый" });
      expect(input).toHaveProperty("checked", checked);
      await user.click(input);
      expect(changed.mock.calls).toEqual([[!checked]]);
      expect(input).toHaveProperty("checked", checked);
      await user.keyboard(" ");
      expect(changed.mock.calls).toEqual([[!checked], [!checked]]);
      expect(input).toHaveProperty("checked", checked);
    },
  );

  it("disables interaction and excludes disabled controls from tab order", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn<() => void>();
    render(
      <>
        <Checkbox
          aria-label="Недоступный"
          defaultChecked
          disabled
          onChange={onChange}
        />
        <button>Далее</button>
      </>,
    );
    const input = screen.getByRole("checkbox", { name: "Недоступный" });
    await user.click(input);
    await user.tab();
    expect(input).toBeDisabled();
    expect(input).toBeChecked();
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Далее" })).toHaveFocus();
  });

  it("submits only checked, enabled values and honors required", async () => {
    const user = userEvent.setup();
    render(
      <form aria-label="Форма">
        <Checkbox aria-label="Первый" name="choice" value="first" required />
        <Checkbox
          aria-label="Второй"
          name="choice"
          value="second"
          defaultChecked
        />
        <Checkbox
          aria-label="Отключён"
          name="choice"
          value="disabled"
          defaultChecked
          disabled
        />
      </form>,
    );
    const form = screen.getByRole<HTMLFormElement>("form", { name: "Форма" });
    const first = screen.getByRole("checkbox", { name: "Первый" });
    expect(form.checkValidity()).toBe(false);
    expect(new FormData(form).getAll("choice")).toEqual(["second"]);
    await user.click(first);
    expect(form.checkValidity()).toBe(true);
    expect(new FormData(form).getAll("choice")).toEqual(["first", "second"]);
  });
});
