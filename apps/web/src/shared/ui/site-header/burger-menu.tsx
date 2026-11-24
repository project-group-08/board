"use client";

import { ReactNode, useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { IconButton } from "../icon-button";

type BurgerMenuProps = {
  navigation: ReactNode;
  navigationLabel: string;
  themeAction: ReactNode;
  actions: ReactNode;
};

export function BurgerMenu({
  navigationLabel,
  navigation,
  themeAction,
  actions,
}: BurgerMenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  useEffect(() => {
  const media = window.matchMedia("(min-width: 773px)");

  const closeMenu = (event: MediaQueryListEvent) => {
    if (event.matches) setIsMenuOpen(false);
  };

  media.addEventListener("change", closeMenu);
  return () => media.removeEventListener("change", closeMenu);
}, []);

  return (
    <>
      <IconButton
        aria-label={isMenuOpen ? "Закрыть меню" : "Открыть меню"}
        aria-expanded={isMenuOpen}
        className="text-foreground ml-auto size-9 hidden max-[772px]:block"
        onClick={() => setIsMenuOpen((open) => !open)}
      >
        <Menu size={16} />
      </IconButton>

      {isMenuOpen && (
        <div className="absolute top-15 right-0 w-[366px] max-w-[calc(100vw_-_16px)] rounded-(--radius-lg) bg-background px-[16px] pt-[8px] pb-[16px] ring-1 ring-inset ring-border">
          <div className="mb-[16px] flex shrink-0 flex-col items-stretch">
            <nav aria-label={navigationLabel} className="w-full">
              {navigation}
            </nav>
          </div>
          <div className="flex w-full shrink-0 flex-col">
            {actions}
            <span
              aria-hidden="true"
              className="my-[16px] h-px w-full shrink-0 bg-(--color-divider)"
            />
            {themeAction}
          </div>
        </div>
      )}
    </>
  );
}
