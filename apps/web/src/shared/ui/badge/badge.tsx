import { clsx } from "clsx";
import * as React from "react";
import { twMerge } from "tailwind-merge";

export type BadgeProps = Omit<
  React.HTMLAttributes<HTMLSpanElement>,
  "children"
> & {
  children: string;
  variant?: "default" | "outline" | "accent" | "destructive";
};

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  function Badge({ children, variant = "default", className, ...props }, ref) {
    return (
      <span
        {...props}
        ref={ref}
        className={twMerge(
          clsx(
            "box-border inline-block min-h-[24px] max-w-full rounded-[var(--radius-sm)] px-[var(--space-8)] align-middle font-sans text-[13px]/[20px] font-medium [overflow-wrap:anywhere]",
            {
              "bg-muted text-foreground py-[2px]": variant === "default",
              "border-border text-muted-foreground border bg-transparent py-px":
                variant === "outline",
              "text-accent bg-[var(--color-accent-soft)] py-[2px]":
                variant === "accent",
              "border-destructive text-destructive border bg-transparent py-px":
                variant === "destructive",
            },
            className,
          ),
        )}
      >
        {children}
      </span>
    );
  },
);
