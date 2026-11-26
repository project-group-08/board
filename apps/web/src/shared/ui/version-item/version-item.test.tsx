import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { VersionItem } from ".";

describe("VersionItem", () => {
  it("clamps title and author visually while retaining their full accessible name", () => {
    const title = "Очень длинное название версии для просмотра без сокращений";
    const author = "Очень длинное имя автора для чтения без сокращений";
    render(
      <VersionItem
        title={title}
        author={author}
        currentLabel="Текущая"
        selected
        onSelect={vi.fn<() => void>()}
      />,
    );

    expect(
      screen.getByRole("button", { name: `${title} Текущая ${author}` }),
    ).toBeInTheDocument();
    expect(screen.getByText(title)).toHaveClass("line-clamp-2");
    expect(screen.getByText(author)).toHaveClass("line-clamp-2");
  });

  it("renders the supplied content and independent current and selected states", () => {
    const { rerender } = render(
      <VersionItem
        title="Версия"
        author="Автор"
        selected={false}
        onSelect={vi.fn<() => void>()}
      />,
    );
    const button = screen.getByRole("button", { name: "Версия Автор" });
    expect(button).toHaveAttribute("type", "button");
    expect(button).toHaveAttribute("aria-pressed", "false");
    expect(button.querySelector('[data-slot="marker"]')).toHaveClass(
      "bg-background",
    );

    rerender(
      <VersionItem
        title="Версия"
        author="Автор"
        selected
        currentLabel="Текущая"
        onSelect={vi.fn<() => void>()}
      />,
    );
    expect(button).toHaveAttribute("aria-pressed", "true");
    expect(button).toHaveClass("bg-muted");
    expect(button.querySelector('[data-slot="marker"]')).toHaveClass(
      "bg-foreground",
    );
    expect(screen.getByText("Текущая")).toBeInTheDocument();
  });

  it.each([
    [false, false],
    [true, false],
    [false, true],
    [true, true],
  ])(
    "renders lineTop=%s and lineBottom=%s independently",
    (lineTop, lineBottom) => {
      const { container } = render(
        <VersionItem
          title="Версия"
          author="Автор"
          selected={false}
          onSelect={vi.fn<() => void>()}
          lineTop={lineTop}
          lineBottom={lineBottom}
        />,
      );
      expect(Boolean(container.querySelector('[data-slot="line-top"]'))).toBe(
        lineTop,
      );
      expect(
        Boolean(container.querySelector('[data-slot="line-bottom"]')),
      ).toBe(lineBottom);
      expect(
        container.querySelector('[aria-hidden="true"]'),
      ).toBeInTheDocument();
    },
  );

  it("uses native keyboard activation and leaves selection under consumer control", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn<() => void>();
    render(
      <>
        <VersionItem
          title="Первая"
          author="Автор"
          selected={false}
          onSelect={onSelect}
        />
        <VersionItem
          title="Вторая"
          author="Автор"
          selected
          onSelect={onSelect}
        />
      </>,
    );
    const first = screen.getByRole("button", { name: "Первая Автор" });
    const second = screen.getByRole("button", { name: "Вторая Автор" });
    await user.tab();
    expect(first).toHaveFocus();
    await user.keyboard("{Enter}");
    await user.keyboard(" ");
    expect(onSelect).toHaveBeenCalledTimes(2);
    expect(first).toHaveAttribute("aria-pressed", "false");
    await user.tab();
    expect(second).toHaveFocus();
    expect(second).toHaveAttribute("aria-pressed", "true");
  });

  it("updates selection when the consumer updates props", async () => {
    const user = userEvent.setup();
    function Example() {
      const [selected, setSelected] = useState(0);
      return (
        <>
          {[0, 1].map((index) => (
            <VersionItem
              key={index}
              title={`Версия ${index}`}
              author="Автор"
              selected={selected === index}
              onSelect={() => setSelected(index)}
            />
          ))}
        </>
      );
    }
    render(<Example />);
    const first = screen.getByRole("button", { name: "Версия 0 Автор" });
    const second = screen.getByRole("button", { name: "Версия 1 Автор" });
    await user.click(second);
    expect(first).toHaveAttribute("aria-pressed", "false");
    expect(second).toHaveAttribute("aria-pressed", "true");
  });
});
