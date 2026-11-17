import type { Meta, StoryObj } from "@storybook/react";

import { Checkbox } from "./checkbox";

const meta = {
  title: "UI/Checkbox",
  component: Checkbox,
  args: { "aria-label": "Выбрать доску" },
  parameters: {
    docs: {
      description: {
        component:
          "Checkbox должен иметь доступное имя: связанную видимую подпись, aria-label или aria-labelledby.",
      },
    },
  },
} satisfies Meta<typeof Checkbox>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithLabel: Story = {
  render: () => (
    <label
      htmlFor="checkbox-example"
      className="text-muted-foreground inline-flex items-center gap-[var(--space-8)] [font:var(--type-body-s)]"
    >
      <Checkbox id="checkbox-example" />
      <span>Я принимаю условия использования</span>
    </label>
  ),
};

const examples = [
  { name: "Unchecked · Default", state: "default", checked: false },
  { name: "Checked · Default", state: "default-checked", checked: true },
  { name: "Unchecked · Hover", state: "hover", checked: false },
  { name: "Unchecked · Focus", state: "focus", checked: false },
  { name: "Checked · Focus", state: "focus-checked", checked: true },
  {
    name: "Unchecked · Disabled",
    state: "disabled",
    checked: false,
    disabled: true,
  },
  {
    name: "Checked · Disabled",
    state: "disabled-checked",
    checked: true,
    disabled: true,
  },
] as const;

export const States: Story = {
  parameters: {
    pseudo: {
      hover: '[data-checkbox-state="hover"]',
      focusVisible:
        '[data-checkbox-state="focus"], [data-checkbox-state="focus-checked"]',
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
      <div style={{ display: "flex", flexWrap: "wrap", gap: 32 }}>
        {examples.map(({ name, state, checked, ...rest }) => (
          <div
            key={state}
            style={{ display: "grid", gap: 12, justifyItems: "start" }}
          >
            <Checkbox
              aria-label={name}
              data-checkbox-state={state}
              defaultChecked={checked}
              {...rest}
            />
            <span
              style={{
                font: "var(--type-mono)",
                color: "var(--color-muted-foreground)",
              }}
            >
              {name}
            </span>
          </div>
        ))}
      </div>
    </div>
  ),
};
