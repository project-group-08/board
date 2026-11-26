import type { Meta, StoryObj } from "@storybook/react";
import { action } from "storybook/actions";

import { ContextMenu } from ".";
import { Button } from "../button";

const meta = {
  title: "UI/Context Menu",
  component: ContextMenu,
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        component:
          "Визуальная композиция с фиксированными командами. Trigger должен быть интерактивным элементом с доступным именем и передавать полученные props и ref на DOM-элемент. Вызов правым кликом и позиционирование по координатам не реализованы. Обработчики и доступность команд задаёт потребитель. Тема выбирается кнопкой Theme.",
      },
    },
  },
} satisfies Meta<typeof ContextMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Actions: Story = {
  args: {
    trigger: <Button variant="outline">Открыть меню</Button>,
    onCopy: action("onCopy"),
    onGroup: action("onGroup"),
    onExportSelection: action("onExportSelection"),
    onDelete: action("onDelete"),
  },
  render: (args) => (
    <div className="p-[var(--space-32)]">
      <ContextMenu {...args} />
    </div>
  ),
};

export const Disabled: Story = {
  ...Actions,
  args: { ...Actions.args, disabled: { group: true, delete: true } },
};

export const Narrow: Story = {
  ...Actions,
  render: (args) => (
    <div className="w-[200px] max-w-full">
      <ContextMenu {...args} />
    </div>
  ),
};
