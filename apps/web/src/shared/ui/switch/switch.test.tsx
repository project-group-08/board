import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef, useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { Switch } from ".";

describe("Switch", () => {
  it.each([true, false])(
    "переключает uncontrolled defaultChecked=%s",
    async (initial) => {
      const user = userEvent.setup();
      const changed = vi.fn<(checked: boolean) => void>();
      render(
        <Switch
          aria-label="Настройка"
          defaultChecked={initial}
          onCheckedChange={changed}
        />,
      );
      const control = screen.getByRole("switch", { name: "Настройка" });
      expect(control).toHaveAttribute("aria-checked", String(initial));
      await user.click(control);
      expect(control).toHaveAttribute("aria-checked", String(!initial));
      expect(control).toHaveAttribute(
        !initial ? "data-checked" : "data-unchecked",
      );
      expect(changed).toHaveBeenCalledTimes(1);
      expect(changed).toHaveBeenCalledWith(!initial, expect.anything());
    },
  );

  it("передаёт ref корню и inputRef скрытому полю", () => {
    const ref = createRef<HTMLElement>();
    const inputRef = createRef<HTMLInputElement>();
    const { unmount } = render(
      <Switch
        ref={ref}
        inputRef={inputRef}
        aria-label="Настройка"
        name="setting"
        value="yes"
        required
      />,
    );
    expect(ref.current).toBe(screen.getByRole("switch", { name: "Настройка" }));
    expect(ref.current?.tagName).toBe("SPAN");
    expect(inputRef.current).toHaveAttribute("type", "checkbox");
    expect(inputRef.current).toHaveAttribute("name", "setting");
    expect(inputRef.current).toHaveAttribute("value", "yes");
    expect(inputRef.current).toBeRequired();
    unmount();
    expect(ref.current).toBeNull();
    expect(inputRef.current).toBeNull();
  });

  it("вызывает cleanup callback inputRef при замене и размонтировании", () => {
    const cleanupFirst = vi.fn<() => void>();
    const cleanupSecond = vi.fn<() => void>();
    const first = (node: HTMLInputElement | null) =>
      node ? cleanupFirst : undefined;
    const second = (node: HTMLInputElement | null) =>
      node ? cleanupSecond : undefined;
    const { rerender, unmount } = render(
      <Switch inputRef={first} aria-label="Настройка" />,
    );
    rerender(<Switch inputRef={second} aria-label="Настройка" />);
    expect(cleanupFirst).toHaveBeenCalledTimes(1);
    unmount();
    expect(cleanupSecond).toHaveBeenCalledTimes(1);
  });

  it("поддерживает подпись, Tab и Space", async () => {
    const user = userEvent.setup();
    render(
      <label htmlFor="notifications">
        <Switch id="notifications" defaultChecked />
        Уведомления
      </label>,
    );
    const control = screen.getByRole("switch", { name: "Уведомления" });
    await user.tab();
    expect(control).toHaveFocus();
    await user.keyboard(" ");
    expect(control).not.toBeChecked();
    await user.click(screen.getByText("Уведомления"));
    expect(control).toBeChecked();
  });

  it("передаёт управление controlled-состоянием потребителю", async () => {
    const user = userEvent.setup();
    const changed = vi.fn<(checked: boolean) => void>();
    function Controlled() {
      const [checked, setChecked] = useState(true);
      return (
        <Switch
          aria-label="Настройка"
          checked={checked}
          onCheckedChange={(next) => {
            changed(next);
            setChecked(next);
          }}
        />
      );
    }
    render(<Controlled />);
    const control = screen.getByRole("switch");
    expect(control).toBeChecked();
    await user.click(control);
    expect(changed.mock.calls).toEqual([[false]]);
    expect(control).not.toBeChecked();
  });

  it("отражает изменения checked родителем без вызова onCheckedChange", () => {
    const changed = vi.fn<(checked: boolean) => void>();
    const { rerender } = render(
      <Switch aria-label="Настройка" checked onCheckedChange={changed} />,
    );
    const control = screen.getByRole("switch", { name: "Настройка" });
    expect(control).toBeChecked();
    rerender(
      <Switch
        aria-label="Настройка"
        checked={false}
        onCheckedChange={changed}
      />,
    );
    expect(control).not.toBeChecked();
    rerender(
      <Switch aria-label="Настройка" checked onCheckedChange={changed} />,
    );
    expect(control).toBeChecked();
    expect(changed).not.toHaveBeenCalled();
  });

  it.each([true, false])(
    "сохраняет controlled checked=%s при отклонении клика и Space родителем",
    async (checked) => {
      const user = userEvent.setup();
      const changed = vi.fn<(checked: boolean) => void>();
      render(
        <Switch
          aria-label="Настройка"
          checked={checked}
          onCheckedChange={(next) => changed(next)}
        />,
      );
      const control = screen.getByRole("switch", { name: "Настройка" });
      expect(control).toHaveAttribute("aria-checked", String(checked));
      await user.click(control);
      expect(changed.mock.calls).toEqual([[!checked]]);
      expect(control).toHaveAttribute("aria-checked", String(checked));
      await user.keyboard(" ");
      expect(changed.mock.calls).toEqual([[!checked], [!checked]]);
      expect(control).toHaveAttribute("aria-checked", String(checked));
    },
  );

  it("передаёт в отправку формы только включённые доступные значения", async () => {
    const user = userEvent.setup();
    const submitted = vi.fn<(values: FormDataEntryValue[]) => void>();
    render(
      <form
        aria-label="Форма"
        onSubmit={(event) => {
          event.preventDefault();
          submitted(new FormData(event.currentTarget).getAll("setting"));
        }}
      >
        <Switch name="setting" value="first" aria-label="Первый" />
        <Switch
          name="setting"
          value="second"
          aria-label="Второй"
          defaultChecked
        />
        <Switch
          name="setting"
          value="disabled"
          aria-label="Недоступный"
          defaultChecked
          disabled
        />
        <button type="submit">Отправить</button>
      </form>,
    );
    await user.click(screen.getByRole("button", { name: "Отправить" }));
    expect(submitted).toHaveBeenLastCalledWith(["second"]);
    await user.click(screen.getByRole("switch", { name: "Первый" }));
    await user.click(screen.getByRole("button", { name: "Отправить" }));
    expect(submitted).toHaveBeenLastCalledWith(["first", "second"]);
  });

  it("исключает disabled из взаимодействия и Tab", async () => {
    const user = userEvent.setup();
    const changed = vi.fn<(checked: boolean) => void>();
    render(
      <>
        <Switch
          aria-label="Недоступно"
          defaultChecked
          disabled
          onCheckedChange={changed}
        />
        <button>Далее</button>
      </>,
    );
    const control = screen.getByRole("switch");
    await user.click(control);
    await user.tab();
    expect(control).toHaveAttribute("aria-disabled", "true");
    expect(control).toBeChecked();
    expect(changed).not.toHaveBeenCalled();
    expect(screen.getByRole("button")).toHaveFocus();
  });
});
