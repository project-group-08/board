import { clsx } from "clsx";
import { ChevronDown } from "lucide-react";
import * as React from "react";
import { twMerge } from "tailwind-merge";

import { IconButton, type IconButtonProps } from "../icon-button";

export type SelectionToolbarProps =
  React.FieldsetHTMLAttributes<HTMLFieldSetElement> & {
    "aria-label": string;
  };

export const SelectionToolbar = React.forwardRef<
  HTMLFieldSetElement,
  SelectionToolbarProps
>(function SelectionToolbar({ children, className, ...props }, ref) {
  return (
    <fieldset
      {...props}
      ref={ref}
      className={twMerge(
        clsx(
          "border-border bg-background text-foreground m-0 box-border inline-block max-w-full min-w-0 rounded-[var(--radius-md)] border p-[4px] shadow-[var(--shadow-floating)]",
          className,
        ),
      )}
    >
      <div className="flex min-w-0 flex-wrap items-center gap-[2px]">
        {children}
      </div>
    </fieldset>
  );
});

type WithoutChildren<T> = T extends unknown ? Omit<T, "children"> : never;

export type ColorSwatchButtonProps = WithoutChildren<IconButtonProps> & {
  color: string;
};

export const ColorSwatchButton = React.forwardRef<
  HTMLButtonElement,
  ColorSwatchButtonProps
>(function ColorSwatchButton({ color, className, ...props }, ref) {
  return (
    <IconButton {...props} ref={ref} className={clsx("shrink-0", className)}>
      <span
        className="border-border box-border block size-full rounded-full border"
        style={{ backgroundColor: color }}
      />
    </IconButton>
  );
});

export type CompactValueButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "children" | "value" | "aria-label" | "aria-labelledby"
> & {
  value: string;
} & (
    | { "aria-label": string; "aria-labelledby"?: string }
    | { "aria-label"?: string; "aria-labelledby": string }
  );

export const CompactValueButton = React.forwardRef<
  HTMLButtonElement,
  CompactValueButtonProps
>(function CompactValueButton(
  { value, className, type = "button", ...props },
  ref,
) {
  return (
    <button
      {...props}
      ref={ref}
      type={type}
      className={twMerge(
        clsx(
          "text-foreground hover:not-disabled:bg-muted-hover focus-visible:bg-background box-border inline-flex h-[32px] shrink-0 cursor-pointer items-center justify-center gap-[8px] rounded-[var(--radius-sm)] border-0 bg-transparent px-[8px] [font:var(--type-label)] focus-visible:shadow-[var(--shadow-focus)] focus-visible:outline-2 focus-visible:outline-transparent disabled:cursor-not-allowed disabled:opacity-50",
          className,
        ),
      )}
    >
      <span>{value}</span>
      <ChevronDown
        aria-hidden="true"
        className="text-muted-foreground size-[16px] shrink-0"
        strokeWidth={1.5}
      />
    </button>
  );
});
