import type { Meta, StoryObj } from "@storybook/react";

import { Kbd } from ".";

const meta = {
  title: "UI/Kbd",
  component: Kbd,
  args: { children: "Ctrl K" },
  parameters: {
    docs: {
      description: {
        component:
          "Kbd обозначает клавиатурный ввод и не обрабатывает нажатия. Inverted предназначен для подходящей инверсной поверхности; внешние отступы и ограничения ширины задаёт композиция.",
      },
    },
  },
} satisfies Meta<typeof Kbd>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Examples: Story = {
  render: () => (
    <div className="grid justify-items-start gap-[var(--space-24)]">
      <div className="grid gap-[var(--space-8)]">
        <span className="text-muted-foreground [font:var(--type-mono)]">
          Default
        </span>
        <div className="flex items-center gap-[var(--space-8)]">
          <Kbd data-example="default-combination">Ctrl K</Kbd>
          <Kbd data-example="default-key">T</Kbd>
        </div>
      </div>
      <div className="grid gap-[var(--space-8)]">
        <span className="text-muted-foreground [font:var(--type-mono)]">
          Inverted · пример подсказки
        </span>
        <div className="bg-inverse text-inverse-foreground inline-flex items-center gap-[var(--space-8)] rounded-[var(--radius-sm)] px-[var(--space-12)] py-[6px]">
          <span className="[font:var(--type-caption)]">Выбрать инструмент</span>
          <Kbd variant="inverted" data-example="inverted-key">
            T
          </Kbd>
        </div>
      </div>
    </div>
  ),
};

export const LongText: Story = {
  name: "Long Text",
  parameters: {
    docs: {
      description: {
        story:
          "Техническая проверка длинного текста и узкого контейнера, а не пример сочетания клавиш.",
      },
    },
  },
  render: () => (
    <div className="grid justify-items-start gap-[var(--space-24)]">
      <span className="text-muted-foreground [font:var(--type-caption)]">
        Техническая проверка: длинный текст
      </span>
      <Kbd data-example="long">Ctrl Shift Alt Длинная комбинация клавиш</Kbd>
      <div style={{ width: 120 }} data-example="narrow-container">
        <Kbd data-example="narrow">
          Ctrl Shift Alt Длинная комбинация клавиш
        </Kbd>
      </div>
      <div style={{ width: 120 }} data-example="unbroken-container">
        <Kbd data-example="unbroken">ОченьДлиннаяСтрокаБезПробелов</Kbd>
      </div>
    </div>
  ),
};
