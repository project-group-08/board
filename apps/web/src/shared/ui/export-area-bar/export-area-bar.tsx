import { Crop } from "lucide-react";

import { Button } from "../button";

export type ExportAreaBarProps = {
  onCancel: () => void;
  onExport: () => void;
};

export function ExportAreaBar({ onCancel, onExport }: ExportAreaBarProps) {
  return (
    <div className="border-border bg-background text-foreground inline-flex max-w-full flex-wrap items-center gap-[8px] rounded-[var(--radius-md)] border p-[6px] shadow-[var(--shadow-floating)]">
      <div className="flex min-w-0 items-center gap-[8px] px-[6px] font-sans text-[14px]/[20px]">
        <Crop
          aria-hidden="true"
          className="text-muted-foreground size-[16px] shrink-0"
          strokeWidth={2.25}
        />
        <span>Выделите область для экспорта</span>
      </div>
      <div className="flex max-w-full flex-wrap items-center gap-[8px]">
        <Button variant="outline" size="small" onClick={onCancel}>
          Отмена
        </Button>
        <Button variant="accent" size="small" onClick={onExport}>
          Экспортировать
        </Button>
      </div>
    </div>
  );
}
