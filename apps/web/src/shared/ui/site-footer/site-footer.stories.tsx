import type { Meta, StoryObj } from "@storybook/react";

import { SiteFooter } from ".";

const meta = {
  title: "UI/Site Footer",
  component: SiteFooter,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "До 768 px содержимое расположено вертикально, с 768 px — горизонтально. Внутренний контейнер ограничен 1120 px. Цвет copyright соответствует отдельным SVG UI Kit и отличается от полных лендингов.",
      },
    },
  },
  args: {
    brand: "[Название]",
    copyright: "© 2026\u00a0[Название]. Все права защищены",
  },
} satisfies Meta<typeof SiteFooter>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {
  render: (args) => (
    <div className="mx-auto max-w-[1280px]">
      <SiteFooter {...args} />
    </div>
  ),
};

export const Mobile: Story = {
  globals: { viewport: { value: "mobile2", isRotated: false } },
};

export const LongContent: Story = {
  args: {
    brand: "Название организации с длинным именем для совместной работы",
    copyright:
      "© 2026 Организация. Все права защищены. " +
      "ДлинноеНеразрывноеСодержимое".repeat(5),
  },
};
