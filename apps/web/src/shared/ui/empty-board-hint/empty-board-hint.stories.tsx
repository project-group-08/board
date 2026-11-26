import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";

import { EmptyBoardHint } from ".";

const meta = {
  title: "UI/Empty Board Hint",
  component: EmptyBoardHint,
  args: {
    onAddSticker: fn(),
    onCreateDraft: fn(),
    onInvite: fn(),
  },
  parameters: {
    docs: {
      description: {
        component:
          "Подсказка занимает доступную ширину, без фона и фиксированного размера образца. Потребитель определяет условие показа и обработчики, а через as выбирает уровень заголовка. Тема выбирается переключателем Theme. Допущение: на узком экране текст и ряд кнопок переносятся, кнопки остаются по центру.",
      },
    },
  },
} satisfies Meta<typeof EmptyBoardHint>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Narrow: Story = {
  render: (args) => (
    <div className="w-[240px] max-w-full">
      <EmptyBoardHint {...args} />
    </div>
  ),
};
