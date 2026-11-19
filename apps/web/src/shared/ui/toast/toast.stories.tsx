import type { Meta, StoryObj } from "@storybook/react";

import { ToastProvider, useToast } from ".";
import { Button } from "../button";

const meta = {
  title: "UI/Toast",
  component: ToastProvider,
  args: { children: null, position: "bottom-right" },
  argTypes: {
    children: { control: false },
    position: {
      control: "select",
      options: ["bottom-right", "bottom-left", "top-right", "top-left"],
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "ToastProvider предоставляет useToast: add возвращает ID, update и close работают также с ожидающими уведомлениями. Одновременно видны до трёх; новые ближе к краю, остальные ожидают. Обычное уведомление живёт 5 секунд, с действием — 10 секунд; очередь может вытеснить их после 3 секунд. Явный durationMs задаёт и время показа, и защиту от вытеснения; 0 начинает закрытие сразу после появления. Loading и Offline остаются до update или close и не принимают durationMs. Обновление видимого Toast заново запускает часы; действие сначала закрывает Toast, затем вызывает обработчик. При наведении, фокусе, неактивной вкладке и открытом Dialog часы останавливаются. При открытом Dialog Toast скрыты, новые ожидают. F6 переводит фокус к уведомлениям только при закрытых Dialog. Срочный приоритет задаётся явно через priority: 'high'.",
      },
    },
  },
} satisfies Meta<typeof ToastProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

function Variants() {
  const toast = useToast();
  return (
    <div className="flex flex-wrap gap-[var(--space-8)]">
      <Button
        onClick={() =>
          toast.add({
            variant: "success",
            title: "Связь восстановлена",
            description: "Доска обновлена",
          })
        }
      >
        Success
      </Button>
      <Button
        onClick={() =>
          toast.add({
            variant: "error",
            title: "Не удалось сохранить",
            description: "Проверьте соединение",
          })
        }
      >
        Error
      </Button>
      <Button
        onClick={() =>
          toast.add({
            variant: "loading",
            title: "Готовим изображение",
            description: "Это займёт несколько секунд",
          })
        }
      >
        Loading
      </Button>
      <Button
        onClick={() =>
          toast.add({
            variant: "offline",
            title: "Нет соединения",
            description: "Доска обновится, когда связь вернётся",
          })
        }
      >
        Offline
      </Button>
      <Button
        onClick={() =>
          toast.add({
            variant: "success",
            title: "Доска удалена",
            description: "Её можно восстановить из корзины",
            action: {
              label: "Отменить",
              onClick: () =>
                toast.add({ variant: "success", title: "Доска восстановлена" }),
            },
          })
        }
      >
        С действием
      </Button>
    </div>
  );
}

function ExportExample() {
  const toast = useToast();
  return (
    <Button
      onClick={() => {
        const id = toast.add({
          variant: "loading",
          title: "Готовим изображение",
          description: "Это займёт несколько секунд",
        });
        setTimeout(
          () =>
            toast.update(id, {
              variant: "success",
              title: "Изображение готово",
              description: "Файл сохранён",
            }),
          2000,
        );
      }}
    >
      Экспортировать изображение
    </Button>
  );
}

function QueueExample() {
  const toast = useToast();
  return (
    <Button
      onClick={() => {
        for (const title of [
          "Доска сохранена",
          "Ссылка скопирована",
          "Участник приглашён",
          "Изображение готово",
          "Изменения синхронизированы",
        ]) {
          toast.add({ variant: "success", title });
        }
      }}
    >
      Показать очередь уведомлений
    </Button>
  );
}

export const AllVariants: Story = {
  render: ({ position }) => (
    <ToastProvider position={position}>
      <Variants />
    </ToastProvider>
  ),
};
export const LoadingToResult: Story = {
  render: ({ position }) => (
    <ToastProvider position={position}>
      <ExportExample />
    </ToastProvider>
  ),
};
export const Queue: Story = {
  render: ({ position }) => (
    <ToastProvider position={position}>
      <QueueExample />
    </ToastProvider>
  ),
};
