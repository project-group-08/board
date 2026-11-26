"use client";

import { Popover } from "@base-ui/react/popover";
import type { ReactElement } from "react";

import { Avatar } from "../avatar";
import { Badge } from "../badge";

export type PresenceParticipant = {
  id: string;
  name: string;
  role: string;
  avatarFallback: string;
  avatarSrc?: string;
  isCurrentUser: boolean;
  color: string;
  selectable: boolean;
};

export type PresencePopoverProps = {
  trigger: ReactElement;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  participants: PresenceParticipant[];
  onParticipantSelect: (id: string) => void;
  labels: {
    title: string;
    currentUser: string;
    hint: string;
  };
};

export function PresencePopover({
  trigger,
  open,
  onOpenChange,
  participants,
  onParticipantSelect,
  labels,
}: PresencePopoverProps) {
  return (
    <Popover.Root
      open={open}
      onOpenChange={(next) => onOpenChange(next)}
      modal={false}
    >
      <Popover.Trigger render={trigger} />
      <Popover.Portal>
        <Popover.Positioner
          side="bottom"
          align="end"
          sideOffset={8}
          collisionPadding={8}
          className="z-50 w-[280px] max-w-[var(--available-width)] outline-none"
        >
          <Popover.Popup className="border-border bg-background text-foreground box-border flex max-h-[var(--available-height)] min-w-0 flex-col overflow-y-auto rounded-[var(--radius-md)] border p-[4px] shadow-[var(--shadow-floating)] outline-none focus-visible:shadow-[var(--shadow-focus)] focus-visible:outline-2 focus-visible:outline-transparent">
            <Popover.Title className="text-muted-foreground px-[8px] pt-[8px] pb-[12px] [overflow-wrap:anywhere] [font:var(--type-caption)]">
              {labels.title}
            </Popover.Title>
            <ul className="flex min-w-0 list-none flex-col gap-[2px] p-0">
              {participants.map((participant) => (
                <li key={participant.id} className="min-w-0">
                  <button
                    type="button"
                    disabled={!participant.selectable}
                    onClick={() => onParticipantSelect(participant.id)}
                    className="enabled:hover:bg-muted flex min-h-[52px] w-full min-w-0 items-center gap-[10px] rounded-[var(--radius-sm)] px-[8px] py-[6px] text-left focus-visible:shadow-[inset_0_0_0_2px_var(--color-ring)] focus-visible:outline-none enabled:cursor-pointer"
                  >
                    <span aria-hidden="true">
                      <Avatar
                        name={participant.name}
                        fallback={participant.avatarFallback}
                        src={participant.avatarSrc}
                      />
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="flex min-w-0 flex-wrap items-center gap-x-[8px]">
                        <span className="min-w-0 [overflow-wrap:anywhere] [font:var(--type-label)]">
                          {participant.name}
                        </span>
                        {participant.isCurrentUser && (
                          <Badge variant="accent">{labels.currentUser}</Badge>
                        )}
                      </span>
                      <span className="text-muted-foreground min-w-0 [overflow-wrap:anywhere] [font:var(--type-caption)]">
                        {participant.role}
                      </span>
                    </span>
                    <span
                      aria-hidden="true"
                      className="size-[8px] shrink-0 rounded-full"
                      style={{ backgroundColor: participant.color }}
                    />
                  </button>
                </li>
              ))}
            </ul>
            <p className="text-muted-foreground px-[8px] pt-[12px] pb-[8px] [overflow-wrap:anywhere] [font:var(--type-caption)]">
              {labels.hint}
            </p>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
