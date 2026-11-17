import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Field } from ".";
import { Input } from "../input";

describe("Field", () => {
  it("connects the label and visible error to the input", async () => {
    const user = userEvent.setup();
    render(
      <Field label="Почта" error="Введите корректную почту">
        {(props) => <Input {...props} />}
      </Field>,
    );
    const input = screen.getByRole("textbox", {
      name: "Почта",
      description: "Введите корректную почту",
    });
    const error = screen.getByText("Введите корректную почту");
    expect(screen.getByText("Почта")).toHaveAttribute("for", input.id);
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("aria-describedby", error.id);
    await user.click(screen.getByText("Почта"));
    expect(input).toHaveFocus();
  });

  it("creates unique stable IDs and updates error references when error changes", () => {
    function Fields({ error }: { error?: string }) {
      return (
        <>
          <Field label="Первое" error={error}>
            {(props) => <Input {...props} />}
          </Field>
          <Field label="Второе" error="Другая ошибка">
            {(props) => <Input {...props} />}
          </Field>
        </>
      );
    }
    const { rerender } = render(<Fields />);
    const first = screen.getByRole("textbox", { name: "Первое" });
    const second = screen.getByRole("textbox", { name: "Второе" });
    const firstId = first.id;
    expect(firstId).not.toBe(second.id);
    expect(first).not.toHaveAttribute("aria-invalid");
    expect(first).not.toHaveAttribute("aria-describedby");
    const secondErrorId = second.getAttribute("aria-describedby")!;
    expect(document.getElementById(secondErrorId)).toHaveTextContent(
      "Другая ошибка",
    );
    rerender(<Fields error="Ошибка первого" />);
    expect(first.id).toBe(firstId);
    const firstErrorId = first.getAttribute("aria-describedby")!;
    expect(firstErrorId).not.toBe(secondErrorId);
    expect(document.getElementById(firstErrorId)).toHaveTextContent(
      "Ошибка первого",
    );
    expect(first).toHaveAttribute("aria-invalid", "true");
    rerender(<Fields />);
    expect(first.id).toBe(firstId);
    expect(first).not.toHaveAttribute("aria-describedby");
    expect(first).not.toHaveAttribute("aria-invalid");
    expect(document.getElementById(firstErrorId)).toBeNull();
  });

  it("passes disabled to the input and prevents editing", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn<() => void>();
    render(
      <Field label="Почта" disabled>
        {(props) => <Input {...props} onChange={onChange} />}
      </Field>,
    );
    const input = screen.getByRole("textbox", { name: "Почта" });
    expect(input).toBeDisabled();
    await user.type(input, "test");
    expect(onChange).not.toHaveBeenCalled();
  });

  it("keeps the error associated when the field is disabled", () => {
    render(
      <Field label="Почта" error="Ошибка" disabled>
        {(props) => <Input {...props} />}
      </Field>,
    );
    const input = screen.getByRole("textbox", {
      name: "Почта",
      description: "Ошибка",
    });
    expect(input).toBeDisabled();
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute(
      "aria-describedby",
      screen.getByText("Ошибка").id,
    );
  });
});
