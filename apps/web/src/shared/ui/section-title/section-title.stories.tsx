import type { Meta, StoryObj } from "@storybook/react";

import { SectionTitle } from "./section-title";

const meta = {
  title: "UI/Section Title",
  component: SectionTitle,
  args: {
    label: "01 / Возможности",
    title: "Доска для схем, идей и планов",
  },
} satisfies Meta<typeof SectionTitle>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Left: Story = {
  render: (args) => (
    <div style={{ width: "min(100%, 720px)" }}>
      <SectionTitle {...args} />
    </div>
  ),
};

export const Center: Story = {
  args: { align: "center" },
  render: (args) => (
    <div style={{ width: "min(100%, 720px)" }}>
      <SectionTitle {...args} />
    </div>
  ),
};

export const WithoutLabel: Story = {
  args: { label: undefined },
};

export const OnInverse: Story = {
  args: {
    title: "Соберите команду у одной доски",
    label: undefined,
    tone: "on-inverse",
    align: "center",
  },
  render: (args) => (
    <div className="bg-inverse p-[var(--space-32)]">
      <SectionTitle {...args} />
    </div>
  ),
};

export const OnInverseWithLabel: Story = {
  args: { label: "Метка", title: "Заголовок", tone: "on-inverse" },
  parameters: {
    docs: {
      description: {
        story:
          "Временно label использует цвет заголовка: в макете label на инверсной поверхности не показан.",
      },
    },
  },
  render: (args) => (
    <div className="bg-inverse p-[var(--space-32)]">
      <SectionTitle {...args} />
    </div>
  ),
};

export const Narrow: Story = {
  args: { title: "Доска для схем, идей и планов вашей команды", as: "h3" },
  render: (args) => (
    <div style={{ width: "min(100%, 280px)" }}>
      <SectionTitle {...args} />
    </div>
  ),
};
