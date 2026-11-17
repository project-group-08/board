import type { Meta, StoryObj } from "@storybook/react";

import { SelectionHighlight } from ".";

const meta = {
  title: "UI/Selection Highlight",
  component: SelectionHighlight,
  args: { label: "Владимир", children: "команда и ИИ" },
  decorators: [
    (Story) => (
      <div
        className="text-foreground tracking-[var(--tracking-display)] [font:var(--type-display)]"
        style={{ padding: "16px 120px 16px 16px" }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SelectionHighlight>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const LongText: Story = {
  args: {
    children: "очень длинная выделенная фраза для исследования",
    label: "Владимир",
  },
  parameters: {
    docs: {
      description: {
        story: "Фраза не переносится и может переполнять контейнер.",
      },
    },
  },
};
