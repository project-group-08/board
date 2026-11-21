import { useId } from "react";

export type ColorPickerOption = {
  value: string;
  color: string;
  label: string;
};

export type ColorPickerProps = {
  label: string;
  options: readonly ColorPickerOption[];
  value: string;
  onValueChange: (value: string) => void;
};

export function ColorPicker({
  label,
  options,
  value,
  onValueChange,
}: ColorPickerProps) {
  const name = useId();

  return (
    <div className="border-border bg-background box-border w-[146px] max-w-full min-w-0 rounded-[var(--radius-md)] border p-[var(--space-12)] shadow-[var(--shadow-floating)]">
      <fieldset className="m-0 flex min-w-0 flex-col gap-[var(--space-8)] border-0 p-0">
        <legend className="sr-only">{label}</legend>
        <span
          aria-hidden="true"
          className="text-muted-foreground min-w-0 [overflow-wrap:anywhere] [font:var(--type-caption)]"
        >
          {label}
        </span>
        <div className="grid min-w-0 grid-cols-[repeat(auto-fit,minmax(min(24px,100%),24px))] gap-[var(--space-8)]">
          {options.map((option) => (
            <input
              key={option.value}
              type="radio"
              name={name}
              value={option.value}
              aria-label={option.label}
              checked={value === option.value}
              onChange={() => onValueChange(option.value)}
              style={{ backgroundColor: option.color }}
              className="border-border checked:border-accent m-0 aspect-square w-full cursor-pointer appearance-none rounded-full border checked:border-2 focus-visible:shadow-[var(--shadow-focus)] focus-visible:outline-2 focus-visible:outline-transparent forced-colors:appearance-auto forced-colors:focus-visible:shadow-none forced-colors:focus-visible:outline-[Highlight]"
            />
          ))}
        </div>
      </fieldset>
    </div>
  );
}
