import type { Meta, StoryObj } from "@storybook/react";

import { Badge } from ".";

const meta = {
  title: "UI/Badge",
  component: Badge,
  args: { children: "Владелец" },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "outline", "accent", "destructive"],
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Badge — неинтерактивная текстовая метка span. Поддерживает стандартные атрибуты span и className. Доступны варианты default, outline, accent и destructive; по умолчанию — default. Минимальная высота всех вариантов — 24 px с учётом рамки. Длинный текст не обрезается: он может переноситься и увеличивать высоту. Высота строки 20 px — согласованное предположение, поскольку SVG её явно не задаёт.",
      },
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-start gap-[var(--space-32)]">
      <Badge data-example="default">Владелец</Badge>
      <Badge variant="outline" data-example="outline">
        Приглашён
      </Badge>
      <Badge variant="accent" data-example="accent">
        Вы
      </Badge>
      <Badge variant="destructive" data-example="destructive">
        Ошибка
      </Badge>
    </div>
  ),
};

export const LongText: Story = {
  name: "Long Text",
  render: () => (
    <div className="grid gap-[var(--space-16)]">
      <div className="w-[120px]" data-example="narrow-container">
        <Badge variant="outline" data-example="long">
          Приглашение ожидает подтверждения участника
        </Badge>
      </div>
      <div className="w-[120px]" data-example="unbroken-container">
        <Badge variant="accent" data-example="unbroken">
          ОченьДлинноеНазваниеБезПробелов
        </Badge>
      </div>
      <Badge id="badge-example" title="Роль участника" className="opacity-90">
        Редактор
      </Badge>
    </div>
  ),
};
