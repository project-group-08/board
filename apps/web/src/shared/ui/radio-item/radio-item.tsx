import { clsx } from "clsx";
import * as React from "react";
import { twMerge } from "tailwind-merge";

export type RadioItemProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "children" | "aria-label" | "aria-labelledby"
> & {
  label: string;
  description?: string;
};

export const RadioItem = React.forwardRef<HTMLInputElement, RadioItemProps>(
  function RadioItem(
    {
      label,
      description,
      className,
      "aria-describedby": describedBy,
      ...props
    },
    ref,
  ) {
    const id = React.useId();
    const labelId = `${id}-label`;
    const descriptionId = `${id}-description`;
    const hasDescription = Boolean(description);
    const descriptions =
      [describedBy, hasDescription ? descriptionId : undefined]
        .filter(Boolean)
        .join(" ") || undefined;

    return (
      <label className="flex w-full min-w-0 items-start gap-[var(--space-12)] has-[:disabled]:opacity-50">
        <span className="relative mt-[2px] inline-flex size-[16px] shrink-0">
          <input
            {...props}
            ref={ref}
            type="radio"
            aria-label={undefined}
            aria-labelledby={labelId}
            aria-describedby={descriptions}
            className={twMerge(
              clsx(
                "peer border-border bg-background hover:not-disabled:not-checked:not-focus-visible:border-dot checked:border-primary focus-visible:not-checked:border-accent m-0 box-border size-[16px] shrink-0 cursor-pointer appearance-none rounded-full border focus-visible:shadow-[var(--shadow-focus)] focus-visible:outline-2 focus-visible:outline-transparent disabled:cursor-not-allowed forced-colors:appearance-auto forced-colors:focus-visible:shadow-none forced-colors:focus-visible:outline-[Highlight]",
                className,
              ),
            )}
          />
          <span
            aria-hidden="true"
            className="bg-primary pointer-events-none absolute top-[4px] left-[4px] hidden size-[8px] rounded-full peer-checked:block forced-colors:peer-checked:hidden"
          />
        </span>
        <span className="flex min-w-0 flex-col gap-[var(--space-4)]">
          <span
            id={labelId}
            className="text-foreground [overflow-wrap:anywhere] [font:var(--type-label)]"
          >
            {label}
          </span>
          {hasDescription && (
            <span
              id={descriptionId}
              className="text-muted-foreground [overflow-wrap:anywhere] [font:var(--type-body-s)]"
            >
              {description}
            </span>
          )}
        </span>
      </label>
    );
  },
);
