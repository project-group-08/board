import { clsx } from "clsx";
import * as React from "react";
import { twMerge } from "tailwind-merge";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  function Input({ className, ...props }, ref) {
    return (
      <input
        {...props}
        ref={ref}
        className={twMerge(
          clsx(
            "border-border bg-background text-foreground placeholder:text-muted-foreground hover:not-disabled:not-focus:border-dot focus:border-accent aria-[invalid=true]:border-destructive aria-[invalid=true]:hover:border-destructive aria-[invalid=true]:focus:border-destructive [&[readonly]]:bg-muted disabled:bg-muted disabled:text-muted-foreground box-border h-[36px] w-full min-w-0 rounded-[var(--radius-md)] border px-[12px] font-sans text-[14px]/[20px] font-normal placeholder:opacity-100 focus:shadow-[var(--shadow-focus)] focus:outline-2 focus:outline-transparent disabled:cursor-not-allowed disabled:opacity-50",
            className,
          ),
        )}
      />
    );
  },
);
