import type { Meta, StoryObj } from "@storybook/react";

import { WorkspaceSwitcher } from ".";

const meta = {
  title: "UI/Workspace Switcher",
  component: WorkspaceSwitcher,
  args: {
    name: "Проектная группа",
    meta: "6 участников",
    markFallback: "П",
  },
  parameters: {
    docs: {
      description: {
        component:
          "Кнопка для MenuTrigger: открытое состояние поступает от Base UI. Для проверки меню используйте Workspace Menu. Тема выбирается общей кнопкой Theme.",
      },
    },
  },
} satisfies Meta<typeof WorkspaceSwitcher>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Hover: Story = { parameters: { pseudo: { hover: true } } };
export const Focus: Story = { parameters: { pseudo: { focusVisible: true } } };
