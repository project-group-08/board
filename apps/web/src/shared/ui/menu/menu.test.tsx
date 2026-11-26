import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import type { ComponentProps } from "react";
import { describe, expect, expectTypeOf, it, vi } from "vitest";

import {
  Menu,
  MenuContent,
  MenuItem,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSub,
  MenuSubContent,
  MenuSubTrigger,
  MenuTrigger,
} from ".";
import { Button } from "../button";

describe("Menu", () => {
  it("requires a controlled radio group in its public type", () => {
    type Props = ComponentProps<typeof MenuRadioGroup>;
    expectTypeOf<
      {} extends Pick<Props, "value"> ? true : false
    >().toEqualTypeOf<false>();
    expectTypeOf<
      {} extends Pick<Props, "onValueChange"> ? true : false
    >().toEqualTypeOf<false>();
    expectTypeOf<
      undefined extends Props["value"] ? true : false
    >().toEqualTypeOf<false>();
    expectTypeOf<
      "defaultValue" extends keyof Props ? true : false
    >().toEqualTypeOf<false>();
    expectTypeOf<
      "checkSide" extends keyof ComponentProps<typeof MenuRadioItem>
        ? true
        : false
    >().toEqualTypeOf<false>();
  });

  it("closes on selection and ignores disabled items", async () => {
    const user = userEvent.setup();
    const action = vi.fn<() => void>();
    render(
      <Menu>
        <MenuTrigger render={<Button>Меню</Button>} />
        <MenuContent>
          <MenuItem disabled onClick={action}>
            Недоступно
          </MenuItem>
          <MenuItem onClick={action}>Открыть</MenuItem>
        </MenuContent>
      </Menu>,
    );
    const trigger = screen.getByRole("button", { name: "Меню" });
    await user.click(trigger);
    await user.click(
      await screen.findByRole("menuitem", { name: "Недоступно" }),
    );
    expect(action).not.toHaveBeenCalled();
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    await user.click(screen.getByRole("menuitem", { name: "Открыть" }));
    expect(action).toHaveBeenCalledOnce();
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("closes on outside click and allows the outside action", async () => {
    const user = userEvent.setup();
    const outside = vi.fn<() => void>();
    render(
      <>
        <Menu>
          <MenuTrigger render={<Button>Меню</Button>} />
          <MenuContent>
            <MenuItem>Открыть</MenuItem>
          </MenuContent>
        </Menu>
        <button onClick={outside}>Снаружи</button>
      </>,
    );
    const trigger = screen.getByRole("button", { name: "Меню" });
    await user.click(trigger);
    await user.click(screen.getByRole("button", { name: "Снаружи" }));
    expect(outside).toHaveBeenCalledOnce();
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("selects a radio item and closes the menu", async () => {
    const user = userEvent.setup();
    const changed = vi.fn<(value: string) => void>();
    function Example() {
      const [value, setValue] = useState("date");
      return (
        <Menu>
          <MenuTrigger render={<Button>Сортировка</Button>} />
          <MenuContent>
            <MenuRadioGroup
              value={value}
              onValueChange={(next: string) => {
                changed(next);
                setValue(next);
              }}
            >
              <MenuRadioItem value="date">Дата</MenuRadioItem>
              <MenuRadioItem value="name">Название</MenuRadioItem>
            </MenuRadioGroup>
          </MenuContent>
        </Menu>
      );
    }
    render(<Example />);
    const trigger = screen.getByRole("button", { name: "Сортировка" });
    await user.click(trigger);
    expect(
      await screen.findByRole("menuitemradio", { name: "Дата", checked: true }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("menuitemradio", { name: "Название" }));
    expect(changed).toHaveBeenCalledWith("name");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await user.click(trigger);
    expect(
      await screen.findByRole("menuitemradio", {
        name: "Название",
        checked: true,
      }),
    ).toBeInTheDocument();
  });

  it("keeps the parent value when a radio change is not accepted", async () => {
    const user = userEvent.setup();
    const changed = vi.fn<(value: string) => void>();
    const { rerender } = render(
      <Menu>
        <MenuTrigger render={<Button>Сортировка</Button>} />
        <MenuContent>
          <MenuRadioGroup value="date" onValueChange={changed}>
            <MenuRadioItem value="date">Дата</MenuRadioItem>
            <MenuRadioItem value="name">Название</MenuRadioItem>
          </MenuRadioGroup>
        </MenuContent>
      </Menu>,
    );
    const trigger = screen.getByRole("button", { name: "Сортировка" });
    await user.click(trigger);
    await user.click(
      await screen.findByRole("menuitemradio", { name: "Название" }),
    );
    expect(changed).toHaveBeenCalledWith("name", expect.anything());
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await user.click(trigger);
    expect(
      await screen.findByRole("menuitemradio", { name: "Дата", checked: true }),
    ).toBeInTheDocument();

    rerender(
      <Menu>
        <MenuTrigger render={<Button>Сортировка</Button>} />
        <MenuContent>
          <MenuRadioGroup value="name" onValueChange={changed}>
            <MenuRadioItem value="date">Дата</MenuRadioItem>
            <MenuRadioItem value="name">Название</MenuRadioItem>
          </MenuRadioGroup>
        </MenuContent>
      </Menu>,
    );
    expect(
      screen.getByRole("menuitemradio", { name: "Название", checked: true }),
    ).toBeInTheDocument();
    expect(changed).toHaveBeenCalledTimes(1);
  });

  it.each([
    { checkSide: undefined, side: "left" },
    { checkSide: "left", side: "left" },
    { checkSide: "right", side: "right" },
  ] as const)(
    "places every radio indicator on the $side side",
    async ({ checkSide, side }) => {
      const user = userEvent.setup();
      function Example() {
        const [value, setValue] = useState("date");
        return (
          <Menu>
            <MenuTrigger render={<Button>Сортировка</Button>} />
            <MenuContent>
              <MenuRadioGroup
                value={value}
                onValueChange={setValue}
                checkSide={checkSide}
              >
                <MenuRadioItem value="date">Дата</MenuRadioItem>
                <MenuRadioItem value="name">Название</MenuRadioItem>
              </MenuRadioGroup>
            </MenuContent>
          </Menu>
        );
      }
      render(<Example />);
      const trigger = screen.getByRole("button", { name: "Сортировка" });
      await user.click(trigger);
      const date = await screen.findByRole("menuitemradio", {
        name: "Дата",
        checked: true,
      });
      const name = screen.getByRole("menuitemradio", {
        name: "Название",
        checked: false,
      });
      const indicator = (item: HTMLElement) =>
        side === "left" ? item.firstElementChild : item.lastElementChild;
      expect(date.querySelector("svg")).toBeInTheDocument();
      expect(indicator(date)).toContainElement(date.querySelector("svg"));
      expect(indicator(name)).toHaveAttribute("aria-hidden", "true");
      await user.click(name);
      expect(trigger).toHaveAttribute("aria-expanded", "false");
      await user.click(trigger);
      const selected = await screen.findByRole("menuitemradio", {
        name: "Название",
        checked: true,
      });
      expect(selected.querySelector("svg")).toBeInTheDocument();
      expect(indicator(selected)).toContainElement(
        selected.querySelector("svg"),
      );
      expect(
        indicator(
          screen.getByRole("menuitemradio", { name: "Дата", checked: false }),
        ),
      ).toHaveAttribute("aria-hidden", "true");
    },
  );

  it("opens a submenu by keyboard and Escape closes each level", async () => {
    const user = userEvent.setup();
    render(
      <Menu>
        <MenuTrigger render={<Button>Меню</Button>} />
        <MenuContent>
          <MenuSub>
            <MenuSubTrigger>Папки</MenuSubTrigger>
            <MenuSubContent>
              <MenuItem>Проекты</MenuItem>
            </MenuSubContent>
          </MenuSub>
        </MenuContent>
      </Menu>,
    );
    const trigger = screen.getByRole("button", { name: "Меню" });
    await user.tab();
    await user.keyboard("{Enter}");
    const sub = await screen.findByRole("menuitem", { name: "Папки" });
    await waitFor(() => expect(sub).toHaveFocus());
    await user.keyboard("{ArrowRight}");
    await waitFor(() =>
      expect(screen.getByRole("menuitem", { name: "Проекты" })).toHaveFocus(),
    );
    await user.keyboard("{Escape}");
    await waitFor(() => expect(sub).toHaveFocus());
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    await user.keyboard("{Escape}");
    await waitFor(() => expect(trigger).toHaveFocus());
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("closes the entire chain when an item in a submenu is activated", async () => {
    const user = userEvent.setup();
    const action = vi.fn<() => void>();
    render(
      <Menu>
        <MenuTrigger render={<Button>Меню</Button>} />
        <MenuContent>
          <MenuSub>
            <MenuSubTrigger>Папки</MenuSubTrigger>
            <MenuSubContent>
              <MenuItem onClick={action}>Проекты</MenuItem>
            </MenuSubContent>
          </MenuSub>
        </MenuContent>
      </Menu>,
    );
    const trigger = screen.getByRole("button", { name: "Меню" });
    await user.tab();
    await user.keyboard("{Enter}");
    await waitFor(() =>
      expect(screen.getByRole("menuitem", { name: "Папки" })).toHaveFocus(),
    );
    await user.keyboard("{ArrowRight}");
    await waitFor(() =>
      expect(screen.getByRole("menuitem", { name: "Проекты" })).toHaveFocus(),
    );
    await user.keyboard("{Enter}");
    expect(action).toHaveBeenCalledOnce();
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });
});
