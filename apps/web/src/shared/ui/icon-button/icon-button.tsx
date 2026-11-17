import { clsx } from "clsx";
import * as React from "react";
import { twMerge } from "tailwind-merge";

export type IconButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "children" | "aria-label" | "aria-labelledby"
> & {
  children: React.ReactNode;
} & (
    | { "aria-label": string; "aria-labelledby"?: string }
    | { "aria-label"?: string; "aria-labelledby": string }
  );

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton({ children, className, type = "button", ...props }, ref) {
    return (
      <button
        {...props}
        ref={ref}
        type={type}
        className={twMerge(
          clsx(
            "text-muted-foreground hover:not-disabled:bg-muted-hover focus-visible:bg-background box-border inline-flex size-[32px] cursor-pointer items-center justify-center rounded-[var(--radius-sm)] border-0 bg-transparent p-0 focus-visible:shadow-[var(--shadow-focus)] focus-visible:outline-2 focus-visible:outline-transparent disabled:cursor-not-allowed disabled:opacity-50 [&[hidden]]:hidden",
            className,
          ),
        )}
      >
        <span
          className="inline-flex size-[16px] shrink-0 [&_svg]:size-full"
          aria-hidden="true"
        >
          {children}
        </span>
      </button>
    );
  },
);
