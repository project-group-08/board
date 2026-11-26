import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef, useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { Dialog, DialogClose, DialogContent, DialogTrigger } from ".";
import { Button } from "../button";
import { IconButton } from "../icon-button";

describe("Dialog", () => {
  it("composes buttons with refs and handlers, labels the dialog and restores focus", async () => {
    const user = userEvent.setup();
    const triggerClick = vi.fn<() => void>();
    const closeClick = vi.fn<() => void>();
    const actionClick = vi.fn<() => void>();
    const triggerRef = createRef<HTMLButtonElement>();
    const closeRef = createRef<HTMLButtonElement>();
    render(
      <Dialog>
        <DialogTrigger
          render={
            <IconButton
              ref={triggerRef}
              aria-label="Открыть"
              onClick={triggerClick}
            >
              +
            </IconButton>
          }
        />
        <DialogContent
          title="Заголовок"
          description="Описание"
          actions={
            <>
              <Button onClick={actionClick}>Действие</Button>
              <DialogClose
                render={
                  <Button ref={closeRef} onClick={closeClick}>
                    Отмена
                  </Button>
                }
              />
            </>
          }
        >
          Содержимое
        </DialogContent>
      </Dialog>,
    );
    const trigger = screen.getByRole("button", { name: "Открыть" });
    expect(triggerRef.current).toBe(trigger);
    expect(trigger.querySelector("button")).toBeNull();
    await user.click(trigger);
    expect(triggerClick).toHaveBeenCalledOnce();
    const dialog = await screen.findByRole("dialog", {
      name: "Заголовок",
      description: "Описание",
    });
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveTextContent("Содержимое");
    const close = screen.getByRole("button", { name: "Отмена" });
    expect(closeRef.current).toBe(close);
    expect(close.querySelector("button")).toBeNull();
    await user.click(screen.getByRole("button", { name: "Действие" }));
    expect(actionClick).toHaveBeenCalledOnce();
    expect(dialog).toBeVisible();
    await user.click(close);
    expect(closeClick).toHaveBeenCalledOnce();
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it("passes event details and allows a controlled consumer to cancel Escape", async () => {
    const user = userEvent.setup();
    const reasons: string[] = [];
    function Example() {
      const [open, setOpen] = useState(false);
      return (
        <Dialog
          open={open}
          onOpenChange={(next, details) => {
            reasons.push(details.reason);
            if (details.reason === "escape-key") details.cancel();
            else setOpen(next);
          }}
        >
          <DialogTrigger render={<Button>Открыть</Button>} />
          <DialogContent title="Управляемый" />
        </Dialog>
      );
    }
    render(<Example />);
    await user.click(screen.getByRole("button", { name: "Открыть" }));
    expect(
      await screen.findByRole("dialog", { name: "Управляемый" }),
    ).toBeVisible();
    await user.keyboard("{Escape}");
    expect(screen.getByRole("dialog", { name: "Управляемый" })).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Закрыть" }));
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
    expect(reasons).toEqual(["trigger-press", "escape-key", "close-press"]);
  });

  it("closes without forcing focus to another control when the trigger is removed", async () => {
    const user = userEvent.setup();
    function Example() {
      const [showTrigger, setShowTrigger] = useState(true);
      return (
        <>
          <Button>Другая кнопка</Button>
          <Dialog>
            {showTrigger && <DialogTrigger render={<Button>Открыть</Button>} />}
            <DialogContent title="Диалог">
              <Button onClick={() => setShowTrigger(false)}>
                Удалить триггер
              </Button>
            </DialogContent>
          </Dialog>
        </>
      );
    }
    render(<Example />);
    const trigger = screen.getByRole("button", { name: "Открыть" });
    await user.click(trigger);
    await user.click(screen.getByRole("button", { name: "Удалить триггер" }));
    expect(trigger).not.toBeInTheDocument();
    await user.keyboard("{Escape}");
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
    await waitFor(() => expect(document.body).toHaveFocus());
    expect(
      screen.getByRole("button", { name: "Другая кнопка" }),
    ).not.toHaveFocus();
  });
});
