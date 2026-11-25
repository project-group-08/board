import type { Meta, StoryObj } from "@storybook/react";
import {
  AlignLeft,
  Bold,
  Bot,
  Ellipsis,
  Group as GroupIcon,
  Italic,
  MessageCircle,
  Ungroup,
} from "lucide-react";
import { fn } from "storybook/test";

import { ColorSwatchButton, CompactValueButton, SelectionToolbar } from ".";
import { Button } from "../button";
import { IconButton } from "../icon-button";
import { Separator } from "../separator";

const defaultActions = {
  firstColor: fn().mockName("Первый цвет"),
  secondColor: fn().mockName("Второй цвет"),
  size: fn().mockName("Значение 14"),
  bold: fn().mockName("B"),
  italic: fn().mockName("I"),
  alignment: fn().mockName("Выравнивание"),
  robot: fn().mockName("Значок робота"),
  comment: fn().mockName("Комментарий"),
  more: fn().mockName("Дополнительно"),
  group: fn().mockName("Сгруппировать"),
  ungroup: fn().mockName("Разгруппировать"),
};

const iconProps = { size: 16, strokeWidth: 1.5 };

function Divider() {
  return <Separator orientation="vertical" decorative />;
}

function TextControls({ actions }: { actions: typeof defaultActions }) {
  return (
    <>
      <CompactValueButton
        aria-label="Размер: 14"
        value="14"
        onClick={actions.size}
      />
      <IconButton
        aria-label="Полужирный"
        onClick={actions.bold}
        className="shrink-0"
      >
        <Bold {...iconProps} />
      </IconButton>
      <IconButton
        aria-label="Курсив"
        onClick={actions.italic}
        className="shrink-0"
      >
        <Italic {...iconProps} />
      </IconButton>
      <IconButton
        aria-label="Выравнивание"
        onClick={actions.alignment}
        className="shrink-0"
      >
        <AlignLeft {...iconProps} />
      </IconButton>
    </>
  );
}

function Robot({ actions }: { actions: typeof defaultActions }) {
  return (
    <IconButton
      aria-label="Действие со значком робота"
      onClick={actions.robot}
      className="shrink-0"
    >
      <Bot {...iconProps} />
    </IconButton>
  );
}

function More({ actions }: { actions: typeof defaultActions }) {
  return (
    <IconButton
      aria-label="Дополнительно"
      onClick={actions.more}
      className="text-foreground shrink-0"
    >
      <Ellipsis {...iconProps} />
    </IconButton>
  );
}

function Example({
  variant,
  actions,
}: {
  variant: "shape" | "text" | "sticky" | "multiple" | "group";
  actions: typeof defaultActions;
}) {
  const isText =
    variant === "shape" || variant === "text" || variant === "sticky";
  return (
    <SelectionToolbar aria-label={`Панель: ${variant}`}>
      {variant === "multiple" && (
        <>
          <Button
            variant="ghost"
            size="small"
            leadingIcon={<GroupIcon {...iconProps} />}
            onClick={actions.group}
          >
            Сгруппировать
          </Button>
          <Divider />
        </>
      )}
      {variant === "group" && (
        <>
          <Button
            variant="ghost"
            size="small"
            leadingIcon={<Ungroup {...iconProps} />}
            onClick={actions.ungroup}
          >
            Разгруппировать
          </Button>
          <Divider />
        </>
      )}
      {variant !== "group" && (
        <>
          <ColorSwatchButton
            aria-label="Первый образец цвета"
            color={
              variant === "sticky" || variant === "multiple"
                ? "#FEF3C7"
                : variant === "shape"
                  ? "var(--color-background)"
                  : "var(--color-foreground)"
            }
            onClick={actions.firstColor}
          />
          {variant === "shape" && (
            <ColorSwatchButton
              aria-label="Второй образец цвета"
              color="var(--color-foreground)"
              onClick={actions.secondColor}
            />
          )}
          <Divider />
        </>
      )}
      {isText && (
        <>
          <TextControls actions={actions} />
          <Divider />
        </>
      )}
      {variant !== "text" && <Robot actions={actions} />}
      {variant === "shape" && (
        <IconButton
          aria-label="Комментарий"
          onClick={actions.comment}
          className="shrink-0"
        >
          <MessageCircle {...iconProps} />
        </IconButton>
      )}
      <More actions={actions} />
    </SelectionToolbar>
  );
}

const meta = {
  title: "UI/Selection Toolbar",
  args: defaultActions,
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        component:
          "Пять статичных составов по SVG; действия только записываются в Actions. Тема выбирается общим переключателем Theme. Точные области нажатия не показаны: используются кнопки 32 px. Иконки Lucide приближённые. Перенос элементов на узком экране — допущение: разделитель может оказаться в начале строки. Открытые меню, активные и смешанные состояния в SVG не показаны. Цвета и расположение задаёт потребитель.",
      },
    },
  },
} satisfies Meta<typeof defaultActions>;
export default meta;
type Story = StoryObj<typeof defaultActions>;

export const Shape: Story = {
  render: (args) => <Example variant="shape" actions={args} />,
};
export const Text: Story = {
  render: (args) => <Example variant="text" actions={args} />,
};
export const Sticky: Story = {
  render: (args) => <Example variant="sticky" actions={args} />,
};
export const Multiple: Story = {
  render: (args) => <Example variant="multiple" actions={args} />,
};
export const Group: Story = {
  render: (args) => <Example variant="group" actions={args} />,
};

export const Overview: Story = {
  render: (args) => (
    <div className="flex flex-col items-start gap-[16px]">
      <Example variant="shape" actions={args} />
      <Example variant="text" actions={args} />
      <Example variant="sticky" actions={args} />
      <Example variant="multiple" actions={args} />
      <Example variant="group" actions={args} />
    </div>
  ),
};

export const Narrow: Story = {
  render: (args) => (
    <div className="flex w-[200px] max-w-full flex-col items-start gap-[16px]">
      <Example variant="shape" actions={args} />
      <Example variant="text" actions={args} />
      <Example variant="sticky" actions={args} />
      <Example variant="multiple" actions={args} />
      <Example variant="group" actions={args} />
    </div>
  ),
};
