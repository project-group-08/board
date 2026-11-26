import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { ColorPicker, type ColorPickerOption } from ".";

const options: ColorPickerOption[] = [
  { value: "yellow", color: "#fef3c7", label: "Жёлтый" },
  { value: "blue", color: "#dbeafe", label: "Голубой" },
  { value: "green", color: "#dcfce7", label: "Зелёный" },
];

describe("ColorPicker", () => {
  it("exposes a named native group and named color options", () => {
    render(
      <ColorPicker
        label="Заливка"
        options={options}
        value="yellow"
        onValueChange={() => {}}
      />,
    );
    const group = screen.getByRole("group", { name: "Заливка" });
    const yellow = within(group).getByRole("radio", { name: "Жёлтый" });
    expect(yellow).toBeChecked();
    expect(yellow).toHaveStyle({ backgroundColor: "#fef3c7" });
    expect(within(group).getAllByRole("radio")).toHaveLength(3);
    expect(
      within(group).getByRole("radio", { name: "Голубой" }),
    ).not.toBeChecked();
  });

  it("reports mouse selection without changing until the parent updates value", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn<(value: string) => void>();
    const { rerender } = render(
      <ColorPicker
        label="Заливка"
        options={options}
        value="yellow"
        onValueChange={onValueChange}
      />,
    );
    await user.click(screen.getByRole("radio", { name: "Голубой" }));
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith("blue");
    expect(screen.getByRole("radio", { name: "Жёлтый" })).toBeChecked();
    rerender(
      <ColorPicker
        label="Заливка"
        options={options}
        value="blue"
        onValueChange={onValueChange}
      />,
    );
    expect(screen.getByRole("radio", { name: "Голубой" })).toBeChecked();
    expect(onValueChange).toHaveBeenCalledTimes(1);
  });

  it("supports native arrow-key navigation in a controlled group", async () => {
    const user = userEvent.setup();
    function Example() {
      const [value, setValue] = useState("yellow");
      return (
        <ColorPicker
          label="Заливка"
          options={options}
          value={value}
          onValueChange={setValue}
        />
      );
    }
    render(<Example />);
    await user.tab();
    expect(screen.getByRole("radio", { name: "Жёлтый" })).toHaveFocus();
    await user.keyboard("{ArrowRight}");
    const blue = screen.getByRole("radio", { name: "Голубой" });
    expect(blue).toHaveFocus();
    expect(blue).toBeChecked();
  });

  it("keeps separate picker instances independent", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn<(value: string) => void>();
    render(
      <>
        <ColorPicker
          label="Заливка"
          options={options}
          value="yellow"
          onValueChange={onChange}
        />
        <ColorPicker
          label="Обводка"
          options={options}
          value="blue"
          onValueChange={onChange}
        />
      </>,
    );
    const fill = screen.getByRole("group", { name: "Заливка" });
    const stroke = screen.getByRole("group", { name: "Обводка" });
    await user.click(within(fill).getByRole("radio", { name: "Зелёный" }));
    expect(
      within(stroke).getByRole("radio", { name: "Голубой" }),
    ).toBeChecked();
  });
});
