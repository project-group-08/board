import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Search } from "lucide-react";
import { describe, expect, it, vi } from "vitest";

import { EmptyState } from ".";
import { Button } from "../button";

describe("EmptyState", () => {
  const props = {
    icon: <Search aria-label="Поиск" />,
    title: "Ничего не нашлось",
    description: "Попробуйте другой запрос",
  };

  it("renders the default heading and description, hiding the decorative icon", () => {
    const { container } = render(<EmptyState {...props} />);
    expect(
      screen.getByRole("heading", { name: props.title, level: 2 }),
    ).toBeInTheDocument();
    expect(screen.getByText(props.description)).toBeInTheDocument();
    expect(
      container.querySelector("svg")?.closest('[aria-hidden="true"]'),
    ).toBeTruthy();
    expect(
      screen.queryByRole("img", { name: "Поиск" }),
    ).not.toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(container.firstElementChild).not.toHaveAttribute("role");
    expect(container.firstElementChild).not.toHaveAttribute("aria-live");
  });

  it.each(["h1", "h2", "h3", "h4", "h5", "h6"] as const)(
    "uses the consumer's %s heading level",
    (as) => {
      render(<EmptyState {...props} as={as} />);
      expect(
        screen.getByRole("heading", {
          name: props.title,
          level: Number(as[1]),
        }),
      ).toBeInTheDocument();
    },
  );

  it("renders the supplied action and leaves its behavior to the consumer", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn<() => void>();
    render(
      <EmptyState
        {...props}
        action={<Button onClick={onClick}>Повторить</Button>}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Повторить" }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("allows the consumer to override vertical padding", () => {
    const { container } = render(<EmptyState {...props} className="py-0" />);
    expect(container.firstElementChild).toHaveClass("py-0");
    expect(container.firstElementChild).not.toHaveClass("py-[var(--space-48)]");
  });
});
