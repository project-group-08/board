import type { Meta, StoryObj } from "@storybook/react";

import { Separator } from ".";

const meta = {
  title: "UI/Separator",
  component: Separator,
  parameters: {
    docs: {
      description: {
        component:
          "Семантический разделитель обозначает границу содержимого. Используйте decorative для чисто визуальных линий. Внешние отступы задаёт композиция.",
      },
    },
  },
} satisfies Meta<typeof Separator>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div style={{ width: 200 }}>
      <Separator {...args} />
    </div>
  ),
};

export const Examples: Story = {
  render: () => (
    <div className="grid gap-[var(--space-32)]" style={{ maxWidth: 320 }}>
      <section className="grid gap-[var(--space-12)]">
        <p className="[font:var(--type-body-s)]">Информация о доске</p>
        <Separator data-example="horizontal" />
        <p className="[font:var(--type-body-s)]">Настройки доступа</p>
      </section>
      <div className="flex items-center gap-[var(--space-12)]">
        <button type="button" className="[font:var(--type-body-s)]">
          Копировать
        </button>
        <Separator orientation="vertical" decorative data-example="vertical" />
        <button type="button" className="[font:var(--type-body-s)]">
          Удалить
        </button>
      </div>
      <div className="flex items-center gap-[var(--space-12)]">
        <span>Группа</span>
        <Separator
          orientation="vertical"
          decorative
          className="h-[32px]"
          data-example="vertical-custom"
        />
        <span>Действия</span>
      </div>
    </div>
  ),
};
