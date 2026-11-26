import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { EmptyBoardHint } from ".";

describe("EmptyBoardHint", () => {
  const createProps = () => ({
    onAddSticker: vi.fn<() => void>(),
    onCreateDraft: vi.fn<() => void>(),
    onInvite: vi.fn<() => void>(),
  });

  it("renders the hint and the default heading", () => {
    render(<EmptyBoardHint {...createProps()} />);

    expect(
      screen.getByRole("heading", {
        name: "Начните с первого элемента",
        level: 2,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Добавьте стикер, попросите ИИ набросать черновик или пригласите команду",
      ),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("button")).toHaveLength(3);
  });

  it.each(["h1", "h2", "h3", "h4", "h5", "h6"] as const)(
    "uses the consumer's %s heading level",
    (as) => {
      render(<EmptyBoardHint {...createProps()} as={as} />);
      expect(
        screen.getByRole("heading", {
          name: "Начните с первого элемента",
          level: Number(as[1]),
        }),
      ).toBeInTheDocument();
    },
  );

  it("calls only the matching handler for each button", async () => {
    const user = userEvent.setup();
    const props = createProps();
    render(<EmptyBoardHint {...props} />);

    await user.click(screen.getByRole("button", { name: "Стикер" }));
    expect(props.onAddSticker).toHaveBeenCalledOnce();
    expect(props.onCreateDraft).not.toHaveBeenCalled();
    expect(props.onInvite).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "Черновик с ИИ" }));
    expect(props.onAddSticker).toHaveBeenCalledOnce();
    expect(props.onCreateDraft).toHaveBeenCalledOnce();
    expect(props.onInvite).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "Пригласить" }));
    expect(props.onAddSticker).toHaveBeenCalledOnce();
    expect(props.onCreateDraft).toHaveBeenCalledOnce();
    expect(props.onInvite).toHaveBeenCalledOnce();
  });

  it("supports keyboard activation", async () => {
    const user = userEvent.setup();
    const props = createProps();
    render(<EmptyBoardHint {...props} />);

    await user.tab();
    expect(screen.getByRole("button", { name: "Стикер" })).toHaveFocus();
    await user.keyboard("{Enter}");
    await user.tab();
    await user.keyboard(" ");
    await user.tab();
    await user.keyboard("{Enter}");
    expect(props.onAddSticker).toHaveBeenCalledOnce();
    expect(props.onCreateDraft).toHaveBeenCalledOnce();
    expect(props.onInvite).toHaveBeenCalledOnce();
  });
});
