import { clsx } from "clsx";
import * as React from "react";
import { twMerge } from "tailwind-merge";

export type DividerWithTextProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children"
> & {
  children: string;
};

export const DividerWithText = React.forwardRef<
  HTMLDivElement,
  DividerWithTextProps
>(function DividerWithText({ children, className, ...props }, ref) {
  return (
    <div
      {...props}
      ref={ref}
      className={twMerge(
        clsx(
          "grid w-full min-w-0 grid-cols-[minmax(0,1fr)_minmax(0,auto)_minmax(0,1fr)] items-center gap-[var(--space-12)]",
          className,
        ),
      )}
    >
      <span aria-hidden="true" className="bg-border h-px w-full" />
      <span className="text-muted-foreground min-w-0 text-center [overflow-wrap:anywhere] [font:var(--type-caption)]">
        {children}
      </span>
      <span aria-hidden="true" className="bg-border h-px w-full" />
    </div>
  );
});
