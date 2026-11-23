import type { Meta, StoryObj } from "@storybook/react";
import { Ellipsis } from "lucide-react";
import { useState } from "react";
import { fn } from "storybook/test";

import { TableHeader } from ".";
import { Button } from "../button";
import { IconButton } from "../icon-button";
import { MemberRow } from "../member-row";
import { TrashRow } from "../trash-row";

const trashLabels = {
  name: "Название",
  deletedBy: "Удалил",
  deletedAt: "Удалена",
};
const memberLabels = { member: "Участник", role: "Роль" };
const onRestorePlan = fn();
const onRestoreIdeas = fn();
const onAnnaAction = fn();
const onNikitaAction = fn();

const meta = {
  title: "UI/Table Header",
  component: TableHeader,
  args: { kind: "trash", labels: trashLabels },
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        component:
          "Визуальный заголовок: kind выбирает сетку trash или members, подписи передаёт потребитель; последняя колонка оставлена для действий без подписи. Нет сортировки, обработчиков, собственной заливки и разделителя. Тема выбирается общим переключателем Theme. От 720 px ширины контейнера сетка, отступы 16 px и промежутки 16 px совпадают с соответствующими строками; ниже заголовок скрыт. Вертикальные отступы 8 px предварительные, длинные подписи переносятся. Размеры сетки и порог предварительные: при изменении TrashRow или MemberRow необходимо синхронизировать заголовок. Роли таблицы не задаются и связь заголовков с полями div-строк автоматически не создаётся: семантика списка и обозначение полей на узком экране остаются задачей интеграции.",
      },
    },
  },
} satisfies Meta<typeof TableHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Trash: Story = {
  render: () => (
    <div className="w-[1120px] max-w-full">
      <TableHeader kind="trash" labels={trashLabels} />
      <TrashRow
        name="План проекта"
        deletedBy="Анна"
        deletedAt="Сегодня"
        restoreAction={
          <Button
            variant="ghost"
            size="small"
            aria-label="Восстановить доску План проекта"
            onClick={onRestorePlan}
          >
            Восстановить
          </Button>
        }
      />
      <TrashRow
        name="Идеи"
        deletedBy="Никита"
        deletedAt="Вчера"
        restoreAction={
          <Button
            variant="ghost"
            size="small"
            aria-label="Восстановить доску Идеи"
            onClick={onRestoreIdeas}
          >
            Восстановить
          </Button>
        }
      />
    </div>
  ),
};

export const Members: Story = {
  render: () => (
    <div className="w-[1120px] max-w-full">
      <TableHeader kind="members" labels={memberLabels} />
      <MemberRow
        name="Анна"
        email="anna@example.com"
        avatarFallback="А"
        roleContent="Владелец"
        action={
          <IconButton
            aria-label="Действия участника Анна"
            onClick={onAnnaAction}
          >
            <Ellipsis />
          </IconButton>
        }
      />
      <MemberRow
        name="Никита"
        email="nikita@example.com"
        avatarFallback="Н"
        roleContent="Редактор"
        action={
          <IconButton
            aria-label="Действия участника Никита"
            onClick={onNikitaAction}
          >
            <Ellipsis />
          </IconButton>
        }
      />
    </div>
  ),
};

function ThresholdExample() {
  const [width, setWidth] = useState(720);

  return (
    <div className="flex flex-col items-start gap-[var(--space-16)]">
      <label className="flex flex-col gap-[var(--space-8)]">
        <span>Ширина контейнера: {width} px (порог 720 px)</span>
        <input
          type="range"
          min={300}
          max={1000}
          step={1}
          value={width}
          onChange={(event) => setWidth(Number(event.currentTarget.value))}
        />
      </label>
      <div className="max-w-full overflow-x-auto">
        <div style={{ width }} className="outline-border outline">
          <TableHeader kind="trash" labels={trashLabels} />
          <TableHeader kind="members" labels={memberLabels} />
        </div>
      </div>
    </div>
  );
}

export const Threshold: Story = {
  render: () => <ThresholdExample />,
};
