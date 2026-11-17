import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SelectionHighlight } from ".";

describe("SelectionHighlight", () => {
  it("keeps children accessible and hides the label, frame, handles and cursor from assistive technology", () => {
    const { container } = render(
      <p>
        <SelectionHighlight label="Владимир">команда и ИИ</SelectionHighlight>
      </p>,
    );
    const paragraph = screen.getByText("команда и ИИ").closest("p")!;
    expect(paragraph).toHaveAccessibleName("");
    expect(
      screen.getByText("команда и ИИ").closest('[aria-hidden="true"]'),
    ).toBeNull();
    const decoration = screen
      .getByText("Владимир")
      .closest('[aria-hidden="true"]')!;
    expect(decoration).toHaveAttribute("aria-hidden", "true");
    expect(decoration.querySelectorAll("span")).toHaveLength(5);
    expect(decoration.querySelector("svg")).toBeInTheDocument();
    expect(container.querySelector("button, a, [tabindex]")).toBeNull();
    expect(decoration.parentElement).toHaveClass("whitespace-nowrap");
  });
});
