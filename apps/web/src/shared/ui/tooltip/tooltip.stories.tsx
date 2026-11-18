import type { Meta, StoryObj } from "@storybook/react";
import { MousePointer2, ZoomIn } from "lucide-react";

import { Tooltip, TooltipProvider } from ".";
import { Button } from "../button";
import { IconButton } from "../icon-button";

const meta = {
  title: "UI/Tooltip",
  component: Tooltip,
  args: {
    label: "Выбрать инструмент",
    shortcut: "T",
    children: (
      <IconButton aria-label="Выбрать инструмент">
        <MousePointer2 />
      </IconButton>
    ),
  },
  argTypes: {
    children: { control: false },
    side: { control: "select", options: ["top", "bottom", "left", "right"] },
  },
  decorators: [
    (Story) => (
      <TooltipProvider>
        <Story />
      </TooltipProvider>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          "Tooltip показывает дополнительную визуальную подсказку для одного триггера с собственным доступным именем. Используйте общий TooltipProvider для группировки соседних подсказок. Hover открывает подсказку через 600 мс, фокус клавиатуры — без задержки; Escape закрывает её. По умолчанию подсказка располагается сверху с зазором 8 px; она автоматически подстраивается у границ. Максимальная ширина — 320 px с учётом доступного места, длинный текст переносится. Высота строки 20 px — согласованное предположение, поскольку SVG её не задаёт. Tooltip не заменяет доступное имя или важное описание и не гарантирует aria-describedby. Base UI отключает Tooltip при touch; нативные disabled-кнопки не получают клавиатурный фокус, поэтому важные сведения следует показывать отдельно.",
      },
    },
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div className="p-[var(--space-64)]">
      <Tooltip {...args} />
    </div>
  ),
};

export const Interaction: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-[var(--space-24)] p-[var(--space-64)]">
      <Tooltip label="Выбрать инструмент" shortcut="T">
        <IconButton aria-label="Выбрать инструмент">
          <MousePointer2 />
        </IconButton>
      </Tooltip>
      <Tooltip label="Увеличить масштаб" shortcut="Ctrl + +">
        <IconButton aria-label="Увеличить масштаб">
          <ZoomIn />
        </IconButton>
      </Tooltip>
      <Tooltip label="Сохранить изменения" side="bottom">
        <Button>Сохранить</Button>
      </Tooltip>
    </div>
  ),
};

export const ViewportEdges: Story = {
  render: () => (
    <div className="fixed inset-[8px] flex items-start justify-between">
      <Tooltip
        label="Длинное название инструмента для совместной работы и редактирования содержимого доски"
        shortcut="Ctrl + Shift + K"
      >
        <IconButton aria-label="Инструмент слева">
          <MousePointer2 />
        </IconButton>
      </Tooltip>
      <Tooltip
        label="ОченьДлинноеНазваниеБезПробеловДляПроверкиПереноса"
        shortcut="Ctrl + Shift + Alt + K"
      >
        <IconButton aria-label="Инструмент справа">
          <ZoomIn />
        </IconButton>
      </Tooltip>
    </div>
  ),
};
