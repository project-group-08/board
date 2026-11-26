import { ChevronDown } from "lucide-react";
import * as React from "react";

import { Button, type ButtonProps } from "../button";

export type FilterButtonProps = Omit<
  ButtonProps,
  | "children"
  | "leadingIcon"
  | "trailingIcon"
  | "loading"
  | "loadingLabel"
  | "variant"
  | "size"
> & {
  text: string;
  open?: boolean;
};

export const FilterButton = React.forwardRef<
  HTMLButtonElement,
  FilterButtonProps
>(function FilterButton({ text, open = false, className, ...props }, ref) {
  return (
    <Button
      {...props}
      ref={ref}
      variant="ghost"
      className={[
        "max-w-full min-w-0 gap-[8px] px-[12px] font-normal",
        open && "bg-muted-hover focus-visible:bg-muted-hover",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span className="min-w-0 truncate">{text}</span>
      <ChevronDown
        aria-hidden="true"
        size={16}
        strokeWidth={1.5}
        className={open ? "shrink-0 rotate-180" : "shrink-0"}
      />
    </Button>
  );
});
