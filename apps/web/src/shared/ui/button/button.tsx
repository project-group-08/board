import { cva, type VariantProps } from "class-variance-authority";
import { clsx } from "clsx";
import { LoaderCircle } from "lucide-react";
import * as React from "react";
import { twMerge } from "tailwind-merge";

const buttonVariants = cva(
  "box-border inline-flex cursor-pointer items-center justify-center gap-[8px] rounded-[var(--radius-md)] border border-transparent font-sans text-[14px]/[20px] font-medium whitespace-nowrap focus-visible:shadow-[var(--shadow-focus)] focus-visible:outline-2 focus-visible:outline-transparent disabled:cursor-not-allowed disabled:opacity-50 disabled:data-[loading=true]:opacity-80 [&[hidden]]:hidden",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground hover:not-disabled:bg-primary-hover",
        accent:
          "bg-accent-solid text-accent-foreground hover:not-disabled:bg-accent-hover",
        outline:
          "bg-background text-foreground border-border hover:not-disabled:bg-muted-hover focus-visible:border-accent",
        ghost:
          "text-foreground hover:not-disabled:bg-muted-hover focus-visible:bg-background bg-transparent",
        destructive:
          "bg-destructive text-destructive-foreground hover:not-disabled:bg-destructive-hover",
      },
      size: {
        default: "h-[36px] px-[15px]",
        large: "h-[40px] px-[23px]",
        small: "h-[32px] px-[11px]",
      },
    },
    defaultVariants: { variant: "primary", size: "default" },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  loading?: boolean;
  loadingLabel?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      className,
      variant = "primary",
      size = "default",
      leadingIcon,
      trailingIcon,
      loading = false,
      loadingLabel = "Загрузка",
      disabled,
      type = "button",
      children,
      ...props
    },
    ref,
  ) {
    const resolvedVariant = variant ?? "primary";
    const resolvedSize = size ?? "default";
    return (
      <button
        {...props}
        ref={ref}
        type={type}
        disabled={disabled || loading}
        aria-busy={loading ? true : props["aria-busy"]}
        data-loading={loading || undefined}
        className={twMerge(
          clsx(
            buttonVariants({ variant: resolvedVariant, size: resolvedSize }),
            className,
          ),
        )}
      >
        {loading ? (
          <span
            className="inline-flex size-[16px] shrink-0 [&_svg]:size-full"
            aria-hidden="true"
          >
            <LoaderCircle
              className="animate-spin motion-reduce:animate-none"
              strokeWidth={2.25}
            />
          </span>
        ) : (
          leadingIcon && (
            <span
              className="inline-flex size-[16px] shrink-0 [&_svg]:size-full"
              aria-hidden="true"
            >
              {leadingIcon}
            </span>
          )
        )}
        {children}
        {!loading && trailingIcon && (
          <span
            className="inline-flex size-[16px] shrink-0 [&_svg]:size-full"
            aria-hidden="true"
          >
            {trailingIcon}
          </span>
        )}
        {loading && <span className="sr-only"> — {loadingLabel}</span>}
      </button>
    );
  },
);

export { buttonVariants };
