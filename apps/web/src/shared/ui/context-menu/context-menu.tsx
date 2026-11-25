"use client";

import { Copy, Download, Group, Trash2 } from "lucide-react";
import type { ReactElement } from "react";

import {
  Menu,
  MenuContent,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
} from "../menu";

export type ContextMenuProps = {
  trigger: ReactElement;
  onCopy: () => void;
  onGroup: () => void;
  onExportSelection: () => void;
  onDelete: () => void;
  disabled?: {
    copy?: boolean;
    group?: boolean;
    exportSelection?: boolean;
    delete?: boolean;
  };
};

export function ContextMenu({
  trigger,
  onCopy,
  onGroup,
  onExportSelection,
  onDelete,
  disabled,
}: ContextMenuProps) {
  return (
    <Menu>
      <MenuTrigger render={trigger} />
      <MenuContent className="w-[194px]">
        <MenuItem
          className="mb-[2px]"
          icon={<Copy strokeWidth={1.5} />}
          disabled={disabled?.copy}
          onClick={onCopy}
        >
          Копировать
        </MenuItem>
        <MenuItem
          className="mb-[2px]"
          icon={<Group strokeWidth={1.5} />}
          disabled={disabled?.group}
          onClick={onGroup}
        >
          Сгруппировать
        </MenuItem>
        <MenuItem
          icon={<Download strokeWidth={1.5} />}
          disabled={disabled?.exportSelection}
          onClick={onExportSelection}
        >
          Экспортировать выделенное
        </MenuItem>
        <MenuSeparator />
        <MenuItem
          destructive
          icon={<Trash2 className="text-foreground" strokeWidth={1.5} />}
          disabled={disabled?.delete}
          onClick={onDelete}
        >
          Удалить
        </MenuItem>
      </MenuContent>
    </Menu>
  );
}
