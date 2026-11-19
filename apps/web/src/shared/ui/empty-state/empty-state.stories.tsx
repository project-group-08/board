import type { Meta, StoryObj } from "@storybook/react";
import { CircleAlert, LayoutGrid, Plus, Search } from "lucide-react";

import { Button } from "../button";
import { EmptyState } from "./empty-state";

const meta = {
  title: "UI/Empty State",
  component: EmptyState,
  args: {
    icon: <LayoutGrid strokeWidth={2.25} />,
    title: "Пока нет досок",
    description: "Создайте доску и пригласите команду",
  },
  argTypes: { icon: { control: false }, action: { control: false } },
  parameters: {
    docs: {
      description: {
        component:
          "Иконка декоративная и скрыта от скринридера. Заголовок по умолчанию h2; уровень h1–h6 задаётся через as. action принимает готовый элемент: его семантика и поведение определяются потребителем. Объявление динамического состояния также остаётся на стороне потребителя. Компонент занимает доступную ширину; className позволяет изменить внешнюю компоновку, в том числе вертикальные отступы 48 px по умолчанию.",
      },
    },
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    action: (
      <Button variant="accent" leadingIcon={<Plus strokeWidth={2.25} />}>
        Новая доска
      </Button>
    ),
  },
};

export const SearchResults: Story = {
  args: {
    icon: <Search strokeWidth={2.25} />,
    title: "Ничего не нашлось",
    description: "Попробуйте другой запрос",
  },
};

export const Error: Story = {
  args: {
    icon: <CircleAlert className="text-destructive" strokeWidth={2.25} />,
    title: "Не удалось загрузить доски",
    description: "Проверьте соединение и попробуйте ещё раз",
    action: <Button variant="outline">Повторить</Button>,
  },
};

export const Narrow: Story = {
  args: {
    icon: <Search strokeWidth={2.25} />,
    title: "Оченьдлинноеслововзаголовкенепоместитсянаоднойстроке",
    description:
      "Описание с длинным словом: Оченьдлинныйпоисковыйзапросбезпробелов.",
  },
  render: (args) => (
    <div className="w-full max-w-[180px]">
      <EmptyState {...args} />
    </div>
  ),
};
