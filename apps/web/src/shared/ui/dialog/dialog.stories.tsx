import type { Meta, StoryObj } from "@storybook/react";

import { Dialog, DialogClose, DialogContent, DialogTrigger } from ".";
import { Button } from "../button";

const meta = {
  title: "UI/Dialog",
  component: DialogContent,
  argTypes: {
    children: { control: false },
    actions: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Модальный Dialog на Base UI. Dialog поддерживает defaultOpen и управляемые open/onOpenChange; второй аргумент onOpenChange содержит reason и cancel(). DialogTrigger и DialogClose принимают существующие кнопки через render. Заголовок обязателен, описание и содержимое необязательны. Действия принадлежат сценарию и сами по себе окно не закрывают. Весь диалог прокручивается целиком; ширина до 440 px, отступ от viewport не менее 16 px. Backdrop использует токен overlay. Предварительная анимация 200 мс: прозрачность, масштаб 0.98 → 1 и сдвиг снизу на 8 px; при закрытии — обратно. При reduced motion переходы и движение отключены. Прокрутка, адаптивность и анимация требуют визуальной оценки.",
      },
    },
  },
} satisfies Meta<typeof DialogContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    title: "Удалить доску",
    description: "Доска попадёт в корзину. Восстановить её можно из корзины",
  },
  render: (args) => (
    <Dialog>
      <DialogTrigger render={<Button>Открыть диалог</Button>} />
      <DialogContent
        {...args}
        actions={
          <>
            <DialogClose render={<Button variant="outline">Отмена</Button>} />
            <Button variant="destructive">Удалить</Button>
          </>
        }
      >
        <div className="border-border text-muted-foreground flex h-[64px] items-center justify-center rounded-[var(--radius-sm)] border border-dashed [font:var(--type-caption)]">
          Содержимое
        </div>
      </DialogContent>
    </Dialog>
  ),
};

export const LongContent: Story = {
  args: { title: "Длинное содержимое" },
  parameters: { controls: { disable: true } },
  render: () => (
    <Dialog>
      <DialogTrigger render={<Button>Открыть длинный диалог</Button>} />
      <DialogContent
        title="Длинное содержимое"
        description="Уменьшите высоту viewport и прокрутите всё окно."
        actions={<DialogClose render={<Button>Готово</Button>} />}
      >
        <div className="flex flex-col gap-[var(--space-24)] [font:var(--type-body-s)]">
          {Array.from({ length: 12 }, (_, index) => (
            <p key={index}>
              Раздел {index + 1}. Содержимое диалога прокручивается вместе с
              заголовком и действиями.
            </p>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  ),
};

export const NarrowViewport: Story = {
  args: { title: "Действия на узком экране" },
  parameters: { controls: { disable: true } },
  render: () => (
    <Dialog>
      <DialogTrigger render={<Button>Открыть действия</Button>} />
      <DialogContent
        title="Действия на узком экране"
        description="Уменьшите ширину viewport, чтобы проверить перенос кнопок."
        actions={
          <>
            <DialogClose
              render={<Button variant="outline">Вернуться назад</Button>}
            />
            <Button>Продолжить работу</Button>
          </>
        }
      />
    </Dialog>
  ),
};
