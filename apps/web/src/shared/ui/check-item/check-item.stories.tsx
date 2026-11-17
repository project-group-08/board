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
