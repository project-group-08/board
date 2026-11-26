import { readFileSync } from "node:fs";

import tailwindcss from "@tailwindcss/postcss";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ArrowRight, Plus } from "lucide-react";
import postcss from "postcss";
import { createRef } from "react";
import { beforeAll, describe, it, expect, vi } from "vitest";

import { Button, buttonVariants } from ".";

let compiledCss: string;

beforeAll(async () => {
  const result = await postcss([tailwindcss()]).process(
    readFileSync("src/_app/styles/globals.css", "utf8"),
    { from: "src/_app/styles/globals.css" },
  );
  compiledCss = result.css;
});

describe("Button", () => {
  it("uses native button semantics, forwards a ref and activates with keyboard", async () => {
    const onClick = vi.fn<() => void>();
    const ref = createRef<HTMLButtonElement>();
    const user = userEvent.setup();
    render(
      <Button ref={ref} onClick={onClick}>
        Начать
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Начать" });
    expect(button).toHaveAttribute("type", "button");
    expect(ref.current).toBe(button);
    await user.tab();
    expect(button).toHaveFocus();
    await user.keyboard("{Enter}[Space]");
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it("prevents disabled and loading activation and exposes loading", async () => {
    const onClick = vi.fn<() => void>();
    const user = userEvent.setup();
    const { rerender } = render(
      <Button onClick={onClick} disabled>
        Сохранить
      </Button>,
    );
    await user.click(screen.getByRole("button"));
    rerender(
      <Button onClick={onClick} loading loadingLabel="Сохранение">
        Сохранить
      </Button>,
    );
    const button = screen.getByRole("button", {
      name: /Сохранить.*Сохранение/,
    });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(button.querySelector(".lucide-loader-circle")).toBeInTheDocument();
    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("prioritizes loading over aria-busy and otherwise preserves the supplied value", () => {
    const { rerender } = render(
      <Button loading aria-busy={false}>
        Сохранить
      </Button>,
    );
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-busy", "true");

    rerender(
      <Button loading={false} aria-busy={true}>
        Сохранить
      </Button>,
    );
    expect(button).toHaveAttribute("aria-busy", "true");
    rerender(
      <Button loading={false} aria-busy={false}>
        Сохранить
      </Button>,
    );
    expect(button).toHaveAttribute("aria-busy", "false");
    rerender(
      <Button loading={false} aria-busy="false">
        Сохранить
      </Button>,
    );
    expect(button).toHaveAttribute("aria-busy", "false");
    rerender(<Button loading={false}>Сохранить</Button>);
    expect(button).not.toHaveAttribute("aria-busy");
  });

  it("replaces both decorative icons while loading and restores them afterwards", () => {
    const { rerender } = render(
      <Button leadingIcon={<Plus />} trailingIcon={<ArrowRight />} loading>
        Добавить
      </Button>,
    );
    expect(document.querySelector(".lucide-plus")).not.toBeInTheDocument();
    expect(
      document.querySelector(".lucide-arrow-right"),
    ).not.toBeInTheDocument();
    rerender(
      <Button leadingIcon={<Plus />} trailingIcon={<ArrowRight />} disabled>
        Добавить
      </Button>,
    );
    expect(document.querySelector(".lucide-plus")).toBeInTheDocument();
    expect(document.querySelector(".lucide-arrow-right")).toBeInTheDocument();
    expect(
      document.querySelector(".lucide-plus")?.parentElement,
    ).toHaveAttribute("aria-hidden", "true");
    expect(
      document.querySelector(".lucide-arrow-right")?.parentElement,
    ).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByRole("button", { name: "Добавить" })).toBeDisabled();
    rerender(
      <Button leadingIcon={<Plus />} trailingIcon={<ArrowRight />}>
        Добавить
      </Button>,
    );
    expect(
      screen.getByRole("button", { name: "Добавить" }),
    ).not.toHaveAttribute("aria-busy");
  });

  it("supports an explicit submit type", () => {
    render(<Button type="submit">Отправить</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
  });

  it.each([
    [
      "outline",
      [
        "bg-background",
        "text-foreground",
        "border-border",
        "hover:not-disabled:bg-muted-hover",
        "focus-visible:border-accent",
      ],
    ],
    [
      "destructive",
      [
        "bg-destructive",
        "text-destructive-foreground",
        "hover:not-disabled:bg-destructive-hover",
      ],
    ],
  ] as const)(
    "switches the rendered button to %s utility classes (not a browser appearance check)",
    (variant, classes) => {
      const { rerender } = render(<Button>Действие</Button>);
      const button = screen.getByRole("button", { name: "Действие" });
      expect(button).toHaveClass("bg-primary", "text-primary-foreground");
      rerender(<Button variant={variant}>Действие</Button>);
      expect(button).toHaveClass(...classes);
      expect(button).not.toHaveClass("bg-primary");
      expect(button).not.toHaveClass("text-primary-foreground");
      rerender(<Button>Действие</Button>);
      expect(button).toHaveClass("bg-primary", "text-primary-foreground");
      for (const className of classes)
        expect(button).not.toHaveClass(className);
    },
  );

  it("applies variant and size classes to a native link with default fallback", () => {
    const { rerender } = render(
      <a
        href="#boards"
        className={buttonVariants({ variant: "accent", size: "large" })}
      >
        Доски
      </a>,
    );
    const link = screen.getByRole("link", { name: "Доски" });
    expect(link).toHaveAttribute("href", "#boards");
    expect(link).toHaveClass("inline-flex", "bg-accent-solid", "h-[40px]");
    rerender(
      <a
        href="#boards"
        className={buttonVariants({ variant: "ghost", size: "small" })}
      >
        Доски
      </a>,
    );
    expect(link).toHaveClass("bg-transparent", "h-[32px]");
    expect(link).not.toHaveClass("bg-accent-solid", "h-[40px]");
    rerender(
      <a href="#boards" className={buttonVariants()}>
        Доски
      </a>,
    );
    expect(link).toHaveClass("bg-primary", "h-[36px]");
  });

  it("applies the actual variant and size stylesheet rules to a link", () => {
    const style = document.createElement("style");
    style.textContent = compiledCss;
    document.head.appendChild(style);
    try {
      const { rerender } = render(
        <a
          href="#boards"
          className={buttonVariants({ variant: "accent", size: "large" })}
        >
          Доски
        </a>,
      );
      const link = screen.getByRole("link");
      expect(getComputedStyle(link).height).toBe("40px");
      let variantRule: postcss.Rule | undefined;
      postcss.parse(compiledCss).walkRules(".bg-accent-solid", (rule) => {
        variantRule = rule;
      });
      expect(variantRule).toBeDefined();
      expect(link.matches(variantRule!.selector)).toBe(true);
      expect(
        variantRule!.nodes.some(
          (node) =>
            node.type === "decl" &&
            node.prop === "background-color" &&
            node.value === "var(--color-accent-solid)",
        ),
      ).toBe(true);
      rerender(
        <a
          href="#boards"
          className={buttonVariants({ variant: "ghost", size: "small" })}
        >
          Доски
        </a>,
      );
      expect(getComputedStyle(link).height).toBe("32px");
      expect(link.matches(variantRule!.selector)).toBe(false);
      expect(getComputedStyle(link).backgroundColor).toBe("rgba(0, 0, 0, 0)");
    } finally {
      style.remove();
    }
  });

  it("defines theme-specific tokens consumed by compiled button utilities", () => {
    const css = postcss.parse(compiledCss);
    const rules: Record<string, Record<string, string>> = {};
    css.walkRules((rule) => {
      const selector = rule.selector.replaceAll('"', "'");
      if (selector === ":root" || selector === "[data-theme='dark']") {
        const values: Record<string, string> = {};
        rule.walkDecls((decl) => {
          values[decl.prop] = decl.value;
        });
        if (values["--color-primary"]) rules[selector] = values;
      }
    });
    expect(rules[":root"]?.["--color-primary"]).toBe("#18181b");
    expect(rules["[data-theme='dark']"]?.["--color-primary"]).toBe("#f4f4f5");
    expect(rules[":root"]?.["--color-background"]).toBe("#fff");
    expect(rules["[data-theme='dark']"]?.["--color-background"]).toBe(
      "#0e0e10",
    );
    expect(rules["[data-theme='dark']"]?.["--color-accent"]).toBe("#4f8bff");
    expect(rules["[data-theme='dark']"]?.["--color-accent-solid"]).toBe(
      "#2563eb",
    );
    let primary: postcss.Rule | undefined;
    css.walkRules(".bg-primary", (rule) => {
      primary = rule;
    });
    expect(
      primary?.nodes.some(
        (node) =>
          node.type === "decl" &&
          node.prop === "background-color" &&
          node.value === "var(--color-primary)",
      ),
    ).toBe(true);
  });

  it("accepts the full-width utility through className", () => {
    render(<Button className="w-full">Продолжить</Button>);
    expect(screen.getByRole("button")).toHaveClass("w-full");
  });

  it("isolates the extra-small outline hover for buttons and links", () => {
    for (const size of ["default", "large", "small"] as const) {
      const classes = buttonVariants({ variant: "outline", size });
      expect(classes).toContain("hover:not-disabled:bg-muted-hover");
      expect(classes.split(" ")).not.toContain("hover:not-disabled:bg-muted");
    }
    const classes = buttonVariants({ variant: "outline", size: "extra-small" });
    expect(classes).toContain("hover:not-disabled:bg-muted");
    expect(classes).not.toContain("hover:not-disabled:bg-muted-hover");
    render(
      <>
        <Button variant="outline" size="extra-small">
          Подсказка
        </Button>
        <a href="#suggestion" className={classes}>
          Ссылка
        </a>
        <Button size="extra-small">Основная</Button>
      </>,
    );
    expect(screen.getByRole("button", { name: "Подсказка" })).toHaveClass(
      "hover:not-disabled:bg-muted",
    );
    expect(screen.getByRole("link", { name: "Ссылка" })).toHaveClass(
      "hover:not-disabled:bg-muted",
    );
    expect(screen.getByRole("button", { name: "Основная" })).toHaveClass(
      "bg-primary",
    );
  });

  it("preserves keyboard, disabled and loading behavior for extra-small", async () => {
    const onClick = vi.fn<() => void>();
    const user = userEvent.setup();
    const { rerender } = render(
      <Button variant="outline" size="extra-small" onClick={onClick}>
        Подсказка
      </Button>,
    );
    await user.tab();
    expect(screen.getByRole("button")).toHaveFocus();
    await user.keyboard("{Enter}[Space]");
    expect(onClick).toHaveBeenCalledTimes(2);
    rerender(
      <Button variant="outline" size="extra-small" onClick={onClick} disabled>
        Подсказка
      </Button>,
    );
    await user.click(screen.getByRole("button"));
    rerender(
      <Button variant="outline" size="extra-small" onClick={onClick} loading>
        Подсказка
      </Button>,
    );
    expect(screen.getByRole("button")).toBeDisabled();
    expect(screen.getByRole("button")).toHaveAttribute("aria-busy", "true");
    await user.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it("applies extra-small geometry in the compiled stylesheet", () => {
    const style = document.createElement("style");
    style.textContent = compiledCss;
    document.head.appendChild(style);
    try {
      render(<Button size="extra-small">Подсказка</Button>);
      const computed = getComputedStyle(screen.getByRole("button"));
      expect(computed.height).toBe("28px");
      expect(computed.paddingInline).toBe("10px");
      expect(computed.borderRadius).toBe("8px");
      expect(computed.fontSize).toBe("13px");
      expect(computed.lineHeight).toBe("20px");
      expect(computed.fontWeight).toBe("400");
    } finally {
      style.remove();
    }
  });

  it("keeps button and icon dimensions fixed when the root font size changes", () => {
    const style = document.createElement("style");
    style.textContent = compiledCss;
    document.head.appendChild(style);
    const originalFontSize = document.documentElement.style.fontSize;
    try {
      const { rerender } = render(
        <Button leadingIcon={<Plus />}>Начать</Button>,
      );
      for (const rootSize of ["16px", "20px"]) {
        document.documentElement.style.fontSize = rootSize;
        for (const [size, height, padding] of [
          ["default", "36px", "15px"],
          ["large", "40px", "23px"],
          ["small", "32px", "11px"],
        ] as const) {
          rerender(
            <Button size={size} leadingIcon={<Plus />}>
              Начать
            </Button>,
          );
          const button = screen.getByRole("button");
          const computed = getComputedStyle(button);
          expect(computed.height).toBe(height);
          expect(computed.paddingInline).toBe(padding);
          expect(computed.fontSize).toBe("14px");
          expect(computed.lineHeight).toBe("20px");
          expect(computed.gap).toBe("8px");
          const icon = button.querySelector(".lucide-plus")!.parentElement!;
          expect(getComputedStyle(icon).width).toBe("16px");
          expect(getComputedStyle(icon).height).toBe("16px");
        }
      }
    } finally {
      document.documentElement.style.fontSize = originalFontSize;
      style.remove();
    }
  });

  it("applies hidden, height, radius and width in the compiled Tailwind cascade", () => {
    const style = document.createElement("style");
    style.textContent = compiledCss;
    document.head.appendChild(style);
    try {
      const { rerender } = render(<Button hidden>Начать</Button>);
      const button = screen.getByRole("button", { hidden: true });
      expect(getComputedStyle(button).display).toBe("none");
      rerender(<Button className="hidden">Начать</Button>);
      expect(getComputedStyle(button).display).toBe("none");
      rerender(<Button className="h-12 w-full rounded-none">Начать</Button>);
      expect(getComputedStyle(button).height).toBe("48px");
      expect(getComputedStyle(button).borderRadius).toBe("0px");
      expect(getComputedStyle(button).width).toBe("100%");
      rerender(<Button>Начать</Button>);
      expect(getComputedStyle(button).display).toBe("inline-flex");
      expect(getComputedStyle(button).height).toBe("36px");
    } finally {
      style.remove();
    }
  });
});
