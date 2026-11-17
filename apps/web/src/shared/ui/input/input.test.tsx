import { readFileSync } from "node:fs";

import tailwindcss from "@tailwindcss/postcss";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import postcss from "postcss";
import { createRef, useState } from "react";
import { beforeAll, describe, expect, it, vi } from "vitest";

import { Input } from ".";

let compiledCss: string;
beforeAll(async () => {
  compiledCss = (
    await postcss([tailwindcss()]).process(
      readFileSync("src/_app/styles/globals.css", "utf8"),
      {
        from: "src/_app/styles/globals.css",
      },
    )
  ).css;
});

describe("Input", () => {
  it("supports a label, ref, description and native attributes", () => {
    const ref = createRef<HTMLInputElement>();
    render(
      <>
        <label htmlFor="email">Почта</label>
        <Input
          ref={ref}
          id="email"
          type="email"
          name="email"
          placeholder="name@company.ru"
          autoComplete="email"
          required
          aria-describedby="hint"
        />
        <span id="hint">Рабочая почта</span>
      </>,
    );
    const input = screen.getByRole("textbox", {
      name: "Почта",
      description: "Рабочая почта",
    });
    expect(ref.current).toBe(input);
    expect(input).toHaveAttribute("type", "email");
    expect(input).toHaveAttribute("name", "email");
    expect(input).toHaveAttribute("autocomplete", "email");
    expect(input).toBeRequired();
    expect(input).toHaveAttribute("placeholder", "name@company.ru");
  });

  it("supports aria-label and aria-labelledby", () => {
    render(
      <>
        <span id="label">Название</span>
        <Input aria-labelledby="label" />
        <Input aria-label="Поиск" />
      </>,
    );
    expect(
      screen.getByRole("textbox", { name: "Название" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Поиск" })).toBeInTheDocument();
  });

  it("allows uncontrolled input and forwards changes in controlled input", async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [value, setValue] = useState("a");
      return (
        <Input
          aria-label="Управляемое"
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
      );
    }
    render(
      <>
        <Input aria-label="Нативное" defaultValue="a" />
        <Controlled />
      </>,
    );
    const native = screen.getByRole("textbox", { name: "Нативное" });
    const controlled = screen.getByRole("textbox", { name: "Управляемое" });
    await user.type(native, "bc");
    await user.type(controlled, "bc");
    expect(native).toHaveValue("abc");
    expect(controlled).toHaveValue("abc");
  });

  it("preserves aria-invalid boolean and string values", () => {
    const { rerender } = render(
      <Input aria-label="Поле" aria-invalid={true} />,
    );
    const input = screen.getByRole("textbox");
    for (const value of [true, "true", false, "false"] as const) {
      rerender(<Input aria-label="Поле" aria-invalid={value} />);
      expect(input).toHaveAttribute("aria-invalid", String(value));
    }
  });

  it.each([
    "aria-[invalid=true]:border-destructive",
    "aria-[invalid=true]:hover:border-destructive",
    "aria-[invalid=true]:focus:border-destructive",
  ])(
    "attaches %s to this input and compiles its border declaration (not the browser cascade)",
    (utility) => {
      render(<Input aria-label="Поле" aria-invalid />);
      const input = screen.getByRole("textbox", { name: "Поле" });
      expect(input).toHaveClass(utility);

      // jsdom не доказывает итоговый каскад: связываем классы этого Input с их CSS-декларациями.
      const selector = `.${utility.replaceAll(/([[\]=:])/g, "\\$1")}`;
      const rules: postcss.Rule[] = [];
      postcss.parse(compiledCss).walkRules((rule) => {
        if (
          rule.selector === selector ||
          rule.selector.startsWith(`${selector}[`)
        )
          rules.push(rule);
      });
      expect(rules).toHaveLength(1);
      const rule = rules[0]!;
      const conditions = [rule.selector];
      rule.walkRules((nested) => {
        conditions.push(nested.selector);
      });
      expect(conditions.join(" ")).toContain('[aria-invalid="true"]');
      const borderColors: string[] = [];
      rule.walkDecls("border-color", (declaration) => {
        borderColors.push(declaration.value);
      });
      expect(borderColors).toEqual(["var(--color-destructive)"]);
    },
  );

  it("prevents editing disabled and read-only inputs", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn<() => void>();
    render(
      <>
        <Input
          aria-label="Недоступно"
          defaultValue="a"
          disabled
          onChange={onChange}
        />
        <Input
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
    await user.type(readOnly, "x");
    expect(disabled).toBeDisabled();
    expect(readOnly).toHaveAttribute("readonly");
    expect(disabled).toHaveValue("a");
    expect(readOnly).toHaveValue("b");
    expect(onChange).not.toHaveBeenCalled();
  });

  it("uses fixed field dimensions at different root font sizes", () => {
    const style = document.createElement("style");
    style.textContent = compiledCss;
    document.head.appendChild(style);
    const originalFontSize = document.documentElement.style.fontSize;
    try {
      render(<Input aria-label="Поле" />);
      const input = screen.getByRole("textbox");
      for (const size of ["16px", "20px"]) {
        document.documentElement.style.fontSize = size;
        const computed = getComputedStyle(input);
        expect(computed.height).toBe("36px");
        expect(computed.width).toBe("100%");
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
