import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { FileUpload, type FileUploadProps } from ".";

const labels = {
  upload: "Загрузить",
  uploading: "Загружаем",
  retry: "Повторить",
  done: "Загружено",
  replace: "Заменить",
  remove: "Удалить",
};

function props(): FileUploadProps {
  return {
    state: { kind: "empty", title: "Логотип", hint: "Подсказка" },
    labels,
    onFileSelect: vi.fn<(file: File) => void>(),
    onRetry: vi.fn<() => void>(),
    onRemove: vi.fn<() => void>(),
  };
}

describe("FileUpload", () => {
  it.each([
    [
      { kind: "empty", title: "Логотип", hint: "Подсказка" },
      "Загрузить — Логотип",
    ],
    [
      { kind: "error", fileName: "logo.png", error: "Ошибка" },
      "Повторить — logo.png",
    ],
    [{ kind: "done", fileName: "logo.png" }, "Заменить — logo.png"],
    [{ kind: "done", fileName: "logo.png" }, "Удалить — logo.png"],
  ] satisfies [FileUploadProps["state"], string][])(
    "keeps focus within the component when the focused %s action is disabled",
    async (state, name) => {
      const user = userEvent.setup();
      const common = props();
      const { rerender } = render(<FileUpload {...common} state={state} />);
      await user.tab();
      if (name.startsWith("Удалить")) await user.tab();
      expect(screen.getByRole("button", { name })).toHaveFocus();
      rerender(<FileUpload {...common} state={state} disabled />);
      expect(screen.getByRole("status")).toHaveFocus();
      rerender(<FileUpload {...common} state={state} disabled={false} />);
      expect(screen.getByRole("status")).toHaveFocus();
      expect(screen.getByRole("button", { name })).toBeEnabled();
    },
  );

  it("does not steal focus when disabled or re-enabled in the background", async () => {
    const user = userEvent.setup();
    const common = props();
    const { rerender } = render(
      <>
        <FileUpload {...common} />
        <button>Снаружи</button>
      </>,
    );
    await user.tab();
    await user.tab();
    const outside = screen.getByRole("button", { name: "Снаружи" });
    expect(outside).toHaveFocus();
    rerender(
      <>
        <FileUpload {...common} disabled />
        <button>Снаружи</button>
      </>,
    );
    expect(outside).toHaveFocus();
    rerender(
      <>
        <FileUpload {...common} disabled={false} />
        <button>Снаружи</button>
      </>,
    );
    expect(outside).toHaveFocus();
  });

  it.each(["done", "error"] as const)(
    "keeps focus during keyboard selection, uploading and %s, and retries errors",
    async (result) => {
      const user = userEvent.setup();
      function Example() {
        const [state, setState] = useState<FileUploadProps["state"]>({
          kind: "empty",
          title: "Аватар",
          hint: "Изображение",
        });
        return (
          <>
            <FileUpload
              {...props()}
              state={state}
              onFileSelect={(file) =>
                setState({
                  kind: "uploading",
                  fileName: file.name,
                  progress: 60,
                  progressLabel: "Загрузка",
                })
              }
              onRetry={() =>
                setState({
                  kind: "uploading",
                  fileName: "logo.png",
                  progress: 0,
                  progressLabel: "Загрузка",
                })
              }
            />
            <button
              onClick={() =>
                setState(
                  result === "done"
                    ? { kind: "done", fileName: "logo.png" }
                    : { kind: "error", fileName: "logo.png", error: "Ошибка" },
                )
              }
            >
              Завершить
            </button>
          </>
        );
      }
      const { container } = render(<Example />);
      await user.tab();
      await user.keyboard("{Enter}");
      const input = container.querySelector(
        'input[type="file"]',
      ) as HTMLInputElement;
      fireEvent.change(input, {
        target: { files: [new File(["x"], "logo.png", { type: "image/png" })] },
      });
      expect(screen.getByRole("status")).toHaveFocus();
      expect(screen.getByRole("status")).toHaveTextContent("Загружаем");
      // Фоновое завершение не меняет текущий фокус перед обновлением.
      fireEvent.click(screen.getByRole("button", { name: "Завершить" }));
      const action = result === "done" ? "Заменить" : "Повторить";
      expect(
        screen.getByRole("button", { name: new RegExp(action) }),
      ).toHaveFocus();
    },
  );

  it("moves focus from retry back to uploading", async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <FileUpload
        {...props()}
        state={{ kind: "error", fileName: "logo.png", error: "Ошибка" }}
      />,
    );
    await user.tab();
    await user.keyboard("{Enter}");
    rerender(
      <FileUpload
        {...props()}
        state={{
          kind: "uploading",
          fileName: "logo.png",
          progress: 0,
          progressLabel: "Загрузка",
        }}
      />,
    );
    expect(screen.getByRole("status")).toHaveFocus();
  });

  it("does not move focus on a background update when focus is outside", () => {
    const { rerender } = render(
      <>
        <FileUpload
          {...props()}
          state={{
            kind: "uploading",
            fileName: "logo.png",
            progress: 60,
            progressLabel: "Загрузка",
          }}
        />
        <button>Другой элемент</button>
      </>,
    );
    const outside = screen.getByRole("button", { name: "Другой элемент" });
    outside.focus();
    rerender(
      <>
        <FileUpload
          {...props()}
          state={{ kind: "done", fileName: "logo.png" }}
        />
        <button>Другой элемент</button>
      </>,
    );
    expect(outside).toHaveFocus();
  });

  it("distinguishes and dispatches actions for two fields with the same file name", async () => {
    const user = userEvent.setup();
    const first = props();
    const second = props();
    const { container } = render(
      <>
        <FileUpload
          {...first}
          contextLabel="Аватар"
          state={{ kind: "done", fileName: "logo.png" }}
        />
        <FileUpload
          {...second}
          contextLabel="Обложка"
          state={{ kind: "done", fileName: "logo.png" }}
        />
      </>,
    );
    const uploads = container.querySelectorAll('[data-slot="file-upload"]');
    expect(
      within(uploads[0] as HTMLElement).getByRole("button", {
        name: "Удалить — Аватар",
      }),
    ).toBeInTheDocument();
    expect(
      within(uploads[1] as HTMLElement).getByRole("button", {
        name: "Удалить — Обложка",
      }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Удалить — Обложка" }));
    expect(second.onRemove).toHaveBeenCalledOnce();
    expect(first.onRemove).not.toHaveBeenCalled();
  });

  it("does not restore focus after the user blurs the control before a state update", () => {
    const { rerender } = render(<FileUpload {...props()} />);
    const button = screen.getByRole("button", { name: "Загрузить — Логотип" });
    button.focus();
    button.blur();
    rerender(
      <FileUpload
        {...props()}
        state={{
          kind: "uploading",
          fileName: "logo.png",
          progress: 10,
          progressLabel: "Загрузка",
        }}
      />,
    );
    expect(document.body).toHaveFocus();
  });

  it("opens the file picker by mouse and keyboard and allows selecting the same file again", async () => {
    const user = userEvent.setup();
    const testProps = props();
    const { container } = render(
      <FileUpload {...testProps} accept="image/png" />,
    );
    const input = container.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    const click = vi.spyOn(input, "click");
    const file = new File(["image"], "logo.png", { type: "image/png" });
    const button = screen.getByRole("button", {
      name: "Загрузить — Логотип",
      description: /Подсказка/,
    });

    expect(input).toHaveAttribute("accept", "image/png");
    await user.tab();
    expect(button).toHaveFocus();
    await user.keyboard("{Enter}");
    await user.keyboard(" ");
    expect(click).toHaveBeenCalledTimes(2);
    await user.click(button);
    expect(click).toHaveBeenCalledTimes(3);
    await user.upload(input, file);
    expect(testProps.onFileSelect).toHaveBeenCalledWith(file);
    expect(input.value).toBe("");
    await user.upload(input, file);
    expect(testProps.onFileSelect).toHaveBeenCalledTimes(2);
  });

  it("renders accessible progress from the consumer, including boundaries", () => {
    const testProps = props();
    const { rerender } = render(
      <FileUpload
        {...testProps}
        state={{
          kind: "uploading",
          fileName: "logo.png",
          progress: 60,
          progressLabel: "Прогресс файла",
        }}
      />,
    );
    const bar = screen.getByRole("progressbar", { name: "Прогресс файла" });
    expect(bar).toHaveAttribute("value", "60");
    expect(bar).toHaveAttribute("max", "100");
    expect(screen.getByText("Загружаем")).toBeInTheDocument();
    rerender(
      <FileUpload
        {...testProps}
        state={{
          kind: "uploading",
          fileName: "logo.png",
          progress: 150,
          progressLabel: "Прогресс файла",
        }}
      />,
    );
    expect(bar).toHaveAttribute("value", "100");
  });

  it("exposes error text and calls retry without choosing a file", async () => {
    const user = userEvent.setup();
    const testProps = props();
    const { container } = render(
      <FileUpload
        {...testProps}
        state={{ kind: "error", fileName: "logo.png", error: "Ошибка файла" }}
      />,
    );
    expect(screen.getByRole("status")).toHaveTextContent("Ошибка файла");
    const retry = screen.getByRole("button", {
      name: "Повторить — logo.png",
      description: /Ошибка файла/,
    });
    await user.tab();
    expect(retry).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(testProps.onRetry).toHaveBeenCalledOnce();
    expect(testProps.onFileSelect).not.toHaveBeenCalled();
    expect(container.querySelector("input")).toHaveValue("");
  });

  it("renders the supplied preview or placeholder and delegates replace and remove", async () => {
    const user = userEvent.setup();
    const testProps = props();
    const { container, rerender } = render(
      <FileUpload
        {...testProps}
        state={{
          kind: "done",
          fileName: "logo.png",
          previewUrl: "blob:preview",
        }}
      />,
    );
    expect(container.querySelector("img")).toHaveAttribute(
      "src",
      "blob:preview",
    );
    expect(screen.getByText("Загружено")).toBeInTheDocument();
    const input = container.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    const click = vi.spyOn(input, "click");
    await user.click(
      screen.getByRole("button", { name: "Заменить — logo.png" }),
    );
    expect(click).toHaveBeenCalledOnce();
    await user.tab();
    expect(
      screen.getByRole("button", { name: "Удалить — logo.png" }),
    ).toHaveFocus();
    await user.keyboard(" ");
    expect(testProps.onRemove).toHaveBeenCalledOnce();
    rerender(
      <FileUpload
        {...testProps}
        state={{ kind: "done", fileName: "logo.png" }}
      />,
    );
    expect(container.querySelector("img")).not.toBeInTheDocument();
    expect(container.querySelector(".bg-linear-to-br")).toBeInTheDocument();
  });

  it("does not interpret accept as validation and ignores an empty selection", () => {
    const testProps = props();
    const { container } = render(
      <FileUpload {...testProps} accept="image/png" />,
    );
    const input = container.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    const file = new File(["text"], "note.txt", { type: "text/plain" });
    fireEvent.change(input, { target: { files: [file] } });
    expect(testProps.onFileSelect).toHaveBeenCalledWith(file);
    fireEvent.change(input, { target: { files: [] } });
    expect(testProps.onFileSelect).toHaveBeenCalledTimes(1);
  });

  it("disables the consumer's actions when requested", async () => {
    const user = userEvent.setup();
    const testProps = props();
    const { rerender } = render(
      <FileUpload
        {...testProps}
        disabled
        state={{ kind: "done", fileName: "logo.png" }}
      />,
    );
    expect(
      screen.getByRole("button", { name: "Заменить — logo.png" }),
    ).toBeDisabled();
    await user.click(
      screen.getByRole("button", { name: "Удалить — logo.png" }),
    );
    expect(testProps.onRemove).not.toHaveBeenCalled();
    rerender(
      <FileUpload
        {...testProps}
        disabled
        state={{ kind: "error", fileName: "logo.png", error: "Ошибка" }}
      />,
    );
    expect(
      screen.getByRole("button", { name: "Повторить — logo.png" }),
    ).toBeDisabled();
  });

  it("allows a parent to receive drag events without treating the tile as a drop zone", () => {
    const onDrop = vi.fn<(event: React.DragEvent) => void>((event) =>
      event.preventDefault(),
    );
    const { container } = render(
      <div onDrop={onDrop}>
        <FileUpload {...props()} />
      </div>,
    );
    fireEvent.drop(container.querySelector('[data-slot="file-upload"]')!);
    expect(onDrop).toHaveBeenCalledOnce();
  });
});
