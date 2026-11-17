import { readFileSync } from "node:fs";

import tailwindcss from "@tailwindcss/postcss";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import postcss from "postcss";
import { createRef, useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { Textarea } from ".";
import { Field } from "../field";

describe("Textarea", () => {
  it("forwards a label, ref, placeholder and native attributes", () => {
    const ref = createRef<HTMLTextAreaElement>();
    render(
      <>
        <label htmlFor="description">Описание</label>
        <Textarea
          ref={ref}
          id="description"
          name="description"
          placeholder="Опишите задачу"
          rows={4}
          required
        />
      </>,
    );
    const textarea = screen.getByRole("textbox", { name: "Описание" });
    expect(ref.current).toBe(textarea);
    expect(textarea.tagName).toBe("TEXTAREA");
    expect(textarea).toHaveAttribute("name", "description");
    expect(textarea).toHaveAttribute("rows", "4");
    expect(textarea).toHaveAttribute("placeholder", "Опишите задачу");
    expect(textarea).toBeRequired();
  });

  it("supports controlled and uncontrolled input", async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [value, setValue] = useState("a");
      return (
        <Textarea
          aria-label="Управляемое"
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
      );
    }
    render(
      <>
        <Textarea aria-label="Нативное" defaultValue="a" />
        <Controlled />
      </>,
    );
    const native = screen.getByRole("textbox", { name: "Нативное" });
    const controlled = screen.getByRole("textbox", { name: "Управляемое" });
    await user.type(native, "bc{enter}d");
    await user.type(controlled, "bc{enter}d");
    expect(native).toHaveValue("abc\nd");
    expect(controlled).toHaveValue("abc\nd");
  });

  it("preserves aria-invalid values", () => {
    const { rerender } = render(
      <Textarea aria-label="Описание" aria-invalid />,
    );
    const textarea = screen.getByRole("textbox", { name: "Описание" });
    for (const value of [true, "true", false, "false"] as const) {
      rerender(<Textarea aria-label="Описание" aria-invalid={value} />);
      expect(textarea).toHaveAttribute("aria-invalid", String(value));
    }
  });

  it("preserves native disabled and read-only behavior", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn<() => void>();
    render(
      <>
        <Textarea
          aria-label="Недоступно"
          defaultValue="a"
          disabled
          onChange={onChange}
        />
        <Textarea
          aria-label="Только чтение"
          defaultValue="b"
          readOnly
          onChange={onChange}
        />
      </>,
    );
    const disabled = screen.getByRole("textbox", { name: "Недоступно" });
    const readOnly = screen.getByRole("textbox", { name: "Только чтение" });
    await user.type(disabled, "x");
    await user.click(readOnly);
    expect(readOnly).toHaveFocus();
    await user.type(readOnly, "x");
    expect(disabled).toBeDisabled();
    expect(readOnly).toHaveAttribute("readonly");
    expect(disabled).toHaveValue("a");
    expect(readOnly).toHaveValue("b");
    expect(onChange).not.toHaveBeenCalled();
  });

  it("connects Field label, error and disabled state to the native textarea", () => {
    render(
      <Field label="Описание" error="Добавьте описание" disabled>
        {(props) => <Textarea {...props} />}
      </Field>,
    );
    const textarea = screen.getByRole("textbox", {
      name: "Описание",
      description: "Добавьте описание",
    });
    expect(screen.getByText("Описание")).toHaveAttribute("for", textarea.id);
    expect(textarea).toHaveAttribute("aria-invalid", "true");
    expect(textarea).toHaveAttribute(
      "aria-describedby",
      screen.getByText("Добавьте описание").id,
    );
    expect(textarea).toBeDisabled();
  });

  it("compiles the intended geometry at different root font sizes", async () => {
    const css = (
      await postcss([tailwindcss()]).process(
        readFileSync("src/_app/styles/globals.css", "utf8"),
        {
          from: "src/_app/styles/globals.css",
        },
      )
    ).css;
    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);
    const originalFontSize = document.documentElement.style.fontSize;
    try {
      render(<Textarea aria-label="Описание" />);
      const textarea = screen.getByRole("textbox", { name: "Описание" });
      for (const size of ["16px", "20px"]) {
        document.documentElement.style.fontSize = size;
        const computed = getComputedStyle(textarea);
        expect(computed.height).toBe("80px");
        expect(computed.width).toBe("100%");
        expect(computed.boxSizing).toBe("border-box");
        expect(computed.paddingBlock).toBe("8px");
        expect(computed.paddingInline).toBe("12px");
        expect(computed.fontSize).toBe("14px");
        expect(computed.lineHeight).toBe("20px");
      }
    } finally {
      document.documentElement.style.fontSize = originalFontSize;
      style.remove();
    }
  });
});
