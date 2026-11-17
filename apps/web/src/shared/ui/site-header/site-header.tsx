"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";

export type SiteHeaderProps = {
  brand: ReactNode;
  navigation: ReactNode;
  navigationLabel: string;
  themeAction: ReactNode;
  actions: ReactNode;
  mobileNavigation: ReactNode;
  mobileActions: ReactNode;
  mobileThemeAction: ReactNode;
};

export function SiteHeader({
  brand,
  navigation,
  navigationLabel,
  themeAction,
  actions,
  mobileNavigation,
  mobileActions,
  mobileThemeAction,
}: SiteHeaderProps) {
  const [open, setOpen] = useState(false);
  const [availableHeight, setAvailableHeight] = useState<number>();
  const headerRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;

    function update() {
      if (window.innerWidth >= 1024) {
        setOpen(false);
        return;
      }
      const bottom = headerRef.current?.getBoundingClientRect().bottom ?? 0;
      if (bottom <= 0) {
        setOpen(false);
        return;
      }
      setAvailableHeight(Math.max(0, window.innerHeight - bottom - 16));
    }
    function onPointerDown(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        !headerRef.current?.contains(event.target)
      ) {
        setOpen(false);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !event.defaultPrevented) {
        const active = document.activeElement;
        const restoreFocus =
          active === buttonRef.current || panelRef.current?.contains(active);
        setOpen(false);
        if (restoreFocus) buttonRef.current?.focus();
      }
    }
    function onClick(event: MouseEvent) {
      if (event.target instanceof Element) {
        const link = event.target.closest("a[href]");
        if (link && panelRef.current?.contains(link)) setOpen(false);
      }
    }

    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("click", onClick, true);
    };
  }, [open]);

  return (
    <header
      ref={headerRef}
      className="border-border bg-background relative box-border flex w-full min-w-0 items-center gap-[var(--space-24)] rounded-[var(--radius-lg)] border py-[calc(var(--space-8)-1px)] pr-[calc(var(--space-8)-1px)] pl-[calc(var(--space-16)-1px)] shadow-[var(--shadow-floating)]"
    >
      <div className="flex min-w-0 items-center gap-[var(--space-24)] lg:shrink-0">
        <div>{brand}</div>
        <span
          aria-hidden="true"
          className="bg-border hidden h-[20px] w-px shrink-0 lg:block"
        />
        <nav aria-label={navigationLabel} className="hidden lg:block">
          {navigation}
        </nav>
      </div>
      <div className="ml-auto hidden shrink-0 items-center lg:flex">
        {themeAction}
        <span
          aria-hidden="true"
          className="bg-border ml-[var(--space-8)] h-[20px] w-px shrink-0"
        />
        {actions}
      </div>
      <button
        ref={buttonRef}
        type="button"
        aria-label={open ? "Закрыть меню" : "Открыть меню"}
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        onClick={() => setOpen(!open)}
        className="text-foreground hover:bg-muted-hover ml-auto inline-flex size-[36px] shrink-0 cursor-pointer items-center justify-center rounded-[var(--radius-sm)] focus-visible:shadow-[var(--shadow-focus)] focus-visible:outline-2 focus-visible:outline-transparent lg:hidden"
      >
        {open ? (
          <X size={16} strokeWidth={1.5} aria-hidden="true" />
        ) : (
          <Menu size={16} strokeWidth={1.5} aria-hidden="true" />
        )}
      </button>
      {open && (
        <div
          ref={panelRef}
          id={panelId}
          style={{ maxHeight: availableHeight }}
          className="border-border bg-background text-foreground absolute top-[calc(100%+var(--space-8))] -right-px -left-px z-10 overflow-y-auto rounded-[var(--radius-lg)] border p-[var(--space-16)] shadow-[var(--shadow-floating)] lg:hidden"
        >
          <nav aria-label={navigationLabel}>{mobileNavigation}</nav>
          <div className="mt-[var(--space-16)]">{mobileActions}</div>
          <div className="border-border mt-[var(--space-16)] flex justify-end border-t pt-[var(--space-16)]">
            {mobileThemeAction}
          </div>
        </div>
      )}
    </header>
  );
}
