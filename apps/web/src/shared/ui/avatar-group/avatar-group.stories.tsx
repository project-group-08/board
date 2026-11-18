import type { Meta, StoryObj } from "@storybook/react";

import { Avatar } from "../avatar";
import { AvatarGroup } from "./avatar-group";

const image = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="120" height="80"><rect width="120" height="80" fill="#2563eb"/><circle cx="60" cy="40" r="28" fill="#f4f4f5"/></svg>')}`;

const meta = {
  title: "UI/Avatar Group",
  component: AvatarGroup,
  args: {
    label: "Участники доски",
    children: [
      <Avatar key="n" name="Надежда Иванова" fallback="Н" src={image} />,
      <Avatar key="s" name="Сергей Петров" fallback="С" />,
      <Avatar key="a" name="Анна Смирнова" fallback="А" />,
    ],
  },
  argTypes: { children: { control: false } },
  parameters: {
    docs: {
      description: {
        component: `Группа принимает отдельные Avatar размера default в порядке, заданном потребителем. \`label\` — доступное название списка. Необязательный \`more\` содержит готовые видимый \`text\` и доступный \`label\`; оба должны быть непустыми. Счётчик не интерактивен. Группа не сортирует и не ограничивает участников и не вычисляет число скрытых.

В SVG шаг центров кругов — 26 px, геометрия контура — 34 px с обводкой 2 px. Светлый экспорт обрезает группу, тёмный — нет. Для этой реализации выбраны круг 32 px, внешняя обводка 2 px цветом background и шаг центров 26 px; это интерпретация макета. Высота строки счётчика 20 px также не задана явно в SVG.`,
      },
    },
  },
} satisfies Meta<typeof AvatarGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithMore: Story = {
  args: { more: { text: "+3", label: "Ещё 3 участника" } },
};

export const WithoutMore: Story = {};
