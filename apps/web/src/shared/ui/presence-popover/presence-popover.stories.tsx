import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { action } from "storybook/actions";

import { PresencePopover } from ".";
import type { PresenceParticipant } from ".";
import { Button } from "../button";

const participants: PresenceParticipant[] = [
  {
    id: "1",
    name: "Никита",
    role: "Владелец",
    avatarFallback: "Н",
    isCurrentUser: true,
    color: "var(--color-accent)",
    selectable: false,
  },
  {
    id: "2",
    name: "Андрей",
    role: "Редактор",
    avatarFallback: "А",
    isCurrentUser: false,
    color: "var(--color-foreground)",
    selectable: true,
  },
  {
    id: "3",
    name: "Екатерина",
    role: "Редактор",
    avatarFallback: "Е",
    isCurrentUser: false,
    color: "var(--color-success)",
    selectable: true,
  },
];

function Example({
  long = false,
  members = participants,
}: {
  long?: boolean;
  members?: PresenceParticipant[];
}) {
  const [open, setOpen] = useState(false);
  const items = long
    ? Array.from({ length: 15 }, (_, index) => ({
        ...participants[1]!,
        id: String(index),
        name: `Участник ${index + 1} с очень длинным именем без ограничений`,
      }))
    : members;
  return (
    <div className="min-h-[400px] p-[24px]">
      <PresencePopover
        trigger={<Button>Участники</Button>}
        open={open}
        onOpenChange={(next) => {
          action("onOpenChange")(next);
          setOpen(next);
        }}
        participants={items}
        onParticipantSelect={action("onParticipantSelect")}
        labels={{
          title: `На доске сейчас ${items.length}`,
          currentUser: "Вы",
          hint: "Нажмите на имя, чтобы перейти к курсору",
        }}
      />
    </div>
  );
}

const meta = {
  title: "UI/Presence Popover",
  component: Example,
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        component:
          "Откройте панель кнопкой; тему переключайте общим Theme. События видны в Actions. Доступность выбора задаёт потребитель; выбор не закрывает панель. Допущения вне SVG: длинный текст переносится, а панель ограничена доступной шириной и высотой и прокручивается. Trigger должен передавать props и ref на интерактивный DOM-элемент.",
      },
    },
  },
} satisfies Meta<typeof Example>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = { render: () => <Example /> };
export const LongContent: Story = { render: () => <Example long /> };
export const Empty: Story = { render: () => <Example members={[]} /> };
export const NoneSelectable: Story = {
  render: () => (
    <Example
      members={participants.map((member) => ({ ...member, selectable: false }))}
    />
  ),
};
