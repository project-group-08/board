import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import { Badge } from ".";

describe("Badge", () => {
  it.each([
    [undefined, "bg-muted", "text-foreground"],
    ["outline", "border-border", "text-muted-foreground"],
    ["accent", "bg-[var(--color-accent-soft)]", "text-accent"],
    ["destructive", "border-destructive", "text-destructive"],
  ] as const)(
    "renders the %s variant as visible noninteractive text",
    (variant, background, color) => {
      render(<Badge variant={variant}>Статус</Badge>);
      const badge = screen.getByText("Статус");
      expect(badge.tagName).toBe("SPAN");
      expect(badge).toBeVisible();
      expect(badge).not.toHaveAttribute("role");
      expect(badge).not.toHaveAttribute("aria-hidden");
      expect(badge).not.toHaveAttribute("tabindex");
      expect(badge).toHaveClass(
        background,
        color,
        "min-h-[24px]",
        "[overflow-wrap:anywhere]",
      );
    },
  );

  it("forwards span attributes and ref and merges className", () => {
    const ref = createRef<HTMLSpanElement>();
    render(
      <Badge
        ref={ref}
        id="role"
        title="Роль участника"
        data-testid="badge"
        className="px-[12px]"
      >
        Редактор
      </Badge>,
    );
    const badge = screen.getByTestId("badge");
    expect(ref.current).toBe(badge);
    expect(badge).toHaveAttribute("id", "role");
    expect(badge).toHaveAttribute("title", "Роль участника");
    expect(badge).toHaveClass("px-[12px]");
    expect(badge).not.toHaveClass("px-[var(--space-8)]");
  });

  it("keeps long text intact", () => {
    const text = "Приглашение ожидает подтверждения участника";
    render(<Badge>{text}</Badge>);
    expect(screen.getByText(text)).toHaveTextContent(text);
  });
});
