import { clsx } from "clsx";
import * as React from "react";
import { twMerge } from "tailwind-merge";

export type KbdProps = Omit<React.HTMLAttributes<HTMLElement>, "children"> & {
  children: string;
  variant?: "default" | "inverted";
};

export const Kbd = React.forwardRef<HTMLElement, KbdProps>(function Kbd(
  { children, variant = "default", className, ...props },
  ref,
) {
  return (
    <kbd
      {...props}
      ref={ref}
      className={twMerge(
        clsx(
          "inline-block rounded-[var(--radius-xs)] border px-[6px] py-px [font:var(--type-mono)]",
          variant === "inverted"
            ? "border-inverse-foreground text-inverse-foreground bg-transparent opacity-70"
            : "border-border bg-muted text-muted-foreground",
          className,
        ),
      )}
    >
      {children}
    </kbd>
  );
});
