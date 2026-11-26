import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AvatarGroup } from ".";
import { Avatar } from "../avatar";

describe("AvatarGroup", () => {
  it("keeps all participants and the non-interactive counter in reading order", () => {
    render(
      <AvatarGroup
        label="Участники доски"
        more={{ text: "+3", label: "Ещё 3 участника" }}
      >
        <Avatar name="Надежда Иванова" fallback="Н" />
        <Avatar name="Сергей Петров" fallback="С" />
        <Avatar name="Анна Смирнова" fallback="А" />
        <Avatar name="Иван Орлов" fallback="И" />
      </AvatarGroup>,
    );

    const list = screen.getByRole("list", { name: "Участники доски" });
    const items = within(list).getAllByRole("listitem");
    expect(items).toHaveLength(5);
    for (const item of items) {
      expect(item).toHaveClass("flex");
    }
    expect(
      items
        .slice(0, 4)
        .map((item) =>
          within(item).getByRole("figure").getAttribute("aria-label"),
        ),
    ).toEqual([
      "Надежда Иванова",
      "Сергей Петров",
      "Анна Смирнова",
      "Иван Орлов",
    ]);
    expect(items[4]).toHaveAccessibleName("Ещё 3 участника");
    expect(items[4]).toHaveTextContent("+3");
    expect(within(items[4]!).getByText("+3")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    expect(within(list).queryByRole("button")).not.toBeInTheDocument();
    expect(within(list).queryByRole("link")).not.toBeInTheDocument();
  });

  it("does not add a counter when none was provided", () => {
    render(
      <AvatarGroup label="Участники">
        <Avatar name="Анна Смирнова" fallback="А" />
      </AvatarGroup>,
    );
    const list = screen.getByRole("list", { name: "Участники" });
    expect(within(list).getAllByRole("listitem")).toHaveLength(1);
    expect(
      within(list).getByRole("figure", { name: "Анна Смирнова" }),
    ).toBeInTheDocument();
    expect(within(list).queryByText(/\+/)).not.toBeInTheDocument();
  });

  it("ignores absent conditional children without adding empty items", () => {
    render(
      <AvatarGroup label="Участники">
        {null}
        {false}
        <Avatar name="Анна Смирнова" fallback="А" />
      </AvatarGroup>,
    );
    expect(screen.getAllByRole("listitem")).toHaveLength(1);
  });
});
