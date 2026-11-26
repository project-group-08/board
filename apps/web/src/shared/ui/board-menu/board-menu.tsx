"use client";

import { Copy, ExternalLink, Pencil, Trash2 } from "lucide-react";
import type { ReactElement } from "react";

import {
  Menu,
  MenuContent,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
} from "../menu";

export type BoardMenuProps = {
  trigger: ReactElement;
  href: string;
  labels: {
    open: string;
    rename: string;
    copy: string;
    delete: string;
  };
  onRename: () => void;
  onCopy: () => void;
  onDelete: () => void;
};

const iconClass = "group-data-[highlighted]:text-foreground";

export function BoardMenu({
  trigger,
  href,
  labels,
  onRename,
  onCopy,
  onDelete,
}: BoardMenuProps) {
  return (
    <Menu>
      <MenuTrigger render={trigger} />
      <MenuContent className="p-[3px]">
        <MenuItem
          className="group"
          render={<a href={href} aria-label={labels.open} />}
          icon={<ExternalLink strokeWidth={1.5} className={iconClass} />}
        >
          {labels.open}
        </MenuItem>
        <MenuItem
          className="group"
          onClick={onRename}
          icon={<Pencil strokeWidth={1.5} className={iconClass} />}
        >
          {labels.rename}
        </MenuItem>
        <MenuItem
          className="group"
          onClick={onCopy}
          icon={<Copy strokeWidth={1.5} className={iconClass} />}
        >
          {labels.copy}
        </MenuItem>
        <MenuSeparator className="my-[3.5px]" />
        <MenuItem
          destructive
          onClick={onDelete}
          icon={<Trash2 strokeWidth={1.5} />}
        >
          {labels.delete}
        </MenuItem>
      </MenuContent>
    </Menu>
  );
}
