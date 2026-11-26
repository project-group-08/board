import { BotMessageSquare, LoaderCircle } from "lucide-react";
import * as React from "react";

import { IconButton, type IconButtonProps } from "../icon-button";

type DisclosureButtonProps<T> = T extends unknown
  ? Omit<T, "children" | "aria-expanded" | "aria-pressed" | "aria-busy">
  : never;

export type AiChatButtonProps = DisclosureButtonProps<IconButtonProps> & {
  open?: boolean;
  loading?: boolean;
};

export const AiChatButton = React.forwardRef<
  HTMLButtonElement,
  AiChatButtonProps
>(function AiChatButton(
  { open = false, loading = false, className, ...props },
  ref,
) {
  const Icon = loading ? LoaderCircle : BotMessageSquare;

  return (
    <IconButton
      {...props}
      ref={ref}
      aria-expanded={open}
      aria-busy={loading || undefined}
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
      <Icon
        strokeWidth={1.5}
        className={
          loading ? "animate-spin motion-reduce:animate-none" : undefined
        }
      />
    </IconButton>
  );
});
