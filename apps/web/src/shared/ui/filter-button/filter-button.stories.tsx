import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { action } from "storybook/actions";

import { FilterButton } from ".";
import {
  Menu,
  MenuContent,
  MenuRadioGroup,
  MenuRadioItem,
  MenuTrigger,
} from "../menu";

const selection = action("onSelection");
const openChange = action("onOpenChange");

function SelectionExample({ longLabel = false }: { longLabel?: boolean }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("все");
  return (
    <Menu
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        openChange(next);
      }}
    >
      <MenuTrigger
        render={
          <FilterButton
            text={`${longLabel ? "Владелец рабочего пространства с очень длинным названием" : "Владелец"}: ${value}`}
            open={open}
          />
        }
      />
      <MenuContent>
        <MenuRadioGroup
          value={value}
          onValueChange={(next: string) => {
            setValue(next);
            selection(next);
          }}
        >
          <MenuRadioItem value="все">Все</MenuRadioItem>
          <MenuRadioItem value="я">Я</MenuRadioItem>
        </MenuRadioGroup>
      </MenuContent>
    </Menu>
  );
}

const meta = {
  title: "UI/Filter Button",
  component: FilterButton,
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        component:
          "Кнопка управляется потребителем. Список и одиночный выбор в примерах — демонстрационное допущение: в секции Filter Button они не показаны. Выбор и изменение состояния меню отображаются в Actions. Тема выбирается общим переключателем Theme. Focus и disabled не показаны в макете и наследуются от Button. Допущение для узкого контейнера: длинная подпись сокращается многоточием, полное имя остаётся доступным для вспомогательных технологий.",
      },
    },
  },
} satisfies Meta<typeof FilterButton>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { text: "Владелец: все" },
  render: () => (
    <div className="p-[var(--space-32)]">
      <SelectionExample />
    </div>
  ),
};

export const LongLabel: Story = {
  args: { text: "Владелец: все" },
  render: () => (
    <div className="w-full max-w-[180px]">
      <SelectionExample longLabel />
    </div>
  ),
};

export const StaticStates: Story = {
  name: "Статичная матрица состояний",
  args: { text: "Владелец: все" },
  parameters: {
    pseudo: { hover: '[data-filter-state="hover"]' },
    docs: {
      description: {
        story:
          "Статичные фикстуры только для визуального сравнения: меню и обработчики здесь не подключены. Для взаимодействия используйте Default или Long Label.",
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap gap-[var(--space-24)]">
      {(["default", "hover", "open"] as const).map((state) => (
        <div
          key={state}
          className="grid justify-items-start gap-[var(--space-8)]"
        >
          <FilterButton
            aria-hidden="true"
            tabIndex={-1}
            className="pointer-events-none"
            data-filter-state={state}
            text="Владелец: все"
            open={state === "open"}
          />
          <span className="text-muted-foreground [font:var(--type-mono)]">
            {state}
          </span>
        </div>
      ))}
    </div>
  ),
};
