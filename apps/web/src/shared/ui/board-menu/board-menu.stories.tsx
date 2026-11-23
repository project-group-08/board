import type { Meta, StoryObj } from "@storybook/react";
import { MoreHorizontal } from "lucide-react";
import { action } from "storybook/actions";

import { BoardMenu } from ".";
import { BoardCard } from "../board-card";
import { IconButton } from "../icon-button";

const meta = {
  title: "UI/Board Menu",
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        component:
          "Потребитель передаёт триггер, ссылку, подписи и обработчики. Trigger должен передавать полученные props и ref на интерактивный DOM-элемент; IconButton соответствует этому требованию. Действия и подтверждение удаления остаются снаружи; диалог размещается вне содержимого меню. Тема выбирается общей кнопкой Theme.",
      },
    },
  },
} satisfies Meta<typeof BoardMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithBoardCard: Story = {
  render: () => (
    <div className="w-[268px] max-w-full">
      <BoardCard
        href="#board"
        title="Проектная доска"
        meta="Изменена сегодня"
        menu={
          <BoardMenu
            href="#board"
            labels={{
              open: "Открыть",
              rename: "Переименовать",
              copy: "Копировать",
              delete: "Удалить",
            }}
            onRename={action("onRename")}
            onCopy={action("onCopy")}
            onDelete={action("onDelete")}
            trigger={
              <IconButton
                aria-label="Действия с доской"
                className="data-[popup-open]:bg-muted-hover"
              >
                <MoreHorizontal strokeWidth={1.5} />
              </IconButton>
            }
          />
        }
      />
    </div>
  ),
};
