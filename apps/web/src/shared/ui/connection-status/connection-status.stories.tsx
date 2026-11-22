import type { Meta, StoryObj } from "@storybook/react";

import { ConnectionStatus } from ".";

const meta = {
  title: "UI/Connection Status",
  component: ConnectionStatus,
  args: { state: "offline", text: "Нет соединения" },
  parameters: {
    docs: {
      description: {
        component:
          "Неинтерактивная метка с декоративной иконкой. Потребитель задаёт state и text и отвечает за их согласованность, показ и расположение; компонент не управляет соединением и не объявляет изменения. Иконка reconnecting вращается, кроме режима prefers-reduced-motion. Длинный текст переносится в пределах родителя. Тема выбирается общей кнопкой Theme.",
      },
    },
  },
} satisfies Meta<typeof ConnectionStatus>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Offline: Story = {};

export const Reconnecting: Story = {
  args: { state: "reconnecting", text: "Переподключаемся" },
};

export const LongText: Story = {
  args: { state: "reconnecting", text: "Переподключаемся к совместной доске" },
  render: (args) => (
    <div className="w-[140px]">
      <ConnectionStatus {...args} />
    </div>
  ),
};
