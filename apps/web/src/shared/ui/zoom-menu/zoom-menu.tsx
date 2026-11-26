"use client";

import type { ReactElement } from "react";

import {
  Menu,
  MenuContent,
  MenuItem,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuTrigger,
} from "../menu";

export type ZoomMenuProps = {
  trigger: ReactElement;
  zoomPercent: number;
  onShowAll: () => void;
  onShowSelection: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onSetZoom: (percent: number) => void;
};

export function ZoomMenu({
  trigger,
  zoomPercent,
  onShowAll,
  onShowSelection,
  onZoomIn,
  onZoomOut,
  onSetZoom,
}: ZoomMenuProps) {
  return (
    <Menu>
      <MenuTrigger render={trigger} />
      <MenuContent className="w-[220px]">
        <MenuItem
          className="mb-[2px]"
          shortcut="Shift 1"
          onClick={() => onShowAll()}
        >
          Показать всё
        </MenuItem>
        <MenuItem shortcut="Shift 2" onClick={() => onShowSelection()}>
          К выделению
        </MenuItem>
        <MenuSeparator className="my-[2px]" />
        <MenuItem
          className="mb-[2px]"
          shortcut="Ctrl +"
          onClick={() => onZoomIn()}
        >
          Увеличить
        </MenuItem>
        <MenuItem shortcut="Ctrl −" onClick={() => onZoomOut()}>
          Уменьшить
        </MenuItem>
        <MenuSeparator className="my-[2px]" />
        <MenuRadioGroup
          value={zoomPercent}
          onValueChange={(value) => onSetZoom(value)}
          checkSide="right"
        >
          <MenuRadioItem className="mb-[2px]" value={50}>
            50%
          </MenuRadioItem>
          <MenuRadioItem className="mb-[2px]" value={100} shortcut="Shift 0">
            100%
          </MenuRadioItem>
          <MenuRadioItem value={200}>200%</MenuRadioItem>
        </MenuRadioGroup>
      </MenuContent>
    </Menu>
  );
}
