import type { Meta, StoryObj } from "@storybook/react";

import { CheckItem } from "./check-item";

const meta = {
  title: "UI/Check Item",
  component: CheckItem,
  args: { text: "Создаст черновик схемы по описанию" },
} satisfies Meta<typeof CheckItem>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div style={{ width: "min(100%, 400px)" }}>
      <CheckItem {...args} />
    </div>
  ),
};

export const Narrow: Story = {
  args: {
    text: "Создаст черновик схемы по описанию и поможет команде обсудить следующие шаги",
  },
  render: (args) => (
    <div style={{ width: "min(100%, 200px)" }}>
      <CheckItem {...args} />
    </div>
  ),
};

export const TextAlignment: Story = {
  render: () => (
    <div className="flex w-full max-w-[350px] flex-col gap-[var(--space-12)]">
      <CheckItem text="Создаст черновик схемы по описанию" />
      <CheckItem text="Накидает идеи для мозгового штурма на стикеры" />
      <CheckItem text="Очень длинный пункт с описанием совместной работы, нескольких последовательных действий и дополнительных деталей для обсуждения с командой на доске" />
    </div>
  ),
};

export const List: Story = {
  render: () => (
    <ul
      style={{
        width: "min(100%, 400px)",
        display: "grid",
        gap: 12,
        padding: 0,
        margin: 0,
        listStyle: "none",
      }}
    >
      <li>
        <CheckItem text="Создаст черновик схемы по описанию" />
      </li>
      <li>
        <CheckItem text="Поможет собрать идеи команды" />
      </li>
      <li>
        <CheckItem text="Сохранит планы в одном месте" />
      </li>
    </ul>
  ),
};
