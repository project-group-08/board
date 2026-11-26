import type { Meta, StoryObj } from "@storybook/react";

import { EditLockLabel } from ".";

const meta = {
  title: "UI/Edit Lock Label",
  component: EditLockLabel,
  args: { text: "Катя редактирует" },
  parameters: {
    docs: {
      description: {
        component:
          "Неинтерактивная метка с декоративным карандашом. Текст, показ и расположение задаёт потребитель; компонент не управляет блокировкой и не объявляет появление. По умолчанию цвета соответствуют текущей теме, выбираемой общей кнопкой Theme. backgroundColor и textColor независимо принимают CSS-цвета; контраст пользовательской пары обеспечивает потребитель. Длинный текст переносится в пределах родителя.",
      },
    },
  },
} satisfies Meta<typeof EditLockLabel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const CustomColors: Story = {
  args: { backgroundColor: "#1d4ed8", textColor: "#ffffff" },
};

export const LongText: Story = {
  args: { text: "Александра редактирует содержимое этого элемента" },
  render: (args) => (
    <div className="w-[140px]">
      <EditLockLabel {...args} />
    </div>
  ),
};
