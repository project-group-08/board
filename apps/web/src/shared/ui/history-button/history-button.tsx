import { History } from "lucide-react";
import * as React from "react";

import { IconButton, type IconButtonProps } from "../icon-button";

type DisclosureButtonProps<T> = T extends unknown
  ? Omit<T, "children" | "aria-expanded" | "aria-pressed">
  : never;

export type HistoryButtonProps = DisclosureButtonProps<IconButtonProps> & {
  open?: boolean;
};

export const HistoryButton = React.forwardRef<
  HTMLButtonElement,
  HistoryButtonProps
>(function HistoryButton({ open = false, className, ...props }, ref) {
  return (
    <IconButton
      {...props}
      ref={ref}
      aria-expanded={open}
      className={[
        "border-border bg-background text-foreground relative size-[44px] rounded-[var(--radius-md)] border shadow-[var(--shadow-floating)]",
        "before:absolute before:inset-[3px] before:rounded-[var(--radius-sm)] before:content-[''] [&>span]:relative",
        open
          ? "text-accent-foreground before:bg-accent-solid hover:not-disabled:bg-background focus-visible:bg-background"
          : "hover:not-disabled:bg-background hover:not-disabled:before:bg-muted",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <History strokeWidth={1.5} />
    </IconButton>
  );
});
