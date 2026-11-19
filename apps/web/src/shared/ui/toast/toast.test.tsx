import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRef, useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { ToastProvider, useToast } from ".";
import { Dialog, DialogContent } from "../dialog";

describe("ToastProvider", () => {
  it("вызывает действие после запроса закрытия и не добавляет крестик", async () => {
    const user = userEvent.setup();
    const action = vi.fn<() => void>();
    function Example() {
      const toast = useToast();
      return (
        <button
          onClick={() =>
            toast.add({
              variant: "success",
              title: "Удалено",
              action: { label: "Отменить", onClick: action },
            })
          }
        >
          Удалить
        </button>
      );
    }
    render(
      <ToastProvider>
        <Example />
      </ToastProvider>,
    );
    await user.click(screen.getByRole("button", { name: "Удалить" }));
    await user.click(await screen.findByRole("button", { name: "Отменить" }));
    expect(action).toHaveBeenCalledOnce();
    await waitFor(() =>
      expect(screen.queryByText("Удалено")).not.toBeInTheDocument(),
    );
    expect(
      screen.queryByRole("button", { name: "Закрыть" }),
    ).not.toBeInTheDocument();
  });

  it("скрывает видимое уведомление и ожидает закрытия Dialog прежде чем показать новое", async () => {
    const user = userEvent.setup();
    function Example() {
      const toast = useToast();
      const [open, setOpen] = useState(false);
      return (
        <>
          <button
            onClick={() =>
              toast.add({ variant: "loading", title: "Уже видно" })
            }
          >
            Показать
          </button>
          <button onClick={() => setOpen(true)}>Открыть диалог</button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent title="Диалог">
              <button
                onClick={() =>
                  toast.add({ variant: "success", title: "Из диалога" })
                }
              >
                Добавить
              </button>
            </DialogContent>
          </Dialog>
        </>
      );
    }
    render(
      <ToastProvider>
        <Example />
      </ToastProvider>,
    );
    await user.click(screen.getByRole("button", { name: "Показать" }));
    expect(await screen.findByText("Уже видно")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Открыть диалог" }));
    expect(screen.queryByText("Уже видно")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Добавить" }));
    expect(screen.queryByText("Из диалога")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Закрыть" }));
    expect(await screen.findByText("Уже видно")).toBeInTheDocument();
    expect(await screen.findByText("Из диалога")).toBeInTheDocument();
  });

  it("ждёт закрытия всех открытых Dialog и учитывает отменённое закрытие", async () => {
    const user = userEvent.setup();
    function Example() {
      const toast = useToast();
      const [first, setFirst] = useState(true);
      const [second, setSecond] = useState(false);
      return (
        <Dialog
          open={first}
          onOpenChange={(next, details) => {
            if (details.reason === "escape-key") details.cancel();
            else setFirst(next);
          }}
        >
          <DialogContent title="Первый">
            <button onClick={() => setSecond(true)}>Открыть второй</button>
            <Dialog open={second} onOpenChange={setSecond}>
              <DialogContent title="Второй">
                <button
                  onClick={() =>
                    toast.add({ variant: "success", title: "Жду" })
                  }
                >
                  Добавить
                </button>
              </DialogContent>
            </Dialog>
          </DialogContent>
        </Dialog>
      );
    }
    render(
      <ToastProvider>
        <Example />
      </ToastProvider>,
    );
    await user.click(screen.getByRole("button", { name: "Открыть второй" }));
    await user.click(screen.getByRole("button", { name: "Добавить" }));
    await user.click(screen.getByRole("button", { name: "Закрыть" }));
    await user.keyboard("{Escape}");
    expect(screen.queryByText("Жду")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Закрыть" }));
    expect(await screen.findByText("Жду")).toBeInTheDocument();
  });

  it("после закрытия и обновления скрытых Toast освобождает место для очереди", async () => {
    const user = userEvent.setup();
    function Example() {
      const toast = useToast();
      const ids = useRef<string[]>([]);
      const [open, setOpen] = useState(false);
      return (
        <>
          <button
            onClick={() => {
              ids.current = [
                toast.add({ variant: "loading", title: "Первое" }),
                toast.add({ variant: "offline", title: "Второе" }),
                toast.add({ variant: "loading", title: "Третье" }),
                toast.add({ variant: "loading", title: "Очередь" }),
              ];
            }}
          >
            Показать
          </button>
          <button onClick={() => setOpen(true)}>Открыть</button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent title="Диалог">
              <button
                onClick={() => {
                  const [first, second] = ids.current;
                  if (first) toast.close(first);
                  if (second)
                    toast.update(second, {
                      variant: "success",
                      title: "Обновлено",
                    });
                }}
              >
                Изменить Toast
              </button>
            </DialogContent>
          </Dialog>
        </>
      );
    }
    render(
      <ToastProvider>
        <Example />
      </ToastProvider>,
    );
    await user.click(screen.getByRole("button", { name: "Показать" }));
    await screen.findByText("Третье");
    expect(screen.queryByText("Очередь")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Открыть" }));
    await user.click(screen.getByRole("button", { name: "Изменить Toast" }));
    expect(screen.queryByText("Обновлено")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Закрыть" }));
    expect(await screen.findByText("Обновлено")).toBeInTheDocument();
    expect(await screen.findByText("Третье")).toBeInTheDocument();
    expect(await screen.findByText("Очередь")).toBeInTheDocument();
    expect(screen.queryByText("Первое")).not.toBeInTheDocument();
  });
});
