import { clsx } from "clsx";
import * as React from "react";
import { twMerge } from "tailwind-merge";

export type SeparatorProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children" | "role" | "tabIndex" | "aria-hidden" | "aria-orientation"
> & {
  orientation?: "horizontal" | "vertical";
  decorative?: boolean;
};

export const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  function Separator(
    { orientation = "horizontal", decorative = false, className, ...props },
    ref,
  ) {
    return (
      <div
        {...props}
        ref={ref}
        role={decorative ? undefined : "separator"}
        aria-hidden={decorative ? true : undefined}
        aria-orientation={
          !decorative && orientation === "vertical" ? "vertical" : undefined
        }
        className={twMerge(
          clsx(
            "bg-border block shrink-0",
            orientation === "vertical" ? "h-[20px] w-px" : "h-px w-full",
            className,
          ),
        )}
      />
    );
  },
);
