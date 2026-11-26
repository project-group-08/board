import { clsx } from "clsx";
import * as React from "react";
import { twMerge } from "tailwind-merge";

export type NavItemProps = Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  "href" | "children" | "aria-current"
> & {
  href: string;
  icon: React.ReactNode;
  children: string;
  current?: boolean;
};

export const NavItem = React.forwardRef<HTMLAnchorElement, NavItemProps>(
  function NavItem(
    { href, icon, children, current = false, className, ...props },
    ref,
  ) {
    return (
      <a
        {...props}
        ref={ref}
        href={href}
        aria-current={current ? "page" : undefined}
        className={twMerge(
          clsx(
            "box-border flex min-h-[32px] w-full min-w-0 items-center gap-[var(--space-8)] rounded-[var(--radius-sm)] px-[var(--space-8)] py-[6px] [font:var(--type-label)] focus-visible:shadow-[var(--shadow-focus)] focus-visible:outline-2 focus-visible:outline-transparent",
            current
              ? "bg-muted text-foreground"
              : "text-muted-foreground hover:bg-muted focus-visible:bg-background",
            className,
          ),
        )}
      >
        <span
          aria-hidden="true"
          className="inline-flex size-[16px] shrink-0 [&_svg]:size-full"
        >
          {icon}
        </span>
        <span className="min-w-0 [overflow-wrap:anywhere]">{children}</span>
      </a>
    );
  },
);
