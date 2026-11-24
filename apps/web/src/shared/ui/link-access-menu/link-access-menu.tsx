"use client";

import type { ReactElement } from "react";

import {
  Menu,
  MenuContent,
  MenuRadioGroup,
  MenuRadioItem,
  MenuTrigger,
} from "../menu";

export type LinkAccessValue = "none" | "view" | "edit";

export type LinkAccessMenuProps = {
  trigger: ReactElement;
  value: LinkAccessValue;
  labels: Record<LinkAccessValue, string>;
  onValueChange: (value: LinkAccessValue) => void;
};

export function LinkAccessMenu({
  trigger,
  value,
  labels,
  onValueChange,
}: LinkAccessMenuProps) {
  return (
    <Menu>
      <MenuTrigger render={trigger} />
      <MenuContent className="w-[220px] p-[3px]">
        <MenuRadioGroup
          value={value}
          onValueChange={(next) => onValueChange(next)}
        >
          <MenuRadioItem value="none">{labels.none}</MenuRadioItem>
          <MenuRadioItem value="view">{labels.view}</MenuRadioItem>
          <MenuRadioItem value="edit">{labels.edit}</MenuRadioItem>
        </MenuRadioGroup>
      </MenuContent>
    </Menu>
  );
}
