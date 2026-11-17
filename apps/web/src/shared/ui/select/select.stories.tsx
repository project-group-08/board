import type { Meta, StoryObj } from "@storybook/react";
import { userEvent, within } from "storybook/test";

import { Field } from "../field";
import { Select } from "./select";

const items = [
  { value: "editor", label: "Редактор" },
  { value: "viewer", label: "Наблюдатель" },
  { value: "disabled", label: "Недоступная роль", disabled: true },
];

const meta = {
  title: "UI/Select",
  component: Select,
  args: { items, defaultValue: "editor", "aria-label": "Роль" },
} satisfies Meta<typeof Select>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div style={{ width: "min(100%, 240px)" }}>
      <Select {...args} />
    </div>
  ),
};

export const Open: Story = {
  render: (args) => (
    <div style={{ width: "min(100%, 240px)", paddingBottom: 140 }}>
      <Select {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole("combobox", { name: "Роль" }),
    );
  },
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
            "repeat(auto-fit, minmax(min(100%, 200px), 240px))",
          gap: 32,
        }}
      >
        {(["default", "disabled"] as const).map((state) => (
          <div key={state} style={{ display: "grid", gap: 8 }}>
            <Select
              items={items}
              defaultValue="editor"
              aria-label={`Роль — ${state}`}
              disabled={state === "disabled"}
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
      <p
        style={{
          marginTop: 24,
          font: "var(--type-mono)",
          color: "var(--color-muted-foreground)",
        }}
      >
        Откройте список, чтобы увидеть выбранный и подсвеченный пункты.
      </p>
    </div>
  ),
};

export const WithField: Story = {
  render: () => (
    <div style={{ width: "min(100%, 240px)" }}>
      <Field label="Роль" error="Проверьте выбранную роль">
        {(props) => <Select {...props} items={items} defaultValue="editor" />}
      </Field>
    </div>
  ),
};

export const LongLabel: Story = {
  args: {
    items: [
      {
        value: "long",
        label: "Очень длинное название роли участника рабочей команды проекта",
      },
      ...items,
    ],
    defaultValue: "long",
  },
  render: (args) => (
    <div style={{ width: "min(100%, 240px)" }}>
      <Select {...args} />
    </div>
  ),
};
