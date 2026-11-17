import type { Meta, StoryObj } from "@storybook/react";

import { SectionDescription } from ".";
import { SectionTitle } from "../section-title";

const meta = {
  title: "UI/Section Description",
  component: SectionDescription,
  args: { children: "Текст, стикеры и фигуры в одном месте." },
} satisfies Meta<typeof SectionDescription>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const OnInverse: Story = {
  args: {
    tone: "on-inverse",
    children: "Создайте доску и отправьте ссылку коллегам.",
  },
  render: (args) => (
    <div className="bg-inverse p-[var(--space-32)]">
      <SectionDescription {...args} />
    </div>
  ),
};

export const WithSectionTitle: Story = {
  render: (args) => (
    <div className="text-center">
      <SectionTitle title="Доска для схем, идей и планов" align="center" />
      <div className="mt-[var(--space-16)]">
        <SectionDescription {...args} />
      </div>
    </div>
  ),
};
