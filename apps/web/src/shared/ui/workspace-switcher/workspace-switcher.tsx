import { ChevronsUpDown } from "lucide-react";
import * as React from "react";
import { twMerge } from "tailwind-merge";

import { WorkspaceMark } from "../workspace-mark";

export type WorkspaceSwitcherProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "name" | "children"
> & {
  name: string;
  meta: string;
  markFallback: string;
  markSrc?: string;
};

export const WorkspaceSwitcher = React.forwardRef<
  HTMLButtonElement,
  WorkspaceSwitcherProps
>(function WorkspaceSwitcher(
  { name, meta, markFallback, markSrc, className, type = "button", ...props },
  ref,
) {
  const labelId = React.useId();
  const metaId = React.useId();
  return (
    <button
      {...props}
      ref={ref}
      type={type}
      aria-labelledby={
        props["aria-label"] || props["aria-labelledby"]
          ? props["aria-labelledby"]
          : `${labelId} ${metaId}`
      }
      className={twMerge(
        "text-foreground hover:bg-muted data-[popup-open]:bg-muted box-border flex min-h-[48px] w-[224px] min-w-0 cursor-pointer items-center gap-[var(--space-8)] rounded-[var(--radius-sm)] bg-transparent px-[var(--space-8)] py-[var(--space-4)] text-left focus-visible:shadow-[var(--shadow-focus)] focus-visible:outline-2 focus-visible:outline-transparent",
        className,
      )}
    >
      <div aria-hidden="true" className="shrink-0">
        <WorkspaceMark name={name} fallback={markFallback} src={markSrc} />
      </div>
      <span className="flex min-w-0 flex-1 flex-col [overflow-wrap:anywhere]">
        <span id={labelId} className="[font:var(--type-label)]">
          {name}
        </span>
        <span
          id={metaId}
          className="text-muted-foreground [font:var(--type-caption)]"
        >
          {meta}
        </span>
      </span>
      <ChevronsUpDown
        aria-hidden="true"
        size={16}
        strokeWidth={1.5}
        className="text-muted-foreground shrink-0"
      />
    </button>
  );
});
