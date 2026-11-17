import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef, useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { Select } from ".";
import { Field } from "../field";

const items = [
  { value: "editor", label: "Редактор" },
  { value: "viewer", label: "Наблюдатель" },
  { value: "off", label: "Недоступно", disabled: true },
];

const navigationItems = [
  { value: "editor", label: "Редактор" },
  { value: "off", label: "Недоступно", disabled: true },
  { value: "viewer", label: "Наблюдатель" },
  { value: "off-last", label: "Тоже недоступно", disabled: true },
];

describe("Select", () => {
  it("keeps the chevron and selected check decorative with a 1.5px scaled stroke", async () => {
    const user = userEvent.setup();
    render(<Select aria-label="Роль" items={items} defaultValue="editor" />);
    const trigger = screen.getByRole("combobox", { name: "Роль" });
    const chevron = trigger.querySelector("svg.lucide-chevron-down");
    await user.click(trigger);
    const option = await screen.findByRole("option", {
      name: "Редактор",
      selected: true,
    });
    const check = option.querySelector("svg.lucide-check");

    for (const icon of [chevron, check]) {
      expect(icon).not.toBeNull();
      expect(icon).toHaveAttribute("aria-hidden", "true");
      expect(icon).toHaveAttribute("viewBox", "0 0 24 24");
      expect(icon).toHaveAttribute("width", "16");
      expect(icon).toHaveAttribute("height", "16");
      expect(icon).toHaveAttribute("stroke-width", "2.25");
      expect((Number(icon!.getAttribute("stroke-width")) * 16) / 24).toBe(1.5);
    }
    expect(within(trigger).queryByRole("img")).not.toBeInTheDocument();
    expect(within(option).queryByRole("img")).not.toBeInTheDocument();
  });

  it("connects Field label, error, id and ref to the visible trigger", async () => {
    const user = userEvent.setup();
    const ref = createRef<HTMLButtonElement>();
    render(
      <Field label="Роль" error="Проверьте роль">
        {(props) => (
          <Select {...props} ref={ref} items={items} defaultValue="editor" />
        )}
      </Field>,
    );
    const trigger = screen.getByRole("combobox", {
      name: "Роль",
      description: "Проверьте роль",
    });
    expect(ref.current).toBe(trigger);
    expect(screen.getByText("Роль")).toHaveAttribute("for", trigger.id);
    expect(trigger).toHaveAttribute("aria-invalid", "true");
    expect(trigger).toHaveAttribute(
      "aria-describedby",
      screen.getByText("Проверьте роль").id,
    );
    expect(document.querySelectorAll(`[id="${trigger.id}"]`)).toHaveLength(1);
    await user.click(screen.getByText("Роль"));
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    await waitFor(() =>
      expect(screen.getByRole("option", { name: "Редактор" })).toHaveFocus(),
    );
    await user.keyboard("{Escape}");
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it("closes on an outside click without blocking the page", async () => {
    const user = userEvent.setup();
    const outside = vi.fn<() => void>();
    render(
      <>
        <Select aria-label="Роль" items={items} defaultValue="editor" />
        <button onClick={outside}>Другое действие</button>
      </>,
    );
    const trigger = screen.getByRole("combobox", { name: "Роль" });
    await user.click(trigger);
    await user.click(screen.getByRole("button", { name: "Другое действие" }));
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(outside).toHaveBeenCalledOnce();
  });

  it("selects an option and closes the popup", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn<() => void>();
    render(
      <Select
        aria-label="Роль"
        items={items}
        defaultValue="editor"
        onValueChange={onValueChange}
      />,
    );
    const trigger = screen.getByRole("combobox", { name: "Роль" });
    await user.click(trigger);
    await waitFor(() =>
      expect(trigger).toHaveAttribute("aria-expanded", "true"),
    );
    expect(screen.getByRole("option", { name: "Редактор" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await user.click(screen.getByRole("option", { name: "Наблюдатель" }));
    expect(onValueChange).toHaveBeenCalledWith("viewer");
    expect(trigger).toHaveTextContent("Наблюдатель");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("supports controlled values and keyboard dismissal", async () => {
    const user = userEvent.setup();
    const changed = vi.fn<(value: string | null) => void>();
    function Controlled() {
      const [value, setValue] = useState<string | null>("viewer");
      return (
        <Select
          aria-label="Роль"
          items={items}
          value={value}
          onValueChange={(next) => {
            changed(next);
            setValue(next);
          }}
        />
      );
    }
    render(<Controlled />);
    const trigger = screen.getByRole("combobox", { name: "Роль" });
    expect(trigger).toHaveTextContent("Наблюдатель");
    await user.tab();
    await user.keyboard("{Enter}");
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    await waitFor(() =>
      expect(screen.getByRole("option", { name: "Наблюдатель" })).toHaveFocus(),
    );
    await user.keyboard("{ArrowUp}{Enter}");
    expect(changed.mock.calls).toEqual([["editor"]]);
    expect(trigger).toHaveTextContent("Редактор");
    await user.keyboard("{Enter}{Escape}");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("follows parent value updates without emitting onValueChange", () => {
    const changed = vi.fn<(value: string | null) => void>();
    const { rerender } = render(
      <Select
        aria-label="Роль"
        items={items}
        value="viewer"
        onValueChange={changed}
      />,
    );
    const trigger = screen.getByRole("combobox", { name: "Роль" });
    expect(trigger).toHaveTextContent("Наблюдатель");
    rerender(
      <Select
        aria-label="Роль"
        items={items}
        value="editor"
        onValueChange={changed}
      />,
    );
    expect(trigger).toHaveTextContent("Редактор");
    rerender(
      <Select
        aria-label="Роль"
        items={items}
        value="viewer"
        onValueChange={changed}
      />,
    );
    expect(trigger).toHaveTextContent("Наблюдатель");
    expect(changed).not.toHaveBeenCalled();
  });

  it.each(["pointer", "keyboard"] as const)(
    "retains the controlled value when the parent rejects a %s selection",
    async (interaction) => {
      const user = userEvent.setup();
      const changed = vi.fn<(value: string | null) => void>();
      render(
        <Select
          aria-label="Роль"
          items={items}
          value="viewer"
          onValueChange={changed}
        />,
      );
      const trigger = screen.getByRole("combobox", { name: "Роль" });
      expect(trigger).toHaveTextContent("Наблюдатель");
      if (interaction === "pointer") {
        await user.click(trigger);
      } else {
        await user.tab();
        await user.keyboard("{Enter}");
      }
      await waitFor(() =>
        expect(
          screen.getByRole("option", { name: "Наблюдатель" }),
        ).toHaveFocus(),
      );
      if (interaction === "pointer") {
        await user.click(screen.getByRole("option", { name: "Редактор" }));
      } else {
        await user.keyboard("{ArrowUp}{Enter}");
      }
      expect(changed.mock.calls).toEqual([["editor"]]);
      expect(trigger).toHaveTextContent("Наблюдатель");
      expect(trigger).toHaveAttribute("aria-expanded", "false");
      await user.click(trigger);
      expect(
        await screen.findByRole("option", {
          name: "Наблюдатель",
          selected: true,
        }),
      ).toBeInTheDocument();
      expect(screen.getByRole("option", { name: "Редактор" })).toHaveAttribute(
        "aria-selected",
        "false",
      );
      expect(changed).toHaveBeenCalledTimes(1);
    },
  );

  it("does not select a disabled option by pointer but still selects an enabled option", async () => {
    const user = userEvent.setup();
    const changed = vi.fn<(value: string | null) => void>();
    render(
      <Select
        aria-label="Роль"
        items={navigationItems}
        defaultValue="editor"
        onValueChange={changed}
      />,
    );
    const trigger = screen.getByRole("combobox", { name: "Роль" });
    await user.click(trigger);
    const disabled = await screen.findByRole("option", { name: "Недоступно" });
    await user.click(disabled);
    expect(changed).not.toHaveBeenCalled();
    expect(trigger).toHaveTextContent("Редактор");
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(disabled).toHaveAttribute("aria-selected", "false");
    expect(disabled).toHaveAttribute("aria-disabled", "true");
    await user.click(screen.getByRole("option", { name: "Наблюдатель" }));
    expect(changed.mock.calls).toEqual([["viewer"]]);
    expect(trigger).toHaveTextContent("Наблюдатель");
  });

  it.each(["{Enter}", " "])(
    "does not activate a focused disabled option with %s and still selects an enabled option",
    async (activation) => {
      const user = userEvent.setup();
      const changed = vi.fn<(value: string | null) => void>();
      render(
        <Select
          aria-label="Роль"
          items={navigationItems}
          defaultValue="editor"
          onValueChange={changed}
        />,
      );
      const trigger = screen.getByRole("combobox", { name: "Роль" });
      await user.tab();
      await user.keyboard("{Enter}");
      await waitFor(() =>
        expect(screen.getByRole("option", { name: "Редактор" })).toHaveFocus(),
      );
      const disabled = screen.getByRole<HTMLElement>("option", {
        name: "Недоступно",
      });
      await user.keyboard("{ArrowDown}");
      expect(disabled).toHaveFocus();
      expect(disabled).toHaveAttribute("aria-disabled", "true");
      await user.keyboard(activation);
      expect(changed).not.toHaveBeenCalled();
      expect(trigger).toHaveTextContent("Редактор");
      expect(trigger).toHaveAttribute("aria-expanded", "true");
      expect(disabled).toHaveAttribute("aria-selected", "false");
      expect(screen.getByRole("option", { name: "Редактор" })).toHaveAttribute(
        "aria-selected",
        "true",
      );
      await user.keyboard("{ArrowDown}");
      expect(screen.getByRole("option", { name: "Наблюдатель" })).toHaveFocus();
      await user.keyboard(activation);
      expect(changed.mock.calls).toEqual([["viewer"]]);
      expect(trigger).toHaveTextContent("Наблюдатель");
      expect(trigger).toHaveAttribute("aria-expanded", "false");
    },
  );

  it("disables the entire select through Field", async () => {
    const user = userEvent.setup();
    render(
      <Field label="Роль" disabled>
        {(props) => <Select {...props} items={items} defaultValue="editor" />}
      </Field>,
    );
    const trigger = screen.getByRole("combobox", { name: "Роль" });
    expect(trigger).toBeDisabled();
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it.each(["internal", "external"] as const)(
    "serializes initial and changed values with %s form ownership",
    async (ownership) => {
      const user = userEvent.setup();
      const control = (
        <Select
          aria-label="Роль"
          items={items}
          name="role"
          form={ownership === "external" ? "settings" : undefined}
          defaultValue="editor"
        />
      );
      render(
        <>
          <form id="settings" aria-label="Настройки">
            {ownership === "internal" && control}
          </form>
          {ownership === "external" && control}
        </>,
      );
      const form = screen.getByRole<HTMLFormElement>("form", {
        name: "Настройки",
      });
      const trigger = screen.getByRole<HTMLButtonElement>("combobox", {
        name: "Роль",
      });
      expect(trigger.form).toBe(form);
      expect(new FormData(form).getAll("role")).toEqual(["editor"]);

      await user.tab();
      expect(trigger).toHaveFocus();
      await user.keyboard("{Enter}");
      await waitFor(() =>
        expect(screen.getByRole("option", { name: "Редактор" })).toHaveFocus(),
      );
      await user.keyboard("{ArrowDown}{Enter}");
      expect(trigger).toHaveTextContent("Наблюдатель");
      expect(trigger.form).toBe(form);
      expect(new FormData(form).getAll("role")).toEqual(["viewer"]);
    },
  );

  it.each(["internal", "external"] as const)(
    "excludes a disabled select from its %s form",
    async (ownership) => {
      const user = userEvent.setup();
      const changed = vi.fn<(value: string | null) => void>();
      const control = (
        <Select
          aria-label="Роль"
          items={items}
          name="role"
          form={ownership === "external" ? "settings" : undefined}
          defaultValue="editor"
          disabled
          onValueChange={changed}
        />
      );
      render(
        <>
          <form id="settings" aria-label="Настройки">
            {ownership === "internal" && control}
          </form>
          {ownership === "external" && control}
        </>,
      );
      const form = screen.getByRole<HTMLFormElement>("form", {
        name: "Настройки",
      });
      const trigger = screen.getByRole<HTMLButtonElement>("combobox", {
        name: "Роль",
      });
      expect(trigger.form).toBe(form);
      expect(trigger).toBeDisabled();
      expect(trigger).toHaveTextContent("Редактор");
      expect(new FormData(form).getAll("role")).toEqual([]);
      await user.click(trigger);
      expect(trigger).toHaveAttribute("aria-expanded", "false");
      expect(changed).not.toHaveBeenCalled();
    },
  );

  it("honors an explicit form owner instead of the surrounding form", () => {
    render(
      <>
        <form id="settings" aria-label="Настройки" />
        <form aria-label="Другая форма">
          <Select
            aria-label="Роль"
            items={items}
            name="role"
            form="settings"
            defaultValue="editor"
          />
        </form>
      </>,
    );
    const owner = screen.getByRole<HTMLFormElement>("form", {
      name: "Настройки",
    });
    const surrounding = screen.getByRole<HTMLFormElement>("form", {
      name: "Другая форма",
    });
    expect(screen.getByRole<HTMLButtonElement>("combobox").form).toBe(owner);
    expect(new FormData(owner).getAll("role")).toEqual(["editor"]);
    expect(new FormData(surrounding).getAll("role")).toEqual([]);
  });
});
