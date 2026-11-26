import { clsx } from "clsx";
import { Lock } from "lucide-react";
import * as React from "react";
import { twMerge } from "tailwind-merge";

export type BoardToolbarProps = Omit<
  React.FieldsetHTMLAttributes<HTMLFieldSetElement>,
  "role" | "aria-label"
> & {
  "aria-label": string;
};

export const BoardToolbar = React.forwardRef<
  HTMLFieldSetElement,
  BoardToolbarProps
>(function BoardToolbar({ children, className, ...props }, ref) {
  return (
    <fieldset
      {...props}
      ref={ref}
      className={twMerge(
        clsx(
          "border-border bg-background text-foreground m-0 box-border inline-block max-w-full min-w-0 rounded-[var(--radius-md)] border p-[3px] shadow-[var(--shadow-floating)]",
          className,
        ),
      )}
    >
      <div className="flex min-w-0 flex-wrap items-center gap-[8px]">
        {children}
      </div>
    </fieldset>
  );
});

export const BoardToolbarViewLabel = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(function BoardToolbarViewLabel({ className, ...props }, ref) {
  return (
    <span
      {...props}
      ref={ref}
      className={twMerge(
        clsx(
          "text-muted-foreground inline-flex h-[36px] shrink-0 items-center gap-[8px] px-[8px] [font:var(--type-label)]",
          className,
        ),
      )}
    >
      <Lock aria-hidden="true" size={16} strokeWidth={1.5} />
      Просмотр
    </span>
  );
});
