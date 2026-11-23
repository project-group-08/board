import type { Meta, StoryObj } from "@storybook/react";
import { Ellipsis } from "lucide-react";
import { fn } from "storybook/test";

import { MemberRow } from ".";
import { Badge } from "../badge";
import { Button } from "../button";
import { IconButton } from "../icon-button";

const onAction = fn();
const member = {
  name: "Никита",
  email: "nikita@company.ru",
  avatarFallback: "Н",
};
const narrowName = "ОченьДлинноеИмяБезПробелов".repeat(5);
const actionFor = (name: string) => (
  <IconButton aria-label={`Действия участника ${name}`} onClick={onAction}>
    <Ellipsis />
  </IconButton>
);

const meta = {
  title: "UI/Member Row",
  component: MemberRow,
  args: { ...member, action: actionFor(member.name) },
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        component:
          "Строка не интерактивна целиком. Потребитель передаёт имя, email, данные аватара, готовый бейдж, роль и действие, определяет их сочетания и обеспечивает доступные имена и фокус вложенных элементов. pending приглушает только имя и аватар; он не отключает действия. Имя и email ограничены двумя строками визуально, полный текст остаётся в DOM. Длинная роль переносится; передаваемые элементы должны помещаться в свои ячейки. Тема выбирается общим переключателем Theme. Предварительно: при ширине контейнера от 720 px колонки — minmax(0,1fr) 200px 32px с gap 16px и горизонтальными отступами 16px; ниже данные участника остаются рядом с аватаром, роль и действие переходят вниз. Одинаковая ширина контейнеров обеспечивает выравнивание строк; будущему заголовку нужны те же сетка, отступы и порог. Семантику списка или таблицы и связь с заголовком определяет потребитель.",
      },
    },
  },
} satisfies Meta<typeof MemberRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Member: Story = {
  render: (args) => (
    <div className="w-[1120px] max-w-full">
      <MemberRow {...args} />
    </div>
  ),
};

export const You: Story = {
  args: { identityBadge: <Badge variant="accent">Вы</Badge> },
  render: Member.render,
};

export const Owner: Story = {
  args: { roleContent: "Владелец", action: undefined },
  render: Member.render,
};

export const Pending: Story = {
  args: {
    pending: true,
    identityBadge: <Badge variant="outline">Приглашён</Badge>,
  },
  render: Member.render,
};

export const Hover: Story = {
  parameters: {
    pseudo: { hover: '[data-example="hover"] [data-slot="member-row"]' },
  },
  render: (args) => (
    <div data-example="hover" className="w-[1120px] max-w-full">
      <MemberRow {...args} />
    </div>
  ),
};

export const MultipleRows: Story = {
  render: () => (
    <div className="w-[1120px] max-w-full">
      <MemberRow {...member} roleContent="Владелец" />
      <MemberRow
        name="Александра"
        email="alexandra@example.com"
        avatarFallback="А"
        identityBadge={<Badge variant="accent">Вы</Badge>}
        roleContent="Редактор"
        action={actionFor("Александра")}
      />
      <MemberRow
        {...member}
        pending
        identityBadge={<Badge variant="outline">Приглашён</Badge>}
        roleContent="Наблюдатель"
        action={actionFor(member.name)}
      />
    </div>
  ),
};

export const Narrow: Story = {
  render: () => (
    <div className="w-[240px] max-w-full">
      <MemberRow
        name={narrowName}
        email={`${"оченьдлиннаяпочта".repeat(5)}@example.com`}
        avatarFallback="О"
        identityBadge={<Badge variant="outline">Приглашён</Badge>}
        pending
        roleContent={
          <Button
            variant="ghost"
            size="small"
            className="h-auto max-w-full [overflow-wrap:anywhere] whitespace-normal"
            onClick={onAction}
            aria-label={`Изменить роль участника ${narrowName}`}
          >
            Изменить роль участника
          </Button>
        }
        action={actionFor(narrowName)}
      />
    </div>
  ),
};
