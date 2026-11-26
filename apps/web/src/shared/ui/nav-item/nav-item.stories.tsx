import type { Meta, StoryObj } from "@storybook/react";
import { LayoutGrid } from "lucide-react";

import { NavItem } from ".";

const meta = {
  title: "UI/Nav Item",
  component: NavItem,
  args: {
    href: "#boards",
    icon: <LayoutGrid strokeWidth={2.25} />,
    children: "Доски",
  },
  argTypes: { icon: { control: false } },
  parameters: {
    docs: {
      description: {
        component:
          "Ссылка между разделами: обязательны href, текст и декоративная icon. current отмечает текущий раздел через aria-current=page. Пункт занимает ширину родителя, длинная подпись переносится. Тема выбирается общей кнопкой Theme на панели Storybook.",
      },
    },
  },
} satisfies Meta<typeof NavItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div className="w-[224px]">
      <NavItem {...args} />
    </div>
  ),
};

export const States: Story = {
  parameters: {
    pseudo: {
      hover:
        '[data-nav-item-state="hover"], [data-nav-item-state="active-hover"]',
      focusVisible:
        '[data-nav-item-state="focus"], [data-nav-item-state="active-focus"]',
    },
  },
  render: (args) => (
    <div className="flex flex-wrap gap-[var(--space-24)] bg-[var(--color-surface)] p-[var(--space-24)]">
      {(
        [
          "default",
          "hover",
          "active",
          "focus",
          "active-hover",
          "active-focus",
        ] as const
      ).map((state) => (
        <div key={state} className="grid w-[224px] gap-[var(--space-8)]">
          <NavItem
            {...args}
            current={state.startsWith("active")}
            data-nav-item-state={state}
          />
          <span className="text-muted-foreground [font:var(--type-mono)]">
            {state}
          </span>
        </div>
      ))}
    </div>
  ),
};

export const NarrowContainer: Story = {
  render: (args) => (
    <div className="w-[120px] bg-[var(--color-surface)] p-[var(--space-8)]">
      <NavItem {...args} current>
        ОченьДлинноеНазваниеРазделаБезПробелов
      </NavItem>
    </div>
  ),
};
