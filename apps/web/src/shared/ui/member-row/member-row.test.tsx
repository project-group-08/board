import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { MemberRow } from ".";
import { Badge } from "../badge";

const member = {
  name: "Никита",
  email: "nikita@company.ru",
  avatarFallback: "Н",
};

describe("MemberRow", () => {
  it("renders supplied content without making the row interactive", () => {
    const { container } = render(
      <MemberRow
        {...member}
        identityBadge={<Badge variant="accent">Вы</Badge>}
        roleContent="Владелец"
        action={<button>Действия</button>}
      />,
    );
    const row = container.querySelector('[data-slot="member-row"]');
    expect(row).not.toHaveAttribute("role");
    expect(row).not.toHaveAttribute("tabindex");
    expect(row?.children).toHaveLength(3);
    expect(row?.children[0]).toHaveTextContent("Никита");
    expect(row?.children[0]).toHaveTextContent("nikita@company.ru");
    expect(row?.children[0]).toHaveTextContent("Вы");
    expect(row?.children[1]).toHaveTextContent("Владелец");
    expect(within(row as HTMLElement).getAllByRole("button")).toHaveLength(1);
    expect(screen.getByLabelText("Никита")).toHaveTextContent("Н");
  });

  it("keeps full long text in the accessibility tree and limits both visual fields", () => {
    const name = "ОченьДлинноеИмяБезПробелов".repeat(8);
    const email = `${"оченьдлиннаяпочта".repeat(8)}@example.com`;
    render(<MemberRow {...member} name={name} email={email} />);
    for (const value of [name, email]) {
      const text = screen.getByText(value);
      expect(text).toHaveTextContent(value);
      expect(text).toHaveClass("line-clamp-2", "[overflow-wrap:anywhere]");
      expect(text).not.toHaveAttribute("aria-hidden");
    }
  });

  it("uses a container grid with stable desktop columns and a narrow identity row", () => {
    const { container } = render(<MemberRow {...member} />);
    const row = container.querySelector('[data-slot="member-row"]');
    expect(row?.parentElement).toHaveClass("@container");
    expect(row).toHaveClass(
      "hover:bg-muted",
      "grid-cols-[minmax(0,1fr)_minmax(0,auto)]",
      "@min-[720px]:grid-cols-[minmax(0,1fr)_200px_32px]",
    );
    expect(row?.children[0]).toHaveClass(
      "col-span-2",
      "@min-[720px]:col-span-1",
    );
  });

  it("only dims the name and avatar for pending and preserves keyboard actions", async () => {
    const user = userEvent.setup();
    const onRole = vi.fn<() => void>();
    const onAction = vi.fn<() => void>();
    const { container } = render(
      <MemberRow
        {...member}
        pending
        identityBadge={<Badge variant="outline">Приглашён</Badge>}
        roleContent={<button onClick={onRole}>Изменить роль</button>}
        action={<button onClick={onAction}>Действия участника</button>}
      />,
    );
    expect(screen.getByText("Никита")).toHaveClass("text-muted-foreground");
    expect(screen.getByLabelText("Никита").parentElement).toHaveClass(
      "opacity-50",
    );
    expect(screen.getByText("Приглашён").parentElement).not.toHaveClass(
      "opacity-50",
    );
    expect(
      container.querySelector('[data-slot="member-row"]'),
    ).not.toHaveAttribute("aria-disabled");
    await user.tab();
    expect(screen.getByRole("button", { name: "Изменить роль" })).toHaveFocus();
    await user.keyboard("{Enter}");
    await user.tab();
    expect(
      screen.getByRole("button", { name: "Действия участника" }),
    ).toHaveFocus();
    await user.keyboard(" ");
    expect(onRole).toHaveBeenCalledOnce();
    expect(onAction).toHaveBeenCalledOnce();
  });
});
