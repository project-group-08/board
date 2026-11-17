import type { Meta, StoryObj } from "@storybook/react";

import { Input } from "../input";
import { Field } from "./field";

const meta = {
  title: "UI/Field",
  component: Field,
  args: {
    label: "Почта",
    children: (props) => (
      <Input {...props} type="email" placeholder="name@company.ru" />
    ),
  },
  argTypes: { children: { control: false } },
} satisfies Meta<typeof Field>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div style={{ width: "min(100%, 320px)" }}>
      <Field {...args} />
    </div>
  ),
};

export const States: Story = {
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
        {(["default", "error", "disabled"] as const).map((state) => (
          <div
            key={state}
            data-field-state={state}
            style={{ display: "grid", gap: 8 }}
          >
            <Field
              label="Почта"
              error={
                state === "error"
                  ? "Введите почту в формате name@company.ru"
                  : undefined
              }
              disabled={state === "disabled"}
            >
              {(props) => (
                <Input
                  {...props}
                  type="email"
                  placeholder="name@company.ru"
                  defaultValue={
                    state === "error" ? "name@company.ru" : undefined
                  }
                />
              )}
            </Field>
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
