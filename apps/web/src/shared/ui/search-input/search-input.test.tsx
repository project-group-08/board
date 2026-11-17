import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef, type RefCallback, useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { SearchInput } from ".";

describe("SearchInput", () => {
  it("passes Tailwind overrides to the input", () => {
    render(
      <SearchInput
        aria-label="Поиск"
        clearLabel="Очистить"
        className="pr-[52px] pl-[50px]"
      />,
    );
    const input = screen.getByRole("searchbox");
    expect(input).toHaveClass("pl-[50px]", "pr-[52px]");
    expect(input).not.toHaveClass("pl-[37px]", "pr-[12px]");
  });

  it("forwards ref, label, and native attributes to a search input", () => {
    const ref = createRef<HTMLInputElement>();
    render(
      <>
        <label htmlFor="query">Поиск досок</label>
        <SearchInput
          ref={ref}
          id="query"
          name="query"
          clearLabel="Очистить"
          placeholder="Поиск"
          required
          autoComplete="off"
          aria-describedby="hint"
        />
        <span id="hint">Подсказка</span>
      </>,
    );
    const input = screen.getByRole("searchbox", {
      name: "Поиск досок",
      description: "Подсказка",
    });
    expect(ref.current).toBe(input);
    expect(input).toHaveAttribute("type", "search");
    expect(input).toHaveAttribute("name", "query");
    expect(input).toHaveAttribute("autocomplete", "off");
    expect(input).toBeRequired();
  });

  it("clears object refs on replacement and unmount", () => {
    const first = createRef<HTMLInputElement>();
    const second = createRef<HTMLInputElement>();
    const { rerender, unmount } = render(
      <SearchInput ref={first} aria-label="Поиск" clearLabel="Очистить" />,
    );
    const input = screen.getByRole("searchbox");
    expect(first.current).toBe(input);
    rerender(
      <SearchInput ref={second} aria-label="Поиск" clearLabel="Очистить" />,
    );
    expect(first.current).toBeNull();
    expect(second.current).toBe(input);
    unmount();
    expect(second.current).toBeNull();
  });

  it("detaches callbacks without cleanup with null on replacement and unmount", () => {
    const first = vi.fn<(node: HTMLInputElement | null) => void>();
    const second = vi.fn<(node: HTMLInputElement | null) => void>();
    const { rerender, unmount } = render(
      <SearchInput ref={first} aria-label="Поиск" clearLabel="Очистить" />,
    );
    const input = screen.getByRole("searchbox");
    expect(first.mock.calls).toEqual([[input]]);
    rerender(
      <SearchInput ref={second} aria-label="Поиск" clearLabel="Очистить" />,
    );
    expect(first.mock.calls).toEqual([[input], [null]]);
    expect(second.mock.calls).toEqual([[input]]);
    unmount();
    expect(second.mock.calls).toEqual([[input], [null]]);
  });

  it("runs callback-ref cleanup on unmount instead of calling the ref with null", () => {
    const cleanup = vi.fn<() => void>();
    const ref = vi.fn<RefCallback<HTMLInputElement>>((node) =>
      node ? cleanup : undefined,
    );
    const { unmount } = render(
      <SearchInput ref={ref} aria-label="Поиск" clearLabel="Очистить" />,
    );
    const input = screen.getByRole("searchbox");
    expect(ref.mock.calls).toEqual([[input]]);
    expect(cleanup).not.toHaveBeenCalled();
    unmount();
    expect(cleanup).toHaveBeenCalledTimes(1);
    expect(ref.mock.calls).toEqual([[input]]);
  });

  it("cleans up the previous callback before attaching its replacement", () => {
    const calls: string[] = [];
    const cleanupFirst = vi.fn<() => void>(() => {
      calls.push("cleanup first");
    });
    const cleanupSecond = vi.fn<() => void>(() => {
      calls.push("cleanup second");
    });
    const first = vi.fn<RefCallback<HTMLInputElement>>((node) => {
      if (!node) return;
      calls.push("attach first");
      return cleanupFirst;
    });
    const second = vi.fn<RefCallback<HTMLInputElement>>((node) => {
      if (!node) return;
      calls.push("attach second");
      return cleanupSecond;
    });
    const { rerender, unmount } = render(
      <SearchInput ref={first} aria-label="Поиск" clearLabel="Очистить" />,
    );
    const input = screen.getByRole("searchbox");
    rerender(
      <SearchInput ref={second} aria-label="Поиск" clearLabel="Очистить" />,
    );
    expect(cleanupFirst).toHaveBeenCalledTimes(1);
    expect(cleanupSecond).not.toHaveBeenCalled();
    expect(first.mock.calls).toEqual([[input]]);
    expect(second.mock.calls).toEqual([[input]]);
    expect(calls).toEqual(["attach first", "cleanup first", "attach second"]);

    rerender(
      <SearchInput ref={second} aria-label="Поиск" clearLabel="Очистить" />,
    );
    expect(second).toHaveBeenCalledTimes(1);
    expect(cleanupSecond).not.toHaveBeenCalled();
    unmount();
    expect(cleanupFirst).toHaveBeenCalledTimes(1);
    expect(cleanupSecond).toHaveBeenCalledTimes(1);
    expect(second.mock.calls).toEqual([[input]]);
    expect(calls).toEqual([
      "attach first",
      "cleanup first",
      "attach second",
      "cleanup second",
    ]);
  });

  it("notifies input and clear separately in uncontrolled mode and does not submit", async () => {
    const user = userEvent.setup();
    const onChange =
      vi.fn<(event: React.ChangeEvent<HTMLInputElement>) => void>();
    const onValueChange = vi.fn<(value: string) => void>();
    const onSubmit = vi.fn<(event: React.FormEvent) => void>((event) =>
      event.preventDefault(),
    );
    render(
      <form onSubmit={onSubmit}>
        <SearchInput
          aria-label="Поиск"
          clearLabel="Очистить поиск"
          shortcut="Ctrl K"
          onChange={onChange}
          onValueChange={onValueChange}
        />
      </form>,
    );
    const input = screen.getByRole("searchbox", { name: "Поиск" });
    expect(screen.getByText("Ctrl K")).toBeInTheDocument();
    await user.type(input, "ab");
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onValueChange.mock.calls).toEqual([["a"], ["ab"]]);
    expect(screen.queryByText("Ctrl K")).not.toBeInTheDocument();
    await user.tab();
    expect(
      screen.getByRole("button", { name: "Очистить поиск" }),
    ).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(input).toHaveValue("");
    expect(input).toHaveFocus();
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onValueChange.mock.calls).toEqual([["a"], ["ab"], [""]]);
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText("Ctrl K")).toBeInTheDocument();
  });

  it("supports controlled input and leaves clearing to the parent", async () => {
    const user = userEvent.setup();
    const onChange =
      vi.fn<(event: React.ChangeEvent<HTMLInputElement>) => void>();
    const onValueChange = vi.fn<(value: string) => void>();
    function Controlled() {
      const [value, setValue] = useState("");
      return (
        <SearchInput
          aria-label="Поиск"
          clearLabel="Очистить"
          value={value}
          onChange={onChange}
          onValueChange={(next) => {
            onValueChange(next);
            setValue(next);
          }}
        />
      );
    }
    render(<Controlled />);
    const input = screen.getByRole("searchbox");
    await user.type(input, "xy");
    expect(input).toHaveValue("xy");
    await user.click(screen.getByRole("button", { name: "Очистить" }));
    expect(input).toHaveValue("");
    expect(input).toHaveFocus();
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onValueChange.mock.calls).toEqual([["x"], ["xy"], [""]]);
  });

  it("does not mutate a controlled value when the parent does not update it", async () => {
    const user = userEvent.setup();
    const changed = vi.fn<(value: string) => void>();
    render(
      <SearchInput
        aria-label="Поиск"
        clearLabel="Очистить"
        value="abc"
        onValueChange={changed}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Очистить" }));
    expect(changed).toHaveBeenCalledWith("");
    expect(screen.getByRole("searchbox")).toHaveValue("abc");
  });

  it("hides clear for disabled and read-only inputs", () => {
    render(
      <>
        <SearchInput
          aria-label="Недоступно"
          clearLabel="Очистить"
          defaultValue="abc"
          disabled
        />
        <SearchInput
          aria-label="Только чтение"
          clearLabel="Очистить"
          defaultValue="abc"
          readOnly
        />
      </>,
    );
    expect(
      screen.getByRole("searchbox", { name: "Недоступно" }),
    ).toBeDisabled();
    expect(
      screen.getByRole("searchbox", { name: "Только чтение" }),
    ).toHaveAttribute("readonly");
    expect(
      screen.queryByRole("button", { name: "Очистить" }),
    ).not.toBeInTheDocument();
  });

  it("synchronizes an uncontrolled input after reset and cancelled reset", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn<(value: string) => void>();
    let cancel = false;
    render(
      <form
        aria-label="Форма"
        onReset={(event) => {
          if (cancel) event.preventDefault();
        }}
      >
        <SearchInput
          aria-label="Поиск"
          clearLabel="Очистить"
          shortcut="Ctrl K"
          name="query"
          onValueChange={onValueChange}
        />
        <button type="reset">Сбросить</button>
      </form>,
    );
    const input = screen.getByRole("searchbox");
    await user.type(input, "a");
    cancel = true;
    await user.click(screen.getByRole("button", { name: "Сбросить" }));
    expect(input).toHaveValue("a");
    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: "Очистить" }),
      ).toBeInTheDocument(),
    );
    cancel = false;
    await user.click(screen.getByRole("button", { name: "Сбросить" }));
    expect(input).toHaveValue("");
    await waitFor(() => expect(screen.getByText("Ctrl K")).toBeInTheDocument());
    expect(
      screen.queryByRole("button", { name: "Очистить" }),
    ).not.toBeInTheDocument();
    expect(onValueChange.mock.calls).toEqual([["a"]]);
  });

  it("restores a non-empty default value on reset and respects external form ownership", async () => {
    const user = userEvent.setup();
    render(
      <>
        <form id="external">
          <button type="reset">Сбросить</button>
        </form>
        <SearchInput
          aria-label="Поиск"
          clearLabel="Очистить"
          shortcut="Ctrl K"
          form="external"
          defaultValue="исходное"
        />
      </>,
    );
    const input = screen.getByRole("searchbox");
    await user.click(screen.getByRole("button", { name: "Очистить" }));
    expect(input).toHaveValue("");
    expect(screen.getByText("Ctrl K")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Сбросить" }));
    expect(input).toHaveValue("исходное");
    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: "Очистить" }),
      ).toBeInTheDocument(),
    );
  });

  it("synchronizes reset when the external form is mounted after the input", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn<(value: string) => void>();
    let cancel = true;
    const inputElement = (
      <SearchInput
        aria-label="Поиск"
        clearLabel="Очистить"
        shortcut="Ctrl K"
        form="later"
        onValueChange={onValueChange}
      />
    );
    const { rerender } = render(<>{inputElement}</>);
    const input = screen.getByRole<HTMLInputElement>("searchbox");
    expect(input.form).toBeNull();
    rerender(
      <>
        {inputElement}
        <form
          id="later"
          onReset={(event) => {
            if (cancel) event.preventDefault();
          }}
        >
          <button type="reset">Сбросить</button>
        </form>
      </>,
    );
    expect(input.form).toBe(document.getElementById("later"));
    await user.type(input, "a");
    expect(
      screen.getByRole("button", { name: "Очистить" }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Сбросить" }));
    expect(input).toHaveValue("a");
    expect(
      screen.getByRole("button", { name: "Очистить" }),
    ).toBeInTheDocument();
    cancel = false;
    await user.click(screen.getByRole("button", { name: "Сбросить" }));
    expect(input).toHaveValue("");
    await waitFor(() => expect(screen.getByText("Ctrl K")).toBeInTheDocument());
    expect(
      screen.queryByRole("button", { name: "Очистить" }),
    ).not.toBeInTheDocument();
    expect(onValueChange.mock.calls).toEqual([["a"]]);
  });

  it("tracks the current form after the form attribute changes or a form is replaced", async () => {
    const user = userEvent.setup();
    const view = (form: string, replacement: boolean) => (
      <>
        <SearchInput
          aria-label="Поиск"
          clearLabel="Очистить"
          shortcut="Ctrl K"
          form={form}
        />
        <form id="first">
          <button type="reset">Первый</button>
        </form>
        {replacement ? (
          <form key="new" id="second">
            <button type="reset">Второй</button>
          </form>
        ) : (
          <form key="old" id="second">
            <button type="reset">Второй</button>
          </form>
        )}
      </>
    );
    const { rerender } = render(view("first", false));
    const input = screen.getByRole<HTMLInputElement>("searchbox");
    await user.type(input, "a");
    rerender(view("second", false));
    expect(input.form).toBe(document.getElementById("second"));
    await user.click(screen.getByRole("button", { name: "Первый" }));
    expect(input).toHaveValue("a");
    expect(
      screen.getByRole("button", { name: "Очистить" }),
    ).toBeInTheDocument();
    rerender(view("second", true));
    expect(input.form).toBe(document.getElementById("second"));
    await user.click(screen.getByRole("button", { name: "Второй" }));
    expect(input).toHaveValue("");
    await waitFor(() => expect(screen.getByText("Ctrl K")).toBeInTheDocument());
    expect(
      screen.queryByRole("button", { name: "Очистить" }),
    ).not.toBeInTheDocument();
  });

  it("keeps controlled value and clear button in sync on reset when the parent resets its state", async () => {
    const user = userEvent.setup();
    function ControlledForm() {
      const [value, setValue] = useState("initial");
      return (
        <form onReset={() => setValue("initial")}>
          <SearchInput
            aria-label="Поиск"
            clearLabel="Очистить"
            shortcut="Ctrl K"
            value={value}
            onValueChange={setValue}
          />
          <button type="reset">Сбросить</button>
        </form>
      );
    }
    render(<ControlledForm />);
    const input = screen.getByRole("searchbox");
    await user.click(screen.getByRole("button", { name: "Очистить" }));
    expect(screen.getByText("Ctrl K")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Сбросить" }));
    expect(input).toHaveValue("initial");
    expect(
      screen.getByRole("button", { name: "Очистить" }),
    ).toBeInTheDocument();
  });
});
