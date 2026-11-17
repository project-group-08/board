import type { Meta, StoryObj } from "@storybook/react";

import { Switch } from ".";

const meta = {
  title: "UI/Switch",
  component: Switch,
  args: { "aria-label": "Уведомления" },
  parameters: {
    docs: {
      description: {
        component:
          "Switch принимает checked/defaultChecked и onCheckedChange. Доступное имя задаётся подписью, aria-label или aria-labelledby. В Base UI 1.9.0 нативный form.reset() пока не гарантирует согласованность состояния Switch и FormData.",
      },
    },
  },
} satisfies Meta<typeof Switch>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithLabel: Story = {
  render: () => (
    <label
      htmlFor="switch-notifications"
      className="text-foreground inline-flex items-center gap-[var(--space-8)] [font:var(--type-body-s)]"
    >
      <Switch id="switch-notifications" name="notifications" value="enabled" />
      <span>Уведомления</span>
    </label>
  ),
};

const examples = [
  { state: "default", title: "Off · Default", checked: false },
  { state: "checked", title: "On · Default", checked: true },
  { state: "focus", title: "Off · Focus", checked: false },
  { state: "focus-checked", title: "On · Focus", checked: true },
  {
    state: "disabled",
    title: "Off · Disabled",
    checked: false,
    disabled: true,
  },
  {
    state: "disabled-checked",
    title: "On · Disabled",
    checked: true,
    disabled: true,
  },
] as const;

export const States: Story = {
  parameters: {
    pseudo: {
      focusVisible:
        '[data-switch-state="focus"], [data-switch-state="focus-checked"]',
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
        {examples.map(({ state, title, checked, ...props }) => (
          <div
            key={state}
            style={{ display: "grid", gap: 12, justifyItems: "start" }}
          >
            <Switch
              aria-label={title}
              data-switch-state={state}
              defaultChecked={checked}
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
