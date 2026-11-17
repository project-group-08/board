import type { Meta, StoryObj } from "@storybook/react";

import { CheckboxField } from ".";

const meta = {
  title: "UI/Checkbox Field",
  component: CheckboxField,
  args: {
    label: "Я принимаю условия использования и политику конфиденциальности",
  },
} satisfies Meta<typeof CheckboxField>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div style={{ width: "min(100%, 320px)" }}>
      <CheckboxField {...args} />
    </div>
  ),
};

export const States: Story = {
  parameters: {
    pseudo: {
      hover: '[data-field-state="hover"]',
      focusVisible: '[data-field-state="focus"]',
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
          ["default", "error", "hover", "focus", "checked", "disabled"] as const
        ).map((state) => (
          <div key={state} style={{ display: "grid", gap: 8 }}>
            <CheckboxField
              label="Я принимаю условия использования и политику конфиденциальности"
              data-field-state={state}
              invalid={state !== "default"}
              defaultChecked={state === "checked"}
              disabled={state === "disabled"}
            />
            <span
              style={{
                font: "var(--type-mono)",
                color: "var(--color-muted-foreground)",
              }}
            >
              {state === "default" ? "Default" : `Error · ${state}`}
            </span>
          </div>
        ))}
      </div>
    </div>
  ),
};
