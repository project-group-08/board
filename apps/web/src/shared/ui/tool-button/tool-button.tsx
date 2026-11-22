import { clsx } from "clsx";
import * as React from "react";

import { IconButton, type IconButtonProps } from "../icon-button";

type WithoutPressed<T> = T extends unknown ? Omit<T, "aria-pressed"> : never;

export type ToolButtonProps = WithoutPressed<IconButtonProps> & {
  selected?: boolean;
};

export const ToolButton = React.forwardRef<HTMLButtonElement, ToolButtonProps>(
  function ToolButton({ selected = false, className, ...props }, ref) {
    return (
      <IconButton
        {...props}
        ref={ref}
        aria-pressed={selected}
        className={clsx(
          "text-foreground size-[36px] disabled:opacity-40",
          selected
            ? "bg-accent-solid text-accent-foreground hover:not-disabled:bg-accent-solid focus-visible:bg-accent-solid"
            : "hover:not-disabled:bg-muted",
          className,
        )}
      />
    );
  },
);
