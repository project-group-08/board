"use client";

import { Switch as BaseSwitch } from "@base-ui/react/switch";
import { clsx } from "clsx";
import * as React from "react";
import { twMerge } from "tailwind-merge";

export type SwitchProps = Omit<
  BaseSwitch.Root.Props,
  "children" | "className" | "render" | "nativeButton"
> & { className?: string };

/** Нативный form.reset() не гарантирует согласованность Switch и FormData в Base UI 1.9.0. */
export const Switch = React.forwardRef<HTMLElement, SwitchProps>(
  function Switch({ className, ...props }, ref) {
    return (
      <BaseSwitch.Root
        {...props}
        ref={ref}
        className={twMerge(
          clsx(
            "bg-dot data-checked:bg-primary relative inline-flex h-[18px] w-[32px] shrink-0 cursor-pointer items-center rounded-full border-0 align-middle focus-visible:shadow-[var(--shadow-focus)] focus-visible:outline-2 focus-visible:outline-transparent data-disabled:cursor-not-allowed data-disabled:opacity-50 forced-colors:border forced-colors:border-[ButtonText] forced-colors:bg-[Canvas] forced-colors:focus-visible:shadow-none forced-colors:focus-visible:outline-[Highlight] forced-colors:data-checked:bg-[Highlight]",
            className,
          ),
        )}
      >
        <BaseSwitch.Thumb
          aria-hidden="true"
          className="bg-background pointer-events-none absolute top-[2px] left-[2px] size-[14px] rounded-full transition-transform duration-[150ms] ease-[ease-out] data-checked:translate-x-[14px] motion-reduce:transition-none forced-colors:bg-[ButtonText] forced-colors:data-checked:bg-[HighlightText]"
        />
      </BaseSwitch.Root>
    );
  },
);
