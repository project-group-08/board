import type { Meta, StoryObj } from "@storybook/react";
import { Moon } from "lucide-react";
import { twMerge } from "tailwind-merge";

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
          "До 1024 px показывается компактная шапка с панелью поверх страницы. Мобильное содержимое передаётся отдельными слотами. Тёмная панель предварительная: отдельного макета нет. Иконка темы демонстрационная; переключение темы Storybook находится в панели инструментов.",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const focus =
  "focus-visible:outline-2 focus-visible:outline-transparent focus-visible:shadow-[var(--shadow-focus)]";

function Example({ long = false }: { long?: boolean }) {
  const labels = ["Возможности", "ИИ", "Совместная работа", "Вопросы"];
  return (
    <SiteHeader
      navigationLabel="Основная навигация"
      mobileNavigation={
        <ul className="m-0 flex list-none flex-col gap-[var(--space-20)] p-0 [font:var(--type-title)]">
          {(long ? [...labels, ...labels, ...labels] : labels).map(
            (label, index) => (
              <li key={`${label}-${index}`}>
                <a href={`#section-${index + 1}`} className={focus}>
                  {label}
                </a>
              </li>
            ),
          )}
        </ul>
      }
      mobileActions={
        <div className="flex flex-col gap-[var(--space-8)]">
          <a
            href="#start"
            className={`${buttonVariants({ variant: "accent" })} h-[44px]`}
          >
            Начать
          </a>
          <a
            href="#login"
            className={twMerge(
              buttonVariants({ variant: "outline" }),
              "h-[44px]",
            )}
          >
            Войти
          </a>
        </div>
      }
      mobileThemeAction={
        <IconButton
          aria-label="Переключить тему — пример"
          className="text-foreground border-border size-[44px] rounded-full border"
        >
          <Moon strokeWidth={1.5} />
        </IconButton>
      }
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
        story: "Десктопная шапка показывается от 1024 px.",
      },
    },
  },
  render: () => (
    <div style={{ width: "min(100%, 1120px)" }}>
      <Example />
    </div>
  ),
};

export const Compact: Story = {
  globals: { viewport: { value: "mobile2", isRotated: false } },
  parameters: {
    docs: {
      description: {
        story:
          "Компактный режим зависит от ширины viewport, а не контейнера; здесь выбран мобильный viewport 414 px.",
      },
    },
  },
  render: () => (
    <div style={{ width: "min(100%, 366px)" }}>
      <Example />
    </div>
  ),
};

export const LongContent: Story = {
  globals: { viewport: { value: "mobile2", isRotated: false } },
  parameters: {
    docs: {
      description: {
        story:
          "Для длинного содержимого выбран мобильный viewport 414 px; компактный режим зависит от ширины viewport.",
      },
    },
  },
  render: () => (
    <div style={{ width: "min(100%, 366px)" }}>
      <Example long />
    </div>
  ),
};
