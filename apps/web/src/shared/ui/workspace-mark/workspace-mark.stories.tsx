import type { Meta, StoryObj } from "@storybook/react";

import { WorkspaceMark } from "./workspace-mark";

const image = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="120" height="80"><rect width="120" height="80" fill="#2563eb"/><circle cx="60" cy="40" r="28" fill="#f4f4f5"/></svg>')}`;

const meta = {
  title: "UI/Workspace Mark",
  component: WorkspaceMark,
  args: { name: "Продуктовая команда", fallback: "П" },
  parameters: {
    docs: {
      description: {
        component: `\`name\` и \`fallback\` обязательны и должны быть непустыми строками. \`name\` — полное доступное название пространства, \`fallback\` — готовый короткий текст. Потребитель подготавливает значения; компонент их не валидирует и не обрезает и не генерирует инициалы.

\`src\` необязателен. Пока изображение загружается, при ошибке или отсутствии \`src\` показывается \`fallback\`; загруженное изображение заполняет форму с \`object-fit: cover\`. Доступное имя остаётся одинаковым без дублирования. Workspace Mark не интерактивен.

Размеры — 32 × 32 px с радиусом 8 px и 64 × 64 px с радиусом 12 px. SVG показывает градиентные примеры Image, но не реальные изображения и не состояния загрузки и ошибки. Высоты строк токенов \`--type-label\` и \`--type-title\`, заполнение изображения и поведение fallback — согласованные предположения, не заданные SVG.`,
      },
    },
  },
  argTypes: {
    size: { control: "select", options: ["default", "large"] },
  },
} satisfies Meta<typeof WorkspaceMark>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Image: Story = { args: { src: image } };
export const Error: Story = { args: { src: "/workspace-mark-not-found.png" } };

export const Matrix: Story = {
  render: () => (
    <div className="flex items-start gap-[var(--space-24)] rounded-[var(--radius-md)] bg-[var(--color-surface)] p-[var(--space-24)]">
      {(["default", "large"] as const).map((size) => (
        <div
          key={size}
          className="flex flex-col items-center gap-[var(--space-8)]"
        >
          <WorkspaceMark name="Продуктовая команда" fallback="П" size={size} />
          <WorkspaceMark
            name="Продуктовая команда"
            fallback="П"
            src={image}
            size={size}
          />
          <span className="text-muted-foreground [font:var(--type-mono)]">
            {size}
          </span>
        </div>
      ))}
    </div>
  ),
};
