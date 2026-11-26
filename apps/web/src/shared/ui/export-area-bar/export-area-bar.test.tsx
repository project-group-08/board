import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ExportAreaBar } from ".";

describe("ExportAreaBar", () => {
  it("renders the hint and calls only the corresponding handler", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn<() => void>();
    const onExport = vi.fn<() => void>();
    render(<ExportAreaBar onCancel={onCancel} onExport={onExport} />);

    expect(
      screen.getByText("Выделите область для экспорта"),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("button")).toHaveLength(2);
    await user.click(screen.getByRole("button", { name: "Отмена" }));
    expect(onCancel).toHaveBeenCalledOnce();
    expect(onExport).not.toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: "Экспортировать" }));
    expect(onCancel).toHaveBeenCalledOnce();
    expect(onExport).toHaveBeenCalledOnce();
  });

  it("supports tab navigation and keyboard activation", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn<() => void>();
    const onExport = vi.fn<() => void>();
    render(<ExportAreaBar onCancel={onCancel} onExport={onExport} />);

    await user.tab();
    expect(screen.getByRole("button", { name: "Отмена" })).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(onCancel).toHaveBeenCalledOnce();
    expect(onExport).not.toHaveBeenCalled();
    await user.tab();
    expect(
      screen.getByRole("button", { name: "Экспортировать" }),
    ).toHaveFocus();
    await user.keyboard(" ");
    expect(onCancel).toHaveBeenCalledOnce();
    expect(onExport).toHaveBeenCalledOnce();
  });
});
