import { render } from "@testing-library/react";
import { useEffect } from "react";
import { describe, expect, it, vi } from "vitest";

import { BoardCanvas } from "./board-canvas";

const mounts = vi.hoisted(() => ({ count: 0 }));

vi.mock("apeiro/styles.css", () => ({}));

vi.mock("apeiro/react", () => ({
  Board: function BoardStub() {
    useEffect(() => {
      mounts.count += 1;
    }, []);
    return null;
  },
}));

vi.mock("@/shared/lib/theme", () => ({
  useTheme: () => ({ theme: "light" }),
}));

describe("BoardCanvas", () => {
  it("создаёт доску заново при смене id", () => {
    mounts.count = 0;
    const view = render(<BoardCanvas boardId="0" />);
    view.rerender(<BoardCanvas boardId="0" />);
    expect(mounts.count).toBe(1);

    view.rerender(<BoardCanvas boardId="1" />);
    expect(mounts.count).toBe(2);
  });
});
