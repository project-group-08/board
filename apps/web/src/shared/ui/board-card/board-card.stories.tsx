import type { Meta, StoryObj } from "@storybook/react";
import { MoreHorizontal } from "lucide-react";

import { BoardCard } from ".";
import { IconButton } from "../icon-button";
import { Menu, MenuContent, MenuItem, MenuTrigger } from "../menu";

const meta = {
  title: "UI/Board Card",
  component: BoardCard,
  args: { href: "#board", title: "Проектная доска", meta: "Изменена сегодня" },
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        component:
          "Визуальная карточка занимает доступную ширину. href, title и готовые meta задаёт потребитель. preview — готовый неинтерактивный элемент; он должен сам заполнять область с пропорциями 252:152 и иметь подходящую семантику. Без preview показана нейтральная заглушка. menu — готовый элемент вне ссылки: его действия, открытие и оформление открытого состояния принадлежат потребителю. При loading показываются только заглушки; ссылка и меню отсутствуют. Длинный текст переносится. Тема выбирается общей кнопкой Theme.",
      },
    },
  },
} satisfies Meta<typeof BoardCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const preview = (
  <div
    aria-hidden="true"
    className="h-full w-full bg-[linear-gradient(135deg,var(--color-muted),var(--color-dot))]"
  />
);

function CardMenu({ open = false }: { open?: boolean }) {
  return (
    <Menu defaultOpen={open}>
      <MenuTrigger
        render={
          <IconButton
            aria-label="Действия с доской"
            className="data-[popup-open]:bg-muted-hover"
          >
            <MoreHorizontal strokeWidth={1.5} />
          </IconButton>
        }
      />
      <MenuContent>
        <MenuItem>Переименовать</MenuItem>
        <MenuItem>Переместить</MenuItem>
      </MenuContent>
    </Menu>
  );
}

const cardProps = {
  href: "#board",
  title: "Проектная доска",
  meta: "Изменена сегодня",
  preview,
};

export const Default: Story = {
  render: () => (
    <div className="w-[268px] max-w-full">
      <BoardCard {...cardProps} menu={<CardMenu />} />
    </div>
  ),
};

export const Hover: Story = {
  parameters: { pseudo: { hover: '[data-story="hover"] > div' } },
  render: () => (
    <div data-story="hover" className="w-[268px] max-w-full">
      <BoardCard {...cardProps} menu={<CardMenu />} />
    </div>
  ),
};

export const Focus: Story = {
  render: () => (
    <div className="w-[268px] max-w-full">
      <BoardCard {...cardProps} menu={<CardMenu />} />
    </div>
  ),
  play: ({ canvasElement }) => {
    canvasElement.querySelector("a")?.focus();
  },
};

export const MenuOpen: Story = {
  render: () => (
    <div className="w-[268px] max-w-full">
      <BoardCard {...cardProps} menu={<CardMenu open />} />
    </div>
  ),
};

export const NoPreview: Story = {
  render: () => (
    <div className="w-[268px] max-w-full">
      <BoardCard
        href={cardProps.href}
        title={cardProps.title}
        meta={cardProps.meta}
        menu={<CardMenu />}
      />
    </div>
  ),
};

export const Loading: Story = {
  render: () => (
    <div className="w-[268px] max-w-full">
      <BoardCard loading />
    </div>
  ),
};

export const NarrowContainer: Story = {
  render: () => (
    <div className="w-[160px] max-w-full">
      <BoardCard
        {...cardProps}
        title="ОченьДлинноеНазваниеДоскиБезПробелов и описание проекта"
        meta="Изменена участником с очень длинным именем"
        menu={<CardMenu />}
      />
    </div>
  ),
};
