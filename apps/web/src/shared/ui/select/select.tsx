"use client";

import { Select as BaseSelect } from "@base-ui/react/select";
import { clsx } from "clsx";
import { Check, ChevronDown } from "lucide-react";
import * as React from "react";
import { twMerge } from "tailwind-merge";

export type SelectOption = { value: string; label: string; disabled?: boolean };

export type SelectProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "value" | "defaultValue" | "onChange" | "children"
> & {
  items: SelectOption[];
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
};

export const Select = React.forwardRef<HTMLButtonElement, SelectProps>(
  function Select(
    {
      items,
      value,
      defaultValue,
      onValueChange,
      disabled,
      name,
      form,
      className,
      ...triggerProps
    },
    ref,
  ) {
    return (
      <BaseSelect.Root
        items={items}
        value={value}
        defaultValue={defaultValue}
        onValueChange={(nextValue) => onValueChange?.(nextValue)}
        disabled={disabled}
        name={name}
        form={form}
        modal={false}
      >
        <BaseSelect.Trigger
          {...triggerProps}
          ref={ref}
          form={form}
          className={twMerge(
            clsx(
              "border-border bg-background text-foreground hover:not-disabled:not-focus:bg-muted focus:border-accent data-[popup-open]:border-accent data-[popup-open]:bg-background aria-[invalid=true]:border-destructive aria-[invalid=true]:focus:border-destructive aria-[invalid=true]:data-[popup-open]:border-destructive disabled:bg-muted box-border flex h-[38px] w-full min-w-0 items-center justify-between gap-[8px] rounded-[var(--radius-md)] border px-[12px] text-left font-sans text-[14px]/[20px] font-normal focus:shadow-[var(--shadow-focus)] focus:outline-2 focus:outline-transparent disabled:cursor-not-allowed disabled:opacity-50 data-[popup-open]:shadow-[var(--shadow-focus)]",
              className,
            ),
          )}
        >
          <BaseSelect.Value className="min-w-0 truncate" />
          <BaseSelect.Icon className="text-muted-foreground shrink-0">
            <ChevronDown size={16} strokeWidth={2.25} aria-hidden="true" />
          </BaseSelect.Icon>
        </BaseSelect.Trigger>
        <BaseSelect.Portal>
          <BaseSelect.Positioner
            align="start"
            sideOffset={4}
            alignItemWithTrigger={false}
            className="z-50 w-[var(--anchor-width)] outline-none"
          >
            <BaseSelect.Popup className="border-border bg-background text-foreground box-border max-h-[var(--available-height)] w-full overflow-y-auto rounded-[var(--radius-md)] border p-[4px] shadow-[var(--shadow-floating)] outline-none">
              <BaseSelect.List className="flex flex-col gap-[2px]">
                {items.map((item) => (
                  <BaseSelect.Item
                    key={item.value}
                    value={item.value}
                    disabled={item.disabled}
                    className="data-[highlighted]:bg-muted flex h-[32px] min-w-0 cursor-default items-center gap-[8px] rounded-[var(--radius-sm)] px-[8px] font-sans text-[14px]/[20px] font-normal outline-none select-none data-[disabled]:opacity-50"
                  >
                    <BaseSelect.ItemText className="min-w-0 flex-1 truncate">
                      {item.label}
                    </BaseSelect.ItemText>
                    <BaseSelect.ItemIndicator className="shrink-0">
                      <Check size={16} strokeWidth={2.25} aria-hidden="true" />
                    </BaseSelect.ItemIndicator>
                  </BaseSelect.Item>
                ))}
              </BaseSelect.List>
            </BaseSelect.Popup>
          </BaseSelect.Positioner>
        </BaseSelect.Portal>
      </BaseSelect.Root>
    );
  },
);
