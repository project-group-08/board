import { clsx } from "clsx";
import * as React from "react";

export type FieldControlProps = {
  id: string;
  "aria-invalid": true | undefined;
  "aria-describedby": string | undefined;
  disabled: boolean | undefined;
};

export type FieldProps = {
  label: string;
  error?: string;
  disabled?: boolean;
  children: (props: FieldControlProps) => React.ReactNode;
};

export function Field({ label, error, disabled, children }: FieldProps) {
  const id = React.useId();
  const errorId = `${id}-error`;
  const hasError = Boolean(error);

  return (
    <div className="flex w-full min-w-0 flex-col gap-[8px]">
      <label
        htmlFor={id}
        className={clsx(
          "font-sans text-[14px]/[20px] font-medium",
          disabled ? "text-muted-foreground" : "text-foreground",
        )}
      >
        {label}
      </label>
      {children({
        id,
        "aria-invalid": hasError ? true : undefined,
        "aria-describedby": hasError ? errorId : undefined,
        disabled,
      })}
      {hasError && (
        <p
          id={errorId}
          className="text-destructive font-sans text-[13px]/[20px] font-normal"
        >
          {error}
        </p>
      )}
    </div>
  );
}
