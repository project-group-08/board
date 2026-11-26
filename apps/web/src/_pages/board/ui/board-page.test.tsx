import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { BoardPage } from "./board-page";

vi.mock("./board-client", () => ({
  BoardClient: ({ boardId }: { boardId: string }) => (
    <div data-testid="board-client">{boardId}</div>
  ),
}));

describe("BoardPage", () => {
  it("передаёт доске id из маршрута", async () => {
    const page = await BoardPage({
      params: Promise.resolve({ boardId: "0" }),
      searchParams: Promise.resolve({}),
    });

    render(page);

    expect(screen.getByTestId("board-client")).toHaveTextContent("0");
  });
});
