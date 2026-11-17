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
          "Внутренний контейнер максимум 1120 px — временное предположение. Цвет copyright соответствует отдельным SVG, но отличается от полных лендингов и требует согласования с дизайнером. Мобильные правила и длинное содержимое пока не определены.",
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
