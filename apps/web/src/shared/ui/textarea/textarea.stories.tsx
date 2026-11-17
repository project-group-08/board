import type { Meta, StoryObj } from "@storybook/react";

import { Field } from "../field";
import { Textarea } from "./textarea";

const meta = {
  title: "UI/Textarea",
  component: Textarea,
  args: { "aria-label": "Описание задачи", placeholder: "Опишите задачу" },
} satisfies Meta<typeof Textarea>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div style={{ width: "min(100%, 320px)" }}>
      <Textarea {...args} />
    </div>
  ),
};

export const States: Story = {
  parameters: {
    pseudo: {
      focus:
        '[data-textarea-state="focus"], [data-textarea-state="error-focus"]',
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
            "filled",
            "focus",
            "error",
            "error-focus",
            "disabled",
            "read-only",
          ] as const
        ).map((state) => (
          <div key={state} style={{ display: "grid", gap: 8 }}>
            <Textarea
              aria-label={`Описание задачи — ${state}`}
              data-textarea-state={state}
              placeholder="Опишите задачу"
              defaultValue={
                [
                  "filled",
                  "focus",
                  "error",
                  "error-focus",
                  "read-only",
                ].includes(state)
                  ? "Сгруппируй идеи по темам и предложи названия групп"
                  : undefined
              }
              readOnly={state === "read-only"}
              disabled={state === "disabled"}
              aria-invalid={
                state === "error" || state === "error-focus" || undefined
              }
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

export const WithField: Story = {
  render: () => (
    <div style={{ width: "min(100%, 320px)" }}>
      <Field label="Описание задачи" error="Добавьте описание задачи">
        {(props) => <Textarea {...props} placeholder="Опишите задачу" />}
      </Field>
    </div>
  ),
};
