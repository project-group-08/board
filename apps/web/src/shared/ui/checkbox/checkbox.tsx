import { clsx } from "clsx";
import * as React from "react";
import { twMerge } from "tailwind-merge";

export type CheckboxProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "children"
>;

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox({ className, ...props }, ref) {
    return (
      <span className="relative inline-flex size-[16px] shrink-0 align-middle">
        <input
          {...props}
          ref={ref}
          type="checkbox"
          className={twMerge(
            clsx(
              "peer border-border bg-background hover:not-disabled:not-checked:not-focus-visible:border-dot checked:border-primary checked:bg-primary focus-visible:not-checked:border-accent m-0 box-border size-[16px] shrink-0 cursor-pointer appearance-none rounded-[var(--radius-xs)] border focus-visible:shadow-[var(--shadow-focus)] focus-visible:outline-2 focus-visible:outline-transparent disabled:cursor-not-allowed disabled:opacity-50 forced-colors:appearance-auto forced-colors:focus-visible:shadow-none forced-colors:focus-visible:outline-[Highlight]",
              className,
            ),
          )}
        />
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          className="text-primary-foreground pointer-events-none absolute inset-0 hidden size-[16px] peer-checked:block peer-disabled:opacity-50 forced-colors:peer-checked:hidden"
        >
          <path
            d="M12 5 6.5 10.5 4 8"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    );
  },
);
