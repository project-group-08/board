import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { LinkAccessMenu } from ".";
import type { LinkAccessValue } from ".";
import { Button } from "../button";

const labels = {
  none: "Нет доступа",
  view: "Могут смотреть",
  edit: "Могут редактировать",
};

function Example({ onChange }: { onChange: (value: LinkAccessValue) => void }) {
  const [value, setValue] = useState<LinkAccessValue>("view");
  return (
    <LinkAccessMenu
      trigger={<Button>Доступ по ссылке</Button>}
      value={value}
      labels={labels}
      onValueChange={(next) => {
        onChange(next);
        setValue(next);
      }}
    />
  );
}

describe("LinkAccessMenu", () => {
  it("shows independent selection and mouse highlight, then selects and closes", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn<(value: LinkAccessValue) => void>();
    render(<Example onChange={onChange} />);
    const trigger = screen.getByRole("button", { name: "Доступ по ссылке" });
    await user.click(trigger);

    expect(await screen.findAllByRole("menuitemradio")).toHaveLength(3);
    const selected = await screen.findByRole("menuitemradio", {
      name: labels.view,
      checked: true,
    });
    const edit = screen.getByRole("menuitemradio", {
      name: labels.edit,
      checked: false,
    });
    await user.hover(edit);
    expect(edit).toHaveAttribute("data-highlighted");
    expect(selected).not.toHaveAttribute("data-highlighted");
    expect(selected.querySelector("svg")).toBeInTheDocument();
    expect(edit.querySelector("svg")).not.toBeInTheDocument();

    await user.click(edit);
    expect(onChange).toHaveBeenCalledExactlyOnceWith("edit");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await user.click(trigger);
    expect(
      await screen.findByRole("menuitemradio", {
        name: labels.edit,
        checked: true,
      }),
    ).toBeInTheDocument();
  });

  it("does not change the selection until the consumer updates value", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn<(value: LinkAccessValue) => void>();
    const props = {
      trigger: <Button>Доступ по ссылке</Button>,
      value: "view" as const,
      labels,
      onValueChange: onChange,
    };
    const { rerender } = render(<LinkAccessMenu {...props} />);
    const trigger = screen.getByRole("button", { name: "Доступ по ссылке" });
    await user.click(trigger);
    await user.click(
      await screen.findByRole("menuitemradio", { name: labels.none }),
    );
    expect(onChange).toHaveBeenCalledExactlyOnceWith("none");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await user.click(trigger);
    expect(
      await screen.findByRole("menuitemradio", {
        name: labels.view,
        checked: true,
      }),
    ).toBeInTheDocument();
    rerender(<LinkAccessMenu {...props} value="none" />);
    expect(
      screen.getByRole("menuitemradio", { name: labels.none, checked: true }),
    ).toBeInTheDocument();
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("supports keyboard selection and restores focus", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn<(value: LinkAccessValue) => void>();
    render(<Example onChange={onChange} />);
    await user.tab();
    const trigger = screen.getByRole("button", { name: "Доступ по ссылке" });
    expect(trigger).toHaveFocus();
    await user.keyboard("{Enter}");
    const first = await screen.findByRole("menuitemradio", {
      name: labels.none,
    });
    await waitFor(() => expect(first).toHaveFocus());
    await user.keyboard("{ArrowDown}{ArrowDown}");
    expect(
      screen.getByRole("menuitemradio", { name: labels.edit }),
    ).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(onChange).toHaveBeenCalledExactlyOnceWith("edit");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it("closes on Escape and returns focus without changing the value", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn<(value: LinkAccessValue) => void>();
    render(<Example onChange={onChange} />);
    await user.tab();
    const trigger = screen.getByRole("button", { name: "Доступ по ссылке" });
    await user.keyboard("{Enter}");
    await screen.findByRole("menuitemradio", { name: labels.none });
    await user.keyboard("{Escape}");
    expect(onChange).not.toHaveBeenCalled();
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await waitFor(() => expect(trigger).toHaveFocus());
  });
});
