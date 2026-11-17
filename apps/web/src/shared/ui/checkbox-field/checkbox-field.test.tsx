import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef, useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { CheckboxField } from ".";

describe("CheckboxField", () => {
  it("uses the visible label as the accessible name and toggles uncontrolled state", async () => {
    const user = userEvent.setup();
    render(
      <CheckboxField label="Я принимаю условия использования" defaultChecked />,
    );
    const input = screen.getByRole("checkbox", {
      name: "Я принимаю условия использования",
    });
    expect(input).toBeChecked();
    await user.click(screen.getByText("Я принимаю условия использования"));
    expect(input).not.toBeChecked();
    expect(input).toHaveFocus();
    await user.keyboard(" ");
    expect(input).toBeChecked();
  });

  it("supports controlled state and forwards the native change event", async () => {
    const user = userEvent.setup();
    const changed = vi.fn<(checked: boolean) => void>();
    function Controlled() {
      const [checked, setChecked] = useState(true);
      return (
        <CheckboxField
          label="Согласен"
          checked={checked}
          onChange={(event) => {
            changed(event.target.checked);
            setChecked(event.target.checked);
          }}
        />
      );
    }
    render(<Controlled />);
    const input = screen.getByRole("checkbox", { name: "Согласен" });
    expect(input).toBeChecked();
    await user.click(screen.getByText("Согласен"));
    expect(changed.mock.calls).toEqual([[false]]);
    expect(input).not.toBeChecked();
  });

  it("follows parent checked updates without emitting change events", () => {
    const changed = vi.fn<() => void>();
    const { rerender } = render(
      <CheckboxField label="Согласен" checked onChange={changed} />,
    );
    const input = screen.getByRole("checkbox", { name: "Согласен" });
    expect(input).toBeChecked();
    rerender(
      <CheckboxField label="Согласен" checked={false} onChange={changed} />,
    );
    expect(input).not.toBeChecked();
    rerender(<CheckboxField label="Согласен" checked onChange={changed} />);
    expect(input).toBeChecked();
    expect(changed).not.toHaveBeenCalled();
  });

  it.each([true, false])(
    "retains controlled checked=%s when the parent rejects label and Space changes",
    async (checked) => {
      const user = userEvent.setup();
      const changed = vi.fn<(checked: boolean) => void>();
      render(
        <CheckboxField
          label="Согласен"
          checked={checked}
          onChange={(event) => changed(event.currentTarget.checked)}
        />,
      );
      const input = screen.getByRole("checkbox", { name: "Согласен" });
      expect(input).toHaveProperty("checked", checked);
      await user.click(screen.getByText("Согласен"));
      expect(changed.mock.calls).toEqual([[!checked]]);
      expect(input).toHaveProperty("checked", checked);
      expect(input).toHaveFocus();
      await user.keyboard(" ");
      expect(changed.mock.calls).toEqual([[!checked], [!checked]]);
      expect(input).toHaveProperty("checked", checked);
    },
  );

  it("keeps a disabled checkbox unchanged when its label is clicked", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn<() => void>();
    render(
      <CheckboxField
        label="Недоступно"
        disabled
        defaultChecked
        onChange={onChange}
      />,
    );
    const input = screen.getByRole("checkbox", { name: "Недоступно" });
    await user.click(screen.getByText("Недоступно"));
    expect(input).toBeDisabled();
    expect(input).toBeChecked();
    expect(onChange).not.toHaveBeenCalled();
  });

  it("forwards the input ref, native attributes and external description", () => {
    const ref = createRef<HTMLInputElement>();
    render(
      <>
        <p id="details">Дополнительные сведения</p>
        <CheckboxField
          ref={ref}
          label="Согласие"
          id="consent"
          name="consent"
          value="yes"
          required
          aria-describedby="details"
        />
      </>,
    );
    const input = screen.getByRole("checkbox", {
      name: "Согласие",
      description: "Дополнительные сведения",
    });
    expect(ref.current).toBe(input);
    expect(input).toHaveAttribute("type", "checkbox");
    expect(input).toHaveAttribute("id", "consent");
    expect(input).toHaveAttribute("name", "consent");
    expect(input).toHaveAttribute("value", "yes");
    expect(input).toBeRequired();
    expect(input).toHaveAttribute("aria-describedby", "details");
  });

  it("uses invalid as the source of truth even for conflicting runtime attributes", () => {
    const conflicting = {
      "aria-invalid": false,
      "aria-label": "Другое имя",
      "aria-labelledby": "other",
    };
    const { rerender } = render(
      <CheckboxField {...conflicting} label="Согласие" invalid />,
    );
    const input = screen.getByRole("checkbox", { name: "Согласие" });
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveClass(
      "border-destructive",
      "checked:border-destructive",
    );
    expect(input).not.toHaveAttribute("aria-label");
    expect(input).not.toHaveAttribute("aria-labelledby");
    rerender(
      <CheckboxField {...conflicting} label="Согласие" invalid={false} />,
    );
    expect(input).not.toHaveAttribute("aria-invalid");
    expect(input).not.toHaveClass("border-destructive");
  });
});
