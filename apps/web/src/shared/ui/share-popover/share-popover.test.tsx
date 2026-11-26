import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { SharePopover } from ".";
import type { SharePopoverProps } from ".";
import { Button } from "../button";
import { LinkAccessMenu } from "../link-access-menu";

const labels = {
  title: "Доступ",
  close: "Закрыть",
  copy: "Скопировать",
  copied: "Скопировано",
  inviteInput: "Почты",
  invitePlaceholder: "Почты через запятую",
  invite: "Пригласить",
  access: "Кто имеет доступ",
};

function Example(props: Partial<SharePopoverProps>) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  return (
    <>
      <Button>Снаружи</Button>
      <SharePopover
        trigger={<Button>Поделиться</Button>}
        open={open}
        onOpenChange={setOpen}
        copied={false}
        onCopyLink={() => {}}
        inviteValue={value}
        onInviteValueChange={setValue}
        onInvite={() => {}}
        accessContent={<div>Участник</div>}
        exportControl={<Button>Экспорт</Button>}
        labels={labels}
        {...props}
      />
    </>
  );
}

describe("SharePopover", () => {
  it("keeps the popover open while the nested menu is used and restores focus in order", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn<(value: string) => void>();
    render(
      <Example
        accessContent={
          <LinkAccessMenu
            trigger={<Button>По ссылке</Button>}
            value="view"
            labels={{ none: "Нет", view: "Просмотр", edit: "Правка" }}
            onValueChange={onValueChange}
          />
        }
      />,
    );
    const trigger = screen.getByRole("button", { name: "Поделиться" });
    await user.click(trigger);
    const menuTrigger = await screen.findByRole("button", {
      name: "По ссылке",
    });
    await user.click(menuTrigger);
    await user.click(
      await screen.findByRole("menuitemradio", { name: "Правка" }),
    );
    expect(onValueChange).toHaveBeenCalledWith("edit");
    expect(screen.getByRole("dialog", { name: "Доступ" })).toBeVisible();
    await waitFor(() => expect(menuTrigger).toHaveFocus());
    await user.keyboard("{Enter}");
    await screen.findByRole("menuitemradio", { name: "Нет" });
    await user.keyboard("{Escape}");
    expect(screen.getByRole("dialog", { name: "Доступ" })).toBeVisible();
    await waitFor(() => expect(menuTrigger).toHaveFocus());
    await user.keyboard("{Escape}");
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it("renders controlled copy state, input, invite disabled and consumer controls", async () => {
    const user = userEvent.setup();
    const copy = vi.fn<() => void>();
    const invite = vi.fn<() => void>();
    const exportAction = vi.fn<() => void>();
    const { rerender } = render(
      <Example
        onCopyLink={copy}
        onInvite={invite}
        inviteDisabled
        exportControl={<Button onClick={exportAction}>Экспорт</Button>}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Поделиться" }));
    const dialog = await screen.findByRole("dialog", { name: "Доступ" });
    expect(dialog).not.toHaveAttribute("aria-modal", "true");
    await user.click(screen.getByRole("button", { name: "Скопировать" }));
    expect(copy).toHaveBeenCalledOnce();
    expect(screen.getByRole("button", { name: "Скопировать" })).toBeVisible();
    await user.type(screen.getByRole("textbox", { name: "Почты" }), "a@b.test");
    expect(screen.getByRole("textbox", { name: "Почты" })).toHaveValue(
      "a@b.test",
    );
    expect(screen.getByRole("button", { name: "Пригласить" })).toBeDisabled();
    await user.keyboard("{Enter}");
    expect(invite).not.toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: "Экспорт" }));
    expect(exportAction).toHaveBeenCalledOnce();
    rerender(
      <Example
        copied
        onCopyLink={copy}
        onInvite={invite}
        exportControl={<Button onClick={exportAction}>Экспорт</Button>}
      />,
    );
    expect(screen.getByRole("button", { name: "Скопировано" })).toBeVisible();
    expect(screen.getByRole("status")).toHaveTextContent("Скопировано");
    await user.click(screen.getByRole("button", { name: "Пригласить" }));
    expect(invite).toHaveBeenCalledOnce();
  });

  it("isolates invitation submits from an enclosing React form", async () => {
    const user = userEvent.setup();
    const invite = vi.fn<() => void>();
    const outerSubmit = vi.fn<
      (event: React.FormEvent<HTMLFormElement>) => void
    >((event) => event.preventDefault());
    const { rerender } = render(
      <form onSubmit={outerSubmit}>
        <Example onInvite={invite} />
        <button type="submit">Сохранить</button>
      </form>,
    );
    await user.click(screen.getByRole("button", { name: "Поделиться" }));
    const input = await screen.findByRole("textbox", { name: "Почты" });
    await user.click(screen.getByRole("button", { name: "Пригласить" }));
    expect(invite).toHaveBeenCalledTimes(1);
    expect(outerSubmit).not.toHaveBeenCalled();
    await user.click(input);
    await user.keyboard("{Enter}");
    expect(invite).toHaveBeenCalledTimes(2);
    expect(outerSubmit).not.toHaveBeenCalled();

    rerender(
      <form onSubmit={outerSubmit}>
        <Example onInvite={invite} inviteDisabled />
        <button type="submit">Сохранить</button>
      </form>,
    );
    await user.click(screen.getByRole("button", { name: "Пригласить" }));
    await user.click(input);
    await user.keyboard("{Enter}");
    const inviteForm = input.closest("form");
    expect(inviteForm).not.toBeNull();
    if (inviteForm) fireEvent.submit(inviteForm);
    expect(invite).toHaveBeenCalledTimes(2);
    expect(outerSubmit).not.toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: "Сохранить" }));
    expect(outerSubmit).toHaveBeenCalledOnce();
  });

  it("opens with keyboard and closes with the close button or Escape, returning focus", async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.tab();
    await user.tab();
    const trigger = screen.getByRole("button", { name: "Поделиться" });
    expect(trigger).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(await screen.findByRole("dialog", { name: "Доступ" })).toBeVisible();
    await user.keyboard("{Escape}");
    await waitFor(() => expect(trigger).toHaveFocus());
    await user.keyboard("{Enter}");
    await user.click(await screen.findByRole("button", { name: "Закрыть" }));
    await waitFor(() => expect(trigger).toHaveFocus());
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("keeps copy and link access controls reachable with the keyboard", async () => {
    const user = userEvent.setup();
    render(
      <Example
        accessContent={
          <LinkAccessMenu
            trigger={<Button variant="ghost">По ссылке</Button>}
            value="view"
            labels={{ none: "Нет", view: "Просмотр", edit: "Правка" }}
            onValueChange={() => {}}
          />
        }
      />,
    );
    await user.tab();
    await user.tab();
    await user.keyboard("{Enter}");
    const copy = await screen.findByRole("button", { name: "Скопировать" });
    await waitFor(() => expect(copy).toHaveFocus());
    await user.tab();
    await user.tab();
    await user.tab();
    await user.tab();
    expect(screen.getByRole("button", { name: "По ссылке" })).toHaveFocus();
  });

  it("closes on outside click without stealing focus from the clicked control", async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(screen.getByRole("button", { name: "Поделиться" }));
    await screen.findByRole("dialog");
    const outside = screen.getByRole("button", { name: "Снаружи" });
    await user.click(outside);
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
    expect(outside).toHaveFocus();
  });
});
