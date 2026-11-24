"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import type { ReactNode } from "react";

import { Menu, MenuContent, MenuTrigger } from "../menu";
import { ToolButton } from "../tool-button";

export type ToolGroupProps = {
  label: string;
  menuLabel: string;
  icon: ReactNode;
  children: ReactNode;
  selected?: boolean;
  disabled?: boolean;
  menuWidth?: number;
  onSelect: () => void;
};

export function ToolGroup({
  label,
  menuLabel,
  icon,
  children,
  selected = false,
  disabled = false,
  menuWidth,
  onSelect,
}: ToolGroupProps) {
  const [open, setOpen] = useState(false);

  // Повторное включение не должно открывать прежнее меню.
  if (disabled && open) {
    setOpen(false);
  }

  return (
    <Menu open={open && !disabled} onOpenChange={setOpen}>
      <div className="inline-flex items-center">
        <ToolButton
          aria-label={label}
          selected={selected}
          disabled={disabled}
          onClick={onSelect}
          className={`${open && !disabled && !selected ? "bg-muted" : ""} disabled:opacity-40`}
        >
          {icon}
        </ToolButton>
        <MenuTrigger
          disabled={disabled}
          aria-label={menuLabel}
          className="text-muted-foreground hover:not-disabled:bg-muted data-[popup-open]:bg-muted relative inline-flex h-[36px] w-[24px] cursor-pointer items-center justify-center rounded-[var(--radius-sm)] border-0 bg-transparent p-0 focus-visible:z-10 focus-visible:shadow-[var(--shadow-focus)] focus-visible:outline-2 focus-visible:outline-transparent disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronDown aria-hidden="true" size={16} strokeWidth={2.25} />
        </MenuTrigger>
      </div>
      <MenuContent
        finalFocus={disabled ? false : undefined}
        style={menuWidth === undefined ? undefined : { width: menuWidth }}
      >
        {children}
      </MenuContent>
    </Menu>
  );
}
