import type { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "storybook/preview-api";

import { ColorPicker, type ColorPickerOption, type ColorPickerProps } from ".";

const options: ColorPickerOption[] = [
  { value: "white", color: "#ffffff", label: "Белый" },
  { value: "yellow", color: "#fef3c7", label: "Светло-жёлтый" },
  { value: "blue", color: "#dbeafe", label: "Светло-голубой" },
  { value: "green", color: "#dcfce7", label: "Светло-зелёный" },
  { value: "pink", color: "#fce7f3", label: "Светло-розовый" },
  { value: "gray", color: "#f4f4f5", label: "Светло-серый" },
  { value: "bright-blue", color: "#2563eb", label: "Синий" },
  { value: "black", color: "#18181b", label: "Чёрный" },
];

const meta = {
  title: "UI/Color Picker",
  component: ColorPicker,
  args: { label: "Заливка", options, value: "yellow", onValueChange: () => {} },
  argTypes: { onValueChange: { control: false } },
  parameters: {
    docs: {
      description: {
        component:
          "Управляемая панель с нативной радиогруппой. Передайте подпись, варианты с уникальными value, CSS-цветом и доступным названием, выбранное value и onValueChange. Открытие, применение цвета и хранение состояния остаются у потребителя. Тема выбирается общей кнопкой Theme в Storybook и не меняет значение.",
      },
    },
  },
} satisfies Meta<typeof ColorPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

function createRender(narrow = false) {
  return function Render(args: ColorPickerProps) {
    const [, updateArgs] = useArgs();
    return (
      <div className={narrow ? "w-[100px]" : "w-[146px]"}>
        <ColorPicker
          {...args}
          onValueChange={(value) => {
            args.onValueChange(value);
            updateArgs({ value });
          }}
        />
      </div>
    );
  };
}

export const Playground: Story = { render: createRender() };
export const NarrowContainer: Story = { render: createRender(true) };

export const Focus: Story = {
  parameters: { pseudo: { focusVisible: '[value="yellow"]' } },
  render: createRender(),
};
