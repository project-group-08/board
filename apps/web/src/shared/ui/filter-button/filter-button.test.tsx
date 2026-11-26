import { composeStories } from "@storybook/react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef, useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { FilterButton } from ".";
import {
  Menu,
  MenuContent,
  MenuRadioGroup,
  MenuRadioItem,
  MenuTrigger,
} from "../menu";
import * as stories from "./filter-button.stories";

describe("FilterButton", () => {
  it("forwards props and ref, renders a decorative chevron and reflects open", async () => {
    const click = vi.fn<() => void>();
    const ref = createRef<HTMLButtonElement>();
    const { rerender } = render(
      <FilterButton
        ref={ref}
        text="Владелец: все"
        onClick={click}
        aria-label="Фильтр владельца"
      />,
    );
    const button = screen.getByRole("button", { name: "Фильтр владельца" });
    expect(ref.current).toBe(button);
    expect(button).toHaveAttribute("type", "button");
    expect(button.querySelector("svg")).toHaveAttribute("stroke-width", "1.5");
    expect(button.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    await userEvent.click(button);
    expect(click).toHaveBeenCalledOnce();
    rerender(
      <FilterButton text="Владелец: все" open disabled onClick={click} />,
    );
    expect(screen.getByRole("button")).toBeDisabled();
    expect(screen.getByRole("button")).toHaveClass("bg-muted-hover");
    expect(screen.getByRole("button").querySelector("svg")).toHaveClass(
      "rotate-180",
    );
  });

  it("composes with Menu for selection, Escape and focus restoration", async () => {
    const user = userEvent.setup();
    const selected = vi.fn<(value: string) => void>();
    function Example() {
      const [open, setOpen] = useState(false);
      const [value, setValue] = useState("все");
      return (
        <Menu open={open} onOpenChange={setOpen}>
          <MenuTrigger
            render={<FilterButton text={`Владелец: ${value}`} open={open} />}
          />
          <MenuContent>
            <MenuRadioGroup
              value={value}
              onValueChange={(next: string) => {
                setValue(next);
                selected(next);
              }}
            >
              <MenuRadioItem value="все">Все</MenuRadioItem>
              <MenuRadioItem value="я">Я</MenuRadioItem>
            </MenuRadioGroup>
          </MenuContent>
        </Menu>
      );
    }
    render(<Example />);
    const trigger = screen.getByRole("button", { name: "Владелец: все" });
    await user.tab();
    await user.keyboard("{Enter}");
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(trigger.querySelector("svg")).toHaveClass("rotate-180");
    await user.keyboard("{Escape}");
    await waitFor(() => expect(trigger).toHaveFocus());
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger.querySelector("svg")).not.toHaveClass("rotate-180");
    await user.click(trigger);
    await user.click(await screen.findByRole("menuitemradio", { name: "Я" }));
    expect(selected).toHaveBeenCalledWith("я");
    expect(trigger).toHaveTextContent("Владелец: я");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });
});

describe("FilterButton stories", () => {
  const examples = composeStories(stories);

  it.each([
    ["Default", examples.Default],
    ["LongLabel", examples.LongLabel],
  ])("keeps the menu interactive in %s", async (_name, Example) => {
    const user = userEvent.setup();
    render(<Example />);
    const trigger = screen.getByRole("button");
    await user.tab();
    await user.keyboard("{Enter}");
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    await user.click(await screen.findByRole("menuitemradio", { name: "Я" }));
    expect(trigger).toHaveTextContent(/: я$/);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await user.click(trigger);
    await user.keyboard("{Escape}");
    await waitFor(() => expect(trigger).toHaveFocus());
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });
});
