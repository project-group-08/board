import { clsx } from "clsx";
import * as React from "react";
import { twMerge } from "tailwind-merge";

import { Checkbox, type CheckboxProps } from "../checkbox";

export type CheckboxFieldProps = Omit<
  CheckboxProps,
  "aria-invalid" | "aria-label" | "aria-labelledby"
> & {
  label: string;
  invalid?: boolean;
};

export const CheckboxField = React.forwardRef<
  HTMLInputElement,
  CheckboxFieldProps
>(function CheckboxField({ label, invalid = false, className, ...props }, ref) {
  return (
    <label className="text-muted-foreground flex w-full min-w-0 items-start gap-[var(--space-8)] [font:var(--type-body-s)]">
      <span className="mt-[2px] inline-flex shrink-0">
        <Checkbox
          {...props}
          ref={ref}
          aria-label={undefined}
          aria-labelledby={undefined}
          aria-invalid={invalid || undefined}
          className={twMerge(
            clsx(
              className,
              invalid &&
                "border-destructive checked:border-destructive hover:not-disabled:not-checked:not-focus-visible:border-destructive focus-visible:not-checked:border-destructive",
            ),
          )}
        />
      </span>
      <span className="min-w-0">{label}</span>
    </label>
  );
});
