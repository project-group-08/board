import type { Meta, StoryObj } from "@storybook/react";

import { Avatar } from "./avatar";

const image = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="120" height="80"><rect width="120" height="80" fill="#2563eb"/><circle cx="60" cy="40" r="28" fill="#f4f4f5"/></svg>')}`;

const meta = {
  title: "UI/Avatar",
  component: Avatar,
  args: { name: "Надежда Иванова", fallback: "НИ" },
  parameters: {
    docs: {
      description: {
        component: `\`name\` и \`fallback\` обязательны и должны быть непустыми строками. \`name\` — полное доступное имя, \`fallback\` — заранее подготовленный короткий текст, обычно одна или две буквы. Компонент не генерирует инициалы и не изменяет переданный текст; вызывающая сторона отвечает за корректность значений.

\`src\` необязателен, \`size\` принимает \`default\` (32 px, по умолчанию) или \`large\` (64 px). Пока изображение загружается, при ошибке или отсутствии \`src\` показывается \`fallback\`. Доступное имя остаётся одинаковым для изображения и замены. Avatar не интерактивен.

SVG макета показывает текстовые аватары и градиентные примеры Image, но не изображение пользователя и не состояния загрузки и ошибки. Поэтому заполнение круга через \`object-fit: cover\`, немедленный показ текстовой замены во время загрузки и использование высоты строки токенов \`--type-label\` и \`--type-heading-3\` — согласованные для реализации предположения, а не параметры, извлечённые из SVG.`,
      },
    },
  },
  argTypes: {
    size: { control: "select", options: ["default", "large"] },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Image: Story = { args: { src: image } };
export const Error: Story = { args: { src: "/avatar-not-found.png" } };

export const Matrix: Story = {
  render: () => (
    <div className="flex items-start gap-[var(--space-24)] rounded-[var(--radius-md)] bg-[var(--color-surface)] p-[var(--space-24)]">
      {(["default", "large"] as const).map((size) => (
        <div
          key={size}
          className="flex flex-col items-center gap-[var(--space-8)]"
        >
          <Avatar name="Надежда Иванова" fallback="Н" size={size} />
          <Avatar
            name="Надежда Иванова"
            fallback="НИ"
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
