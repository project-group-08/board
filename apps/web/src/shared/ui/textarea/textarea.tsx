import { clsx } from "clsx";
import * as React from "react";
import { twMerge } from "tailwind-merge";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ className, ...props }, ref) {
    return (
      <textarea
        {...props}
        ref={ref}
        className={twMerge(
          clsx(
            "border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-accent aria-[invalid=true]:border-destructive aria-[invalid=true]:focus:border-destructive disabled:bg-muted disabled:text-muted-foreground box-border h-[80px] w-full min-w-0 resize-y overflow-auto rounded-[var(--radius-md)] border px-[12px] py-[8px] font-sans text-[14px]/[20px] font-normal placeholder:opacity-100 focus:shadow-[var(--shadow-focus)] focus:outline-2 focus:outline-transparent disabled:cursor-not-allowed disabled:opacity-50",
            className,
          ),
        )}
      />
    );
  },
);
