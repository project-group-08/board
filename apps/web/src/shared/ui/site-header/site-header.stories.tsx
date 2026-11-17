import type { Meta, StoryObj } from "@storybook/react";
import { Moon } from "lucide-react";

import { SiteHeader } from ".";
import { buttonVariants } from "../button";
import { IconButton } from "../icon-button";
import { NavLink } from "../nav-link";

const meta = {
  title: "UI/Site Header",
  parameters: {
    docs: {
      description: {
        component:
          "Текущая версия рассчитана на достаточную десктопную ширину; адаптив и длинное содержимое пока не определены. Ссылки, их стили и действия передаются потребителем. Иконка темы в примере демонстрационная; переключение темы Storybook находится в панели инструментов.",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const focus =
  "focus-visible:outline-2 focus-visible:outline-transparent focus-visible:shadow-[var(--shadow-focus)]";

function Example() {
  const labels = ["Возможности", "ИИ", "Совместная работа", "Вопросы"];
  return (
    <SiteHeader
      navigationLabel="Основная навигация"
      brand={
        <a
          href="#brand"
          className={`text-foreground whitespace-nowrap [font:var(--type-heading-3)] ${focus}`}
        >
          [Название]
        </a>
      }
      navigation={
        <ul className="m-0 flex list-none items-center gap-[var(--space-24)] p-0">
          {labels.map((label, index) => (
            <li key={label}>
              <NavLink href={`#section-${index + 1}`}>{label}</NavLink>
            </li>
          ))}
        </ul>
      }
      themeAction={
        <IconButton
          aria-label="Переключить тему — пример"
          className="text-foreground size-[36px]"
        >
          <Moon strokeWidth={2.25} />
        </IconButton>
      }
      actions={
        <div className="flex items-center">
          <a
            href="#login"
            className={`text-foreground inline-flex h-[36px] items-center px-[var(--space-24)] [font:var(--type-label)] ${focus}`}
          >
            Войти
          </a>
          <a href="#start" className={buttonVariants({ variant: "accent" })}>
            Начать
          </a>
        </div>
      }
    />
  );
}

export const Desktop: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Для достаточной десктопной ширины. Адаптив и длинное содержимое пока не определены.",
      },
    },
  },
  render: () => (
    <div style={{ width: "min(100%, 1120px)" }}>
      <Example />
    </div>
  ),
};
