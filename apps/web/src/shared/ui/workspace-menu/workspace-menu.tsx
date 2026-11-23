"use client";

import { Menu as BaseMenu } from "@base-ui/react/menu";
import { Check, Plus } from "lucide-react";
import { useId } from "react";
import type { ReactElement } from "react";

import {
  Menu,
  MenuContent,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
} from "../menu";
import { WorkspaceMark } from "../workspace-mark";

export type WorkspaceMenuEntry = {
  id: string;
  name: string;
  meta: string;
  markFallback: string;
  markSrc?: string;
};

export type WorkspaceMenuProps = {
  trigger: ReactElement;
  items: readonly WorkspaceMenuEntry[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onCreate: () => void;
  label?: string;
  createLabel?: string;
};

export function WorkspaceMenu({
  trigger,
  items,
  selectedId,
  onSelect,
  onCreate,
  label = "Пространства",
  createLabel = "Создать пространство",
}: WorkspaceMenuProps) {
  const id = useId();
  return (
    <Menu>
      <MenuTrigger render={trigger} />
      <MenuContent className="w-[240px]">
        <BaseMenu.RadioGroup
          value={selectedId}
          onValueChange={(id: string) => onSelect(id)}
        >
          <BaseMenu.GroupLabel className="text-muted-foreground px-[var(--space-8)] py-[var(--space-4)] [font:var(--type-caption)]">
            {label}
          </BaseMenu.GroupLabel>
          {items.map((item, index) => (
            <BaseMenu.RadioItem
              key={item.id}
              value={item.id}
              label={item.name}
              aria-labelledby={`${id}-name-${index} ${id}-meta-${index}`}
              closeOnClick
              className="text-foreground data-[highlighted]:bg-muted box-border flex min-h-[52px] min-w-0 cursor-default items-center gap-[var(--space-8)] rounded-[var(--radius-sm)] px-[var(--space-8)] py-[6px] text-left outline-none select-none"
            >
              <div aria-hidden="true" className="shrink-0">
                <WorkspaceMark
                  name={item.name}
                  fallback={item.markFallback}
                  src={item.markSrc}
                />
              </div>
              <span className="flex min-w-0 flex-1 flex-col [overflow-wrap:anywhere]">
                <span
                  id={`${id}-name-${index}`}
                  className="[font:var(--type-label)]"
                >
                  {item.name}
                </span>
                <span
                  id={`${id}-meta-${index}`}
                  className="text-muted-foreground [font:var(--type-caption)]"
                >
                  {item.meta}
                </span>
              </span>
              <span
                aria-hidden="true"
                className="inline-flex size-[16px] shrink-0"
              >
                <BaseMenu.RadioItemIndicator>
                  <Check size={16} strokeWidth={1.5} />
                </BaseMenu.RadioItemIndicator>
              </span>
            </BaseMenu.RadioItem>
          ))}
        </BaseMenu.RadioGroup>
        <MenuSeparator />
        <MenuItem
          onClick={onCreate}
          className="min-h-[48px] gap-[var(--space-8)] [font:var(--type-label)]"
        >
          <span className="flex min-w-0 items-center gap-[var(--space-8)]">
            <span
              aria-hidden="true"
              className="border-border text-muted-foreground inline-flex size-[32px] shrink-0 items-center justify-center rounded-[var(--radius-sm)] border border-dashed"
            >
              <Plus size={16} strokeWidth={1.5} />
            </span>
            <span className="min-w-0 [overflow-wrap:anywhere]">
              {createLabel}
            </span>
          </span>
        </MenuItem>
      </MenuContent>
    </Menu>
  );
}
