import type { Meta, StoryObj } from "@storybook/react";

import { NavLink } from ".";

const meta = {
  title: "UI/Nav Link",
  component: NavLink,
  parameters: {
    docs: {
      description: {
        component:
          "Нативная ссылка. Focus-visible добавлен для клавиатуры и не показан в SVG. Интеграция с Next.js Link не реализована.",
      },
    },
  },
  args: { href: "#features", children: "Возможности" },
} satisfies Meta<typeof NavLink>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  parameters: {
    pseudo: {
      hover: '[data-nav-state="hover"]',
      focusVisible: '[data-nav-state="focus"]',
    },
  },
  render: () => (
    <div
      className="flex gap-[var(--space-32)] p-[var(--space-32)]"
      style={{ background: "var(--color-surface)" }}
    >
      {(["default", "hover", "focus"] as const).map((state) => (
        <div key={state} className="grid gap-[var(--space-8)]">
          <NavLink href="#features" data-nav-state={state}>
            Возможности
          </NavLink>
          <span className="text-muted-foreground [font:var(--type-mono)]">
            {state}
          </span>
        </div>
      ))}
    </div>
  ),
};
