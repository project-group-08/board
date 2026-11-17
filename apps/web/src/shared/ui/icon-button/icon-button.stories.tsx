import type { Meta, StoryObj } from "@storybook/react";
import { Ellipsis } from "lucide-react";

import { IconButton } from "./icon-button";

const meta = {
  title: "UI/Icon Button",
  component: IconButton,
  args: {
    "aria-label": "Открыть меню",
    children: <Ellipsis strokeWidth={2.25} />,
  },
} satisfies Meta<typeof IconButton>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  parameters: {
    pseudo: {
      hover: '[data-icon-state="hover"]',
      active: '[data-icon-state="active"]',
      focusVisible: '[data-icon-state="focus"]',
    },
  },
  render: () => (
    <div
      style={{
        padding: 32,
        background: "var(--color-surface)",
        borderRadius: 12,
      }}
    >
      <div style={{ display: "flex", gap: 32 }}>
        {(["default", "hover", "active", "focus", "disabled"] as const).map(
          (state) => (
            <div
              key={state}
              style={{ display: "grid", gap: 12, justifyItems: "start" }}
            >
              <IconButton
                aria-label="Открыть меню"
                data-icon-state={state}
                disabled={state === "disabled"}
              >
                <Ellipsis strokeWidth={2.25} />
              </IconButton>
              <span
                style={{
                  font: "var(--type-mono)",
                  color: "var(--color-muted-foreground)",
                }}
              >
                {state}
              </span>
            </div>
          ),
        )}
      </div>
      <p
        style={{
          font: "var(--type-body-s)",
          color: "var(--color-muted-foreground)",
          marginTop: 16,
        }}
      >
        Отдельный стиль active ожидает обновлённого макета.
      </p>
    </div>
  ),
};
