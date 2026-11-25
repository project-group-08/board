import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";

import { ExportAreaBar } from ".";

const meta = {
  title: "UI/Export Area Bar",
  component: ExportAreaBar,
  args: {
    onCancel: fn(),
    onExport: fn(),
  },
  argTypes: {
    onCancel: { control: false },
    onExport: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Панель сообщает о нажатиях, а показ, расположение, выделение и экспорт остаются потребителю. Тема выбирается переключателем Theme. Допущение: на узком экране содержимое переносится, поскольку в макете такое состояние не показано.",
      },
    },
  },
} satisfies Meta<typeof ExportAreaBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Narrow: Story = {
  render: (args) => (
    <div className="w-[240px] max-w-full">
      <ExportAreaBar {...args} />
    </div>
  ),
};
