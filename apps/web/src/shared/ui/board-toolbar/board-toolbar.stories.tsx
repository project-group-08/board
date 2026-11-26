import type { Meta, StoryObj } from "@storybook/react";
import {
  ArrowUpRight,
  Circle,
  Eraser,
  Hand,
  Image,
  MessageCircle,
  MousePointer2,
  Pencil,
  Pentagon,
  Square,
  StickyNote,
  Type,
  AudioLines,
} from "lucide-react";
import type { ReactNode } from "react";
import { fn } from "storybook/test";

import { BoardToolbar, BoardToolbarViewLabel } from ".";
import { MenuItem } from "../menu";
import { Separator } from "../separator";
import { ToolButton } from "../tool-button";
import { ToolGroup } from "../tool-group";

const actions = {
  pointer: fn().mockName("Указатель"),
  hand: fn().mockName("Рука"),
  sticky: fn().mockName("Стикер"),
  shape: fn().mockName("Фигуры"),
  rectangle: fn().mockName("Прямоугольник"),
  ellipse: fn().mockName("Эллипс"),
  polygon: fn().mockName("Многоугольник"),
  text: fn().mockName("Текст"),
  arrow: fn().mockName("Стрелка"),
  drawing: fn().mockName("Рисование"),
  pencil: fn().mockName("Карандаш"),
  eraser: fn().mockName("Ластик"),
  media: fn().mockName("Медиа"),
  image: fn().mockName("Изображение"),
  audio: fn().mockName("Аудио"),
  comment: fn().mockName("Комментарий"),
};

const iconProps = { size: 16, strokeWidth: 1.5 };

function Divider() {
  return <Separator orientation="vertical" decorative />;
}

function Example({ view = false }: { view?: boolean }) {
  const group = (
    label: string,
    icon: ReactNode,
    onSelect: () => void,
    children: ReactNode,
    disabled = false,
    selected = false,
    menuWidth?: number,
  ) => (
    <ToolGroup
      label={label}
      menuLabel={`Меню: ${label}`}
      icon={icon}
      onSelect={onSelect}
      selected={selected}
      disabled={disabled}
      menuWidth={menuWidth}
    >
      {children}
    </ToolGroup>
  );

  return (
    <BoardToolbar aria-label="Инструменты доски">
      {group(
        "Указатель",
        <MousePointer2 {...iconProps} />,
        actions.pointer,
        <>
          <MenuItem
            icon={<MousePointer2 {...iconProps} />}
            shortcut="V"
            onClick={actions.pointer}
          >
            Указатель
          </MenuItem>
          <MenuItem
            icon={<Hand {...iconProps} />}
            shortcut="H"
            onClick={actions.hand}
          >
            Рука
          </MenuItem>
        </>,
        false,
        true,
      )}
      <Divider />
      <ToolButton aria-label="Стикер" disabled={view} onClick={actions.sticky}>
        <StickyNote {...iconProps} />
      </ToolButton>
      {group(
        "Фигуры",
        <Square {...iconProps} />,
        actions.shape,
        <>
          <MenuItem
            icon={<Square {...iconProps} />}
            shortcut="R"
            onClick={actions.rectangle}
          >
            Прямоугольник
          </MenuItem>
          <MenuItem
            icon={<Circle {...iconProps} />}
            shortcut="O"
            onClick={actions.ellipse}
          >
            Эллипс
          </MenuItem>
          <MenuItem
            icon={<Pentagon {...iconProps} />}
            onClick={actions.polygon}
          >
            Многоугольник
          </MenuItem>
        </>,
        view,
        false,
        216,
      )}
      <ToolButton aria-label="Текст" disabled={view} onClick={actions.text}>
        <Type {...iconProps} />
      </ToolButton>
      <ToolButton aria-label="Стрелка" disabled={view} onClick={actions.arrow}>
        <ArrowUpRight {...iconProps} />
      </ToolButton>
      {group(
        "Рисование",
        <Pencil {...iconProps} />,
        actions.drawing,
        <>
          <MenuItem
            icon={<Pencil {...iconProps} />}
            shortcut="Shift P"
            onClick={actions.pencil}
          >
            Карандаш
          </MenuItem>
          <MenuItem
            icon={<Eraser {...iconProps} />}
            shortcut="Shift E"
            onClick={actions.eraser}
          >
            Ластик
          </MenuItem>
        </>,
        view,
      )}
      {group(
        "Медиа",
        <Image {...iconProps} />,
        actions.media,
        <>
          <MenuItem
            icon={<Image {...iconProps} />}
            shortcut="Ctrl Shift K"
            onClick={actions.image}
          >
            Изображение
          </MenuItem>
          <MenuItem
            icon={<AudioLines {...iconProps} />}
            onClick={actions.audio}
          >
            Аудио
          </MenuItem>
        </>,
        view,
        false,
        264,
      )}
      <Divider />
      <ToolButton aria-label="Комментарий" onClick={actions.comment}>
        <MessageCircle {...iconProps} />
      </ToolButton>
      {view && (
        <>
          <Divider />
          <BoardToolbarViewLabel />
        </>
      )}
    </BoardToolbar>
  );
}

const meta = {
  title: "UI/Board Toolbar",
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        component:
          "Визуальная оболочка без логики доски. Тема переключается общей кнопкой Theme. Кнопки и пункты меню демонстрируют Actions; выбор инструмента не меняется. Открытые меню не являются подтверждённым состоянием панели в SVG.",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Edit: Story = {
  render: () => <Example />,
};

export const View: Story = {
  render: () => <Example view />,
};

export const Narrow: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Контейнер 320 px: перенос элементов — допущение, мобильный макет отсутствует. Доступность задаёт пример, а не оболочка.",
      },
    },
  },
  render: () => (
    <div className="w-[320px] max-w-full">
      <Example view />
    </div>
  ),
};
