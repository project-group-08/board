import type { Meta, StoryObj } from "@storybook/react";

import { RadioItem } from ".";

const meta = {
  title: "UI/Radio Item",
  component: RadioItem,
  args: { label: "Вся доска", description: "Всё, что есть на холсте" },
} satisfies Meta<typeof RadioItem>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div style={{ width: "min(100%, 320px)" }}>
      <RadioItem {...args} />
    </div>
  ),
};

const examples = [
  { state: "default", title: "Unchecked · Default" },
  { state: "checked", title: "Checked · Default", defaultChecked: true },
  { state: "hover", title: "Unchecked · Hover" },
  { state: "focus", title: "Unchecked · Focus" },
  { state: "disabled", title: "Unchecked · Disabled", disabled: true },
  {
    state: "disabled-checked",
    title: "Checked · Disabled",
    disabled: true,
    defaultChecked: true,
  },
] as const;

export const States: Story = {
  parameters: {
    pseudo: {
      hover: '[data-radio-state="hover"]',
      focusVisible: '[data-radio-state="focus"]',
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
            "repeat(auto-fit, minmax(min(100%, 240px), 320px))",
          gap: 32,
        }}
      >
        {examples.map(({ state, title, ...props }) => (
          <div key={state} style={{ display: "grid", gap: 8 }}>
            <RadioItem
              label="Вся доска"
              description="Всё, что есть на холсте"
              data-radio-state={state}
              {...props}
            />
            <span
              style={{
                font: "var(--type-mono)",
                color: "var(--color-muted-foreground)",
              }}
            >
              {title}
            </span>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const Group: Story = {
  render: () => (
    <fieldset style={{ width: "min(100%, 320px)", display: "grid", gap: 16 }}>
      <legend className="text-foreground [font:var(--type-label)]">
        Что экспортировать
      </legend>
      <RadioItem
        name="scope"
        value="board"
        label="Вся доска"
        description="Всё, что есть на холсте"
        defaultChecked
      />
      <RadioItem name="scope" value="selection" label="Выделение" />
    </fieldset>
  ),
};

export const LongText: Story = {
  render: () => (
    <div style={{ width: 220 }}>
      <RadioItem
        label="Длинное название выбранного варианта для проверки переноса"
        description="Подробное описание также переносится на несколько строк под собственным началом."
      />
    </div>
  ),
};
