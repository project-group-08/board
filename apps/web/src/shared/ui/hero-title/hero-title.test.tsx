import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { HeroTitle } from ".";
import { SelectionHighlight } from "../selection-highlight";

describe("HeroTitle", () => {
  it("renders a level-one heading and preserves the accessible text of composed children", () => {
    render(
      <HeroTitle>
        Доска, где{" "}
        <SelectionHighlight label="Владимир">команда и ИИ</SelectionHighlight>{" "}
        проектируют вместе
      </HeroTitle>,
    );
    const heading = screen.getByRole("heading", {
      level: 1,
      name: "Доска, где команда и ИИ проектируют вместе",
    });
    expect(heading).toHaveClass(
      "[font:var(--type-display)]",
      "tracking-[var(--tracking-display)]",
      "text-foreground",
    );
    expect(heading.querySelector('[aria-hidden="true"]')).toHaveTextContent(
      "Владимир",
    );
  });
});
