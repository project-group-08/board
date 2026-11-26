"use client";

import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";
import type { ReactElement } from "react";

import { Kbd } from "../kbd";

export type TooltipProps = {
  children: ReactElement;
  label: string;
  shortcut?: string;
  side?: "top" | "bottom" | "left" | "right";
};

export const TooltipProvider = BaseTooltip.Provider;

export function Tooltip({
  children,
  label,
  shortcut,
  side = "top",
}: TooltipProps) {
  return (
    <BaseTooltip.Root>
      <BaseTooltip.Trigger render={children} />
      <BaseTooltip.Portal>
        <BaseTooltip.Positioner
          side={side}
          sideOffset={8}
          collisionPadding={8}
          className="max-w-[var(--available-width)]"
        >
          <BaseTooltip.Popup className="bg-inverse text-inverse-foreground box-border flex max-w-[min(320px,var(--available-width))] items-center gap-[var(--space-8)] rounded-[var(--radius-sm)] py-[6px] pr-[6px] pl-[var(--space-12)] [font:var(--type-caption)]">
            <span className="min-w-0 [overflow-wrap:anywhere]">{label}</span>
            {shortcut && (
              <Kbd
                variant="inverted"
                className="max-w-1/2 shrink-0 [overflow-wrap:anywhere]"
              >
                {shortcut}
              </Kbd>
            )}
          </BaseTooltip.Popup>
        </BaseTooltip.Positioner>
      </BaseTooltip.Portal>
    </BaseTooltip.Root>
  );
}
