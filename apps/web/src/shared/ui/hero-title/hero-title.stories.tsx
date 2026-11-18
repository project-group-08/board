import type { Meta, StoryObj } from "@storybook/react";

import { HeroTitle } from ".";
import { SelectionHighlight } from "../selection-highlight";

const meta = {
  title: "UI/Hero Title",
  component: HeroTitle,
  args: { children: "Главный заголовок" },
} satisfies Meta<typeof HeroTitle>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const HeroComposition: Story = {
  render: () => (
    <div
      style={{
        width: "min(100%, 800px)",
        marginInline: "auto",
        textAlign: "center",
        paddingTop: 16,
      }}
    >
      <HeroTitle>
        Доска, где{" "}
        <SelectionHighlight label="Владимир">команда и ИИ</SelectionHighlight>{" "}
        проектируют вместе
      </HeroTitle>
    </div>
  ),
};

export const MobileComposition: Story = {
  ...HeroComposition,
  globals: { viewport: { value: "mobile2", isRotated: false } },
  parameters: {
    docs: {
      description: {
        story:
          "До 768 px используется мобильная типографика; начиная с 768 px — крупная.",
      },
    },
  },
};

export const NarrowResearch: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Исследовательский пример, не согласованный мобильный дизайн: выделение не переносится и может переполнить контейнер.",
      },
    },
  },
  render: () => (
    <div style={{ width: 280, textAlign: "center", paddingTop: 16 }}>
      <HeroTitle>
        Доска, где{" "}
        <SelectionHighlight label="Владимир">команда и ИИ</SelectionHighlight>{" "}
        проектируют вместе
      </HeroTitle>
    </div>
  ),
};
