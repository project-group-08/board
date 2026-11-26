import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";

import { TrashRow } from ".";
import { Button } from "../button";

const onRestore = fn();
const action = (
  <Button variant="ghost" size="small" onClick={onRestore}>
    Восстановить
  </Button>
);

const meta = {
  title: "UI/Trash Row",
  component: TrashRow,
  args: {
    name: "Название доски",
    deletedBy: "Никита",
    deletedAt: "Сегодня в 10:24",
    restoreAction: action,
  },
  argTypes: { restoreAction: { control: false } },
  parameters: {
    docs: {
      description: {
        component:
          "Строка без собственной интерактивности: потребитель передаёт name, deletedBy, готовый текст deletedAt и restoreAction с доступным именем, состоянием и обработчиком. Заглушки для отсутствующих данных, форматирование и восстановление — у потребителя. Значения переносятся, включая слова без пробелов; высота растёт. Действие должно помещаться в контейнер и сохранять собственный фокус. Тема выбирается общим переключателем Theme. Предварительно: при ширине контейнера от 720 px сетка имеет колонки minmax(0,1fr) 200px 183px 128px и gap 16px; ниже — одна колонка с gap 8px. Одинаковая ширина контейнеров строк обеспечивает выравнивание; будущему заголовку нужны те же размеры, отступы и порог. Для списка потребитель определяет подходящую семантику и связь заголовков с полями: компонент не задаёт неподтверждённые table/grid роли.",
      },
    },
  },
} satisfies Meta<typeof TrashRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="w-[1120px] max-w-full">
      <TrashRow {...args} />
    </div>
  ),
};

export const Hover: Story = {
  parameters: {
    pseudo: { hover: '[data-example="hover"] [data-slot="trash-row"]' },
  },
  render: (args) => (
    <div data-example="hover" className="w-[1120px] max-w-full">
      <TrashRow {...args} />
    </div>
  ),
};

export const MultipleRows: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="w-[1120px] max-w-full">
      {(
        [
          ["Короткое название", "Анна", "Сегодня в 10:24"],
          [
            "Очень длинное название доски с описанием проекта и планов на следующий квартал",
            "ОченьДлинноеИмяПользователяБезПробеловОченьДлинноеИмя",
            "Вчера в 19:45 по местному времени",
          ],
          ["Доска", "Никита", "—"],
        ] as const
      ).map(([name, deletedBy, deletedAt]) => (
        <TrashRow
          key={name}
          name={name}
          deletedBy={deletedBy}
          deletedAt={deletedAt}
          restoreAction={
            <Button
              variant="ghost"
              size="small"
              aria-label={`Восстановить: ${name}`}
              onClick={onRestore}
            >
              Восстановить
            </Button>
          }
        />
      ))}
    </div>
  ),
};

export const Narrow: Story = {
  parameters: { controls: { disable: true } },
  render: (args) => (
    <div className="w-[240px] max-w-full">
      <TrashRow
        {...args}
        name="ОченьДлинноеНазваниеДоскиБезПробеловДляПроверкиПереноса"
        deletedBy="ОченьДлинноеИмяАвтораБезПробелов"
      />
    </div>
  ),
};
