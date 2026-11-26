import type { Meta, StoryObj } from "@storybook/react";
import { Copy, FolderInput, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

import {
  Menu,
  MenuContent,
  MenuItem,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuSub,
  MenuSubContent,
  MenuSubTrigger,
  MenuTrigger,
} from ".";
import { Button } from "../button";
import { Dialog, DialogContent } from "../dialog";

const meta = {
  title: "UI/Menu",
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        component:
          "Немодальное составное меню на Base UI. Передавайте существующую кнопку через MenuTrigger render. Основное меню и каждое подменю независимо принимают openOnHover, delay и closeDelay; по умолчанию открываются нажатием. В hover-подменю Base UI не обрабатывает нажатие мыши, но клавиатура и touch остаются доступны. После перехода в открытое наведением подменю цепочка может не закрыться при уходе указателя: это ограничение Base UI 1.9.0. Выбор закрывает всю цепочку; Escape закрывает текущий уровень. Shortcut — только визуальная подсказка, не обработчик клавиш. Radio-группа управляется через обязательные value и onValueChange; состояние хранится вне меню. checkSide задаётся у группы и управляет стороной галочки всех её пунктов; по умолчанию галочка слева. Диалог, открываемый из пункта, должен находиться вне размонтируемого содержимого меню.",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Actions: Story = {
  render: () => (
    <div className="p-[var(--space-64)]">
      <Menu>
        <MenuTrigger render={<Button variant="outline">Действия</Button>} />
        <MenuContent>
          <MenuItem icon={<Pencil strokeWidth={2.25} />} shortcut="F2">
            Переименовать
          </MenuItem>
          <MenuItem icon={<Copy strokeWidth={2.25} />}>Копировать</MenuItem>
          <MenuItem disabled>Переместить в архив</MenuItem>
          <MenuSeparator />
          <MenuItem destructive icon={<Trash2 strokeWidth={2.25} />}>
            Удалить
          </MenuItem>
        </MenuContent>
      </Menu>
    </div>
  ),
};

function SelectionExample({ checkSide }: { checkSide?: "left" | "right" }) {
  const [value, setValue] = useState("updated");
  return (
    <Menu>
      <MenuTrigger
        render={
          <Button variant="outline">
            {checkSide === "right" ? "Порядок сортировки" : "Сортировка"}
          </Button>
        }
      />
      <MenuContent>
        <MenuRadioGroup
          value={value}
          onValueChange={setValue}
          checkSide={checkSide}
        >
          <MenuRadioItem value="updated">По изменению</MenuRadioItem>
          <MenuRadioItem value="name">По названию</MenuRadioItem>
          <MenuRadioItem value="created">По созданию</MenuRadioItem>
        </MenuRadioGroup>
      </MenuContent>
    </Menu>
  );
}

export const Selection: Story = {
  render: () => (
    <div className="flex gap-[var(--space-24)] p-[var(--space-64)]">
      <SelectionExample />
      <SelectionExample checkSide="right" />
    </div>
  ),
};

function NestedExample({ hover = false }: { hover?: boolean }) {
  return (
    <Menu>
      <MenuTrigger
        openOnHover={hover}
        render={<Button variant="outline">Организовать</Button>}
      />
      <MenuContent>
        <MenuItem icon={<Copy strokeWidth={2.25} />}>Копировать</MenuItem>
        <MenuSub>
          <MenuSubTrigger
            openOnHover={hover}
            icon={<FolderInput strokeWidth={2.25} />}
          >
            Переместить
          </MenuSubTrigger>
          <MenuSubContent>
            <MenuItem>Проекты</MenuItem>
            <MenuItem>Черновики</MenuItem>
            <MenuSub>
              <MenuSubTrigger openOnHover={hover}>Архив</MenuSubTrigger>
              <MenuSubContent>
                <MenuItem>Прошлый год</MenuItem>
                <MenuItem>Ранее</MenuItem>
              </MenuSubContent>
            </MenuSub>
          </MenuSubContent>
        </MenuSub>
      </MenuContent>
    </Menu>
  );
}

export const Submenus: Story = {
  render: () => (
    <div className="flex gap-[var(--space-24)] p-[var(--space-64)]">
      <NestedExample />
      <NestedExample hover />
    </div>
  ),
};

export const LongMenu: Story = {
  render: () => (
    <div className="p-[var(--space-64)]">
      <Menu>
        <MenuTrigger
          render={<Button variant="outline">Выбрать папку</Button>}
        />
        <MenuContent>
          <MenuItem>
            Очень длинное название папки для совместной работы над материалами
            проекта
          </MenuItem>
          {Array.from({ length: 35 }, (_, index) => (
            <MenuItem key={index}>Папка {index + 1}</MenuItem>
          ))}
        </MenuContent>
      </Menu>
    </div>
  ),
};

function DialogExample() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Menu>
        <MenuTrigger render={<Button variant="outline">Настройки</Button>} />
        <MenuContent>
          <MenuItem onClick={() => setOpen(true)}>Переименовать</MenuItem>
        </MenuContent>
      </Menu>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          title="Переименовать"
          description="Введите новое название."
        >
          <input
            aria-label="Название"
            className="border-border rounded-[var(--radius-sm)] border p-[var(--space-8)]"
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

export const OpenDialog: Story = {
  render: () => (
    <div className="p-[var(--space-64)]">
      <DialogExample />
    </div>
  ),
};
