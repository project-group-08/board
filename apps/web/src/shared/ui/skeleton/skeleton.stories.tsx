import type { Meta, StoryObj } from "@storybook/react";
import { ZoomIn } from "lucide-react";

import { Skeleton } from ".";
import { FeatureCard } from "../feature-card";

const meta = {
  title: "UI/Skeleton",
  component: Skeleton,
  args: { className: "h-[16px] w-[200px]" },
  parameters: {
    docs: {
      description: {
        component:
          "Skeleton — пустая декоративная заглушка, скрытая от дерева доступности. Размеры и расположение задаёт потребитель через className; 200 × 16 px — пример из SVG, а не размер по умолчанию. Состояние загрузки и его доступное объявление также контролирует потребитель. Пульсация — согласованное дополнение к статичному SVG: непрозрачность меняется от 1 до 0,5 и обратно за 2 секунды с cubic-bezier(0.4, 0, 0.6, 1). При prefers-reduced-motion анимация отключена, заглушка остаётся видимой.",
      },
    },
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Example: Story = {
  args: {
    className: "h-[16px] w-[200px]",
  },
};

export const FeatureCardExample: Story = {
  name: "Feature Card Example",
  parameters: {
    docs: {
      description: {
        story:
          "Демонстрационная композиция повторяет карточку с иконкой. Заглушка и готовая карточка показаны рядом для сравнения; состояние загрузки и его объявление задаёт потребитель.",
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap items-start gap-[var(--space-24)]">
      <div className="w-full max-w-[368px] min-w-0">
        <p className="text-muted-foreground mb-[var(--space-8)] [font:var(--type-caption)]">
          Заглушка
        </p>
        <div className="border-border bg-background box-border flex w-full min-w-0 flex-col gap-[var(--space-12)] rounded-[var(--radius-lg)] border p-[calc(var(--space-24)-1px)]">
          <Skeleton className="size-[32px] rounded-[var(--radius-md)]" />
          <div className="flex h-[28px] items-center">
            <Skeleton className="h-[20px] w-3/4" />
          </div>
          <div className="flex h-[48px] flex-col justify-around">
            <Skeleton className="h-[16px] w-full" />
            <Skeleton className="h-[16px] w-4/5" />
          </div>
        </div>
      </div>
      <div className="w-full max-w-[368px] min-w-0">
        <p className="text-muted-foreground mb-[var(--space-8)] [font:var(--type-caption)]">
          Готовая карточка
        </p>
        <FeatureCard
          variant="icon"
          icon={<ZoomIn strokeWidth={2.25} />}
          title="Бесконечное пространство"
          description="Масштабируйте доску и свободно размещайте идеи вместе с командой."
        />
      </div>
    </div>
  ),
};
