"use client";

import { Popover } from "@base-ui/react/popover";
import { Check, Link, X } from "lucide-react";
import type { FormEvent, ReactElement, ReactNode } from "react";

import { Button } from "../button";
import { IconButton } from "../icon-button";
import { Input } from "../input";

export type SharePopoverProps = {
  trigger: ReactElement;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  copied: boolean;
  onCopyLink: () => void;
  inviteValue: string;
  onInviteValueChange: (value: string) => void;
  onInvite: () => void;
  inviteDisabled?: boolean;
  accessContent: ReactNode;
  exportControl: ReactNode;
  labels: {
    title: string;
    close: string;
    copy: string;
    copied: string;
    inviteInput: string;
    invitePlaceholder: string;
    invite: string;
    access: string;
  };
};

export function SharePopover({
  trigger,
  open,
  onOpenChange,
  copied,
  onCopyLink,
  inviteValue,
  onInviteValueChange,
  onInvite,
  inviteDisabled = false,
  accessContent,
  exportControl,
  labels,
}: SharePopoverProps) {
  function submitInvite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    event.stopPropagation();
    if (!inviteDisabled) onInvite();
  }

  return (
    <Popover.Root open={open} onOpenChange={onOpenChange} modal={false}>
      <Popover.Trigger render={trigger} />
      <Popover.Portal>
        <Popover.Positioner
          side="bottom"
          align="end"
          sideOffset={8}
          collisionPadding={8}
          className="z-50 w-[440px] max-w-[var(--available-width)] outline-none"
        >
          <Popover.Popup className="flex max-h-[var(--available-height)] flex-col gap-[8px] overflow-y-auto outline-none">
            <div className="border-border bg-background text-foreground box-border flex min-w-0 flex-col gap-[20px] rounded-[var(--radius-lg)] border p-[20px] shadow-[var(--shadow-floating)]">
              <div className="flex min-w-0 flex-wrap items-center gap-[8px]">
                <Popover.Title className="min-w-[140px] flex-1 [overflow-wrap:anywhere] [font:var(--type-label)]">
                  {labels.title}
                </Popover.Title>
                <Button
                  variant="ghost"
                  onClick={onCopyLink}
                  leadingIcon={
                    copied ? (
                      <Check strokeWidth={1.5} />
                    ) : (
                      <Link strokeWidth={1.5} />
                    )
                  }
                  className="text-accent h-auto min-w-0 px-[6px] py-[6px] whitespace-normal"
                >
                  {copied ? labels.copied : labels.copy}
                </Button>
                <output className="sr-only">
                  {copied ? labels.copied : ""}
                </output>
                <Popover.Close
                  render={
                    <IconButton aria-label={labels.close}>
                      <X strokeWidth={1.5} />
                    </IconButton>
                  }
                />
              </div>
              <form
                onSubmit={submitInvite}
                className="flex min-w-0 flex-wrap gap-[8px]"
              >
                <Input
                  aria-label={labels.inviteInput}
                  placeholder={labels.invitePlaceholder}
                  value={inviteValue}
                  onChange={(event) => onInviteValueChange(event.target.value)}
                  className="min-w-[120px] flex-1"
                />
                <Button
                  type="submit"
                  variant="accent"
                  disabled={inviteDisabled}
                  className="h-auto min-h-[36px] max-w-full min-w-0 py-[7px] [overflow-wrap:anywhere] whitespace-normal"
                >
                  {labels.invite}
                </Button>
              </form>
              <section
                className="flex min-w-0 flex-col gap-[8px]"
                aria-label={labels.access}
              >
                <h3 className="text-muted-foreground [font:var(--type-caption)]">
                  {labels.access}
                </h3>
                {accessContent}
              </section>
            </div>
            <div className="border-border bg-background text-foreground box-border min-w-0 rounded-[var(--radius-lg)] border shadow-[var(--shadow-floating)]">
              {exportControl}
            </div>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
