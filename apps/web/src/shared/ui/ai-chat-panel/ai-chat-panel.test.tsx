import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { AiChatPanel, type AiChatPanelProps } from ".";

const labels = {
  title: "Заголовок",
  description: "Описание",
  close: "Закрыть",
  input: "Ввод",
  placeholder: "Введите текст",
  send: "Отправить",
};

function props(): AiChatPanelProps {
  return {
    labels,
    counter: "Счётчик",
    value: "Исходный текст",
    onValueChange: vi.fn<(value: string) => void>(),
    onClose: vi.fn<() => void>(),
    onSend: vi.fn<() => void>(),
  };
}

beforeEach(() => {
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      disconnect() {}
    },
  );
});

afterEach(() => vi.unstubAllGlobals());

describe("AiChatPanel public contract", () => {
  it("centers the input in a stretched row while keeping the send button bottom-aligned", () => {
    render(<AiChatPanel {...props()} />);
    const input = screen.getByRole("textbox");
    expect(input.parentElement).toHaveClass("items-center", "self-stretch");
    expect(input.parentElement?.parentElement).toHaveClass("items-end");
  });
  it("provides the rounded theme focus ring for keyboard input", () => {
    render(<AiChatPanel {...props()} />);
    expect(screen.getByRole("textbox")).toHaveClass(
      "rounded-[var(--radius-sm)]",
      "focus-visible:shadow-[var(--shadow-focus)]",
    );
  });
  it("keeps panel overflow scrollable with long consumer text", async () => {
    const user = userEvent.setup();
    const options = props();
    render(
      <AiChatPanel
        {...options}
        labels={{
          ...labels,
          title: "Длинный заголовок ".repeat(20),
          description: "Длинное описание ".repeat(20),
        }}
        counter={"Длинный счётчик ".repeat(20)}
      />,
    );
    expect(screen.getByRole("region")).toHaveClass("overflow-y-auto");
    await user.click(screen.getByRole("button", { name: labels.send }));
    expect(options.onSend).toHaveBeenCalledOnce();
  });

  it("renders consumer content and delegates actions without changing the value", async () => {
    const user = userEvent.setup();
    const options = props();
    render(
      <AiChatPanel {...options}>
        <p>Содержимое</p>
      </AiChatPanel>,
    );
    expect(
      screen.getByRole("region", { name: labels.title }),
    ).toBeInTheDocument();
    expect(screen.getByText(labels.description)).toBeInTheDocument();
    expect(screen.getByText("Счётчик")).toBeInTheDocument();
    expect(screen.getByText("Содержимое")).toBeInTheDocument();
    const input = screen.getByRole("textbox", { name: labels.input });
    await user.type(input, "!");
    expect(options.onValueChange).toHaveBeenCalledWith("Исходный текст!");
    expect(input).toHaveValue("Исходный текст");
    await user.click(screen.getByRole("button", { name: labels.send }));
    await user.click(screen.getByRole("button", { name: labels.close }));
    expect(options.onSend).toHaveBeenCalledTimes(1);
    expect(options.onClose).toHaveBeenCalledTimes(1);
  });

  it("sends on Enter, inserts Shift+Enter, and ignores IME confirmation", async () => {
    const user = userEvent.setup();
    const options = props();
    function Controlled() {
      const [value, setValue] = useState("");
      return (
        <AiChatPanel {...options} value={value} onValueChange={setValue} />
      );
    }
    render(<Controlled />);
    const input = screen.getByRole("textbox");
    await user.type(input, "a{Shift>}{Enter}{/Shift}b");
    expect(input).toHaveValue("a\nb");
    fireEvent.compositionStart(input);
    fireEvent.keyDown(input, { key: "Enter", isComposing: true });
    fireEvent.compositionEnd(input);
    fireEvent.keyDown(input, { key: "Enter", keyCode: 229 });
    expect(options.onSend).not.toHaveBeenCalled();
    await user.keyboard("{Enter}");
    expect(options.onSend).toHaveBeenCalledTimes(1);
    expect(input).toHaveValue("a\nb");
  });

  it("obeys independent input and send availability", async () => {
    const user = userEvent.setup();
    const options = props();
    const { rerender } = render(<AiChatPanel {...options} sendDisabled />);
    const input = screen.getByRole("textbox");
    await user.type(input, "{Enter}");
    expect(options.onSend).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: labels.send })).toBeDisabled();
    rerender(<AiChatPanel {...options} inputDisabled />);
    expect(input).toBeDisabled();
    expect(screen.getByRole("button", { name: labels.send })).toBeEnabled();
    await user.click(screen.getByRole("button", { name: labels.send }));
    expect(options.onSend).toHaveBeenCalledTimes(1);
  });

  it("remeasures on external value changes and resets the height before measuring", () => {
    const options = props();
    const heights: string[] = [];
    const measured = vi
      .spyOn(HTMLTextAreaElement.prototype, "scrollHeight", "get")
      .mockImplementation(function (this: HTMLTextAreaElement) {
        heights.push(this.style.height);
        return this.value.length * 10;
      });
    const { rerender } = render(<AiChatPanel {...options} value="123456" />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveStyle({ height: "60px" });
    rerender(<AiChatPanel {...options} value="1" />);
    expect(input).toHaveStyle({ height: "10px" });
    expect(heights).toEqual(["auto", "auto"]);
    measured.mockRestore();
  });
});
