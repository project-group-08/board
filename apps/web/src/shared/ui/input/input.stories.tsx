import type { Meta, StoryObj } from "@storybook/react";

import { Input } from "./input";

const meta = {
  title: "UI/Input",
  component: Input,
  args: { "aria-label": "Почта", placeholder: "name@company.ru" },
} satisfies Meta<typeof Input>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div style={{ width: "min(100%, 320px)" }}>
      <Input {...args} />
    </div>
  ),
};

export const States: Story = {
  parameters: {
    pseudo: {
      hover: '[data-input-state="hover"]',
      focus: '[data-input-state="focus"]',
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
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(min(100%, 280px), 320px))",
          gap: 32,
        }}
      >
        {(
          [
            "default",
            "hover",
            "focus",
            "filled",
            "read-only",
            "error",
            "disabled",
          ] as const
        ).map((state) => (
          <div key={state} style={{ display: "grid", gap: 8 }}>
            <Input
              aria-label={`Почта — ${state}`}
              data-input-state={state}
              placeholder="name@company.ru"
              defaultValue={
                ["focus", "filled", "read-only", "error"].includes(state)
                  ? "name@company.ru"
                  : undefined
              }
              readOnly={state === "read-only"}
              disabled={state === "disabled"}
              aria-invalid={state === "error" || undefined}
            />
            <span
              style={{
                font: "var(--type-mono)",
                color: "var(--color-muted-foreground)",
              }}
            >
              {state}
            </span>
          </div>
        ))}
      </div>
    </div>
  ),
};
