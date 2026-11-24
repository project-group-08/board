import type { Meta, StoryObj } from "@storybook/react";
import { ChevronRight, Download, Globe, Users } from "lucide-react";
import { useState } from "react";
import { action } from "storybook/actions";

import { SharePopover } from ".";
import { Avatar } from "../avatar";
import { Button } from "../button";
import { LinkAccessMenu } from "../link-access-menu";
import type { LinkAccessValue } from "../link-access-menu";

const labels = {
  title: "Поделиться доской",
  close: "Закрыть",
  copy: "Скопировать ссылку",
  copied: "Ссылка скопирована",
  inviteInput: "Адреса приглашённых",
  invitePlaceholder: "Почты через запятую",
  invite: "Пригласить",
  access: "Кто имеет доступ",
};
const accessLabels = {
  none: "Нет доступа",
  view: "могут смотреть",
  edit: "могут редактировать",
};
const logOpen = action("onOpenChange");
const logInput = action("onInviteValueChange");
const logAccess = action("onAccessChange");

function Example({
  initialCopied = false,
  long = false,
  inviteLabel = labels.invite,
}: {
  initialCopied?: boolean;
  long?: boolean;
  inviteLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(initialCopied);
  const [invite, setInvite] = useState("");
  const [access, setAccess] = useState<LinkAccessValue>("view");
  return (
    <div className="min-h-[520px] p-[24px]">
      <SharePopover
        trigger={<Button>Поделиться</Button>}
        open={open}
        onOpenChange={(next) => {
          logOpen(next);
          setOpen(next);
        }}
        copied={copied}
        onCopyLink={() => {
          action("onCopyLink")();
          setCopied(true);
        }}
        inviteValue={invite}
        onInviteValueChange={(next) => {
          logInput(next);
          setInvite(next);
        }}
        inviteDisabled={false}
        onInvite={action("onInvite")}
        labels={{ ...labels, invite: inviteLabel }}
        accessContent={
          <div className="flex min-w-0 flex-col gap-[12px]">
            <div className="flex min-w-0 flex-wrap items-center gap-[12px]">
              <span className="flex size-[32px] shrink-0 items-center justify-center">
                <Globe size={16} strokeWidth={1.5} />
              </span>
              <span className="min-w-[120px] flex-1 [overflow-wrap:anywhere] [font:var(--type-body-s)]">
                Все, у кого есть ссылка
              </span>
              <LinkAccessMenu
                trigger={
                  <Button
                    variant="ghost"
                    className="h-auto min-w-0 px-[6px] py-[6px] text-right font-normal whitespace-normal"
                    trailingIcon={<ChevronRight strokeWidth={1.5} />}
                  >
                    {accessLabels[access]}
                  </Button>
                }
                value={access}
                labels={accessLabels}
                onValueChange={(next) => {
                  logAccess(next);
                  setAccess(next);
                }}
              />
            </div>
            <div className="flex min-w-0 flex-wrap items-center gap-[12px] [font:var(--type-body-s)]">
              <span className="flex size-[32px] shrink-0 items-center justify-center">
                <Users size={16} strokeWidth={1.5} />
              </span>
              <span className="min-w-0 flex-1">Участники пространства · 8</span>
              <span>по ролям</span>
            </div>
            {(long
              ? Array.from({ length: 20 }, (_, i) => `Участник ${i + 1}`)
              : ["Андрей", "Никита"]
            ).map((name, i) => (
              <div
                key={name}
                className="flex min-w-0 flex-wrap items-center gap-[12px] [font:var(--type-body-s)]"
              >
                <Avatar name={name} fallback={name.charAt(0)} />
                <span className="min-w-[100px] flex-1 [overflow-wrap:anywhere]">
                  {name}
                  {!long && i === 1 && (
                    <span className="text-muted-foreground"> (вы)</span>
                  )}
                </span>
                <span
                  className={i === 1 && !long ? "text-muted-foreground" : ""}
                >
                  {i === 1 && !long ? "владелец" : "может редактировать"}
                </span>
              </div>
            ))}
          </div>
        }
        exportControl={
          <Button
            variant="ghost"
            onClick={action("exportControl")}
            leadingIcon={<Download strokeWidth={1.5} />}
            trailingIcon={<ChevronRight strokeWidth={1.5} />}
            className="h-[54px] w-full justify-start px-[20px] font-normal [&>span:last-child]:ml-auto"
          >
            Экспорт в изображение
          </Button>
        }
      />
    </div>
  );
}

const meta = {
  title: "UI/Share Popover",
  component: Example,
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        component:
          "Trigger должен быть интерактивной кнопкой, которая передаёт полученные props и ref на DOM-элемент; Button подходит. Откройте popover кнопкой, тему переключайте общим Theme. Копирование, данные и содержимое строк — пример потребителя; действия видны в Actions.",
      },
    },
  },
} satisfies Meta<typeof Example>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { render: () => <Example /> };
export const LinkCopied: Story = { render: () => <Example initialCopied /> };
export const LongContent: Story = { render: () => <Example long /> };
export const LongInviteLabel: Story = {
  render: () => (
    <Example inviteLabel="Пригласить всех выбранных участников пространства для совместной работы" />
  ),
};
