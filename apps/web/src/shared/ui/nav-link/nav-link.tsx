import { clsx } from "clsx";
import * as React from "react";
import { twMerge } from "tailwind-merge";

export type NavLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement>;

export const NavLink = React.forwardRef<HTMLAnchorElement, NavLinkProps>(
  function NavLink({ children, className, ...props }, ref) {
    return (
      <a
        {...props}
        ref={ref}
        className={twMerge(
          clsx(
            "text-muted-foreground hover:text-foreground whitespace-nowrap [font:var(--type-label)] focus-visible:shadow-[var(--shadow-focus)] focus-visible:outline-2 focus-visible:outline-transparent",
            className,
          ),
        )}
      >
        {children}
      </a>
    );
  },
);
