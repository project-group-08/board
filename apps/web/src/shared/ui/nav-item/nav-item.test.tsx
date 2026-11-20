import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import { NavItem } from ".";

describe("NavItem", () => {
  it("exposes a keyboard-focusable link with a decorative icon and forwards attributes", async () => {
    const user = userEvent.setup();
    const ref = createRef<HTMLAnchorElement>();
    render(
      <NavItem
        href="/boards"
        icon={<svg aria-label="Иконка" />}
        ref={ref}
        target="_blank"
        rel="noopener"
      >
        Доски
      </NavItem>,
    );

    const link = screen.getByRole("link", { name: "Доски" });
    expect(link).toHaveAttribute("href", "/boards");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener");
    expect(link).not.toHaveAttribute("aria-current");
    expect(link.querySelector("svg")?.parentElement).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    expect(ref.current).toBe(link);
    await user.tab();
    expect(link).toHaveFocus();
  });

  it("marks only the current section and updates when it changes", () => {
    const icon = <svg />;
    const { rerender } = render(
      <NavItem href="/boards" icon={icon}>
        Доски
      </NavItem>,
    );
    const link = screen.getByRole("link", { name: "Доски" });
    expect(link).not.toHaveAttribute("aria-current");
    rerender(
      <NavItem href="/boards" icon={icon} current>
        Доски
      </NavItem>,
    );
    expect(link).toHaveAttribute("aria-current", "page");
    rerender(
      <NavItem href="/boards" icon={icon} current={false}>
        Доски
      </NavItem>,
    );
    expect(link).not.toHaveAttribute("aria-current");
  });

  it("keeps a long unbroken label available in full", () => {
    const label =
      "ОченьДлинноеНазваниеРазделаБезПробеловКотороеДолжноПереноситься";
    render(
      <NavItem href="/long" icon={<svg />}>
        {label}
      </NavItem>,
    );
    expect(screen.getByRole("link", { name: label })).toHaveTextContent(label);
  });
});
