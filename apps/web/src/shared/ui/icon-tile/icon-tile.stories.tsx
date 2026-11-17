import type { Meta, StoryObj } from "@storybook/react";
import { ZoomIn } from "lucide-react";

import { IconTile } from "./icon-tile";

const meta = {
  title: "UI/Icon Tile",
  component: IconTile,
  // 2.25 viewBox units scale to 1.5px when a 24-unit Lucide icon is rendered at 16px.
  args: { icon: <ZoomIn strokeWidth={2.25} /> },
  argTypes: { icon: { control: false } },
} satisfies Meta<typeof IconTile>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div
      style={{
        padding: 32,
        background: "var(--color-surface)",
        borderRadius: 12,
      }}
    >
      <IconTile {...args} />
    </div>
  ),
};
