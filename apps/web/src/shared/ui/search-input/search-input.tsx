"use client";

import { clsx } from "clsx";
import { Search, X } from "lucide-react";
import * as React from "react";

import { Input } from "../input";

export type SearchInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "children"
> & {
  clearLabel: string;
  shortcut?: string;
  onValueChange?: (value: string) => void;
};

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  function SearchInput(
    {
      clearLabel,
      shortcut,
      onValueChange,
      onChange,
      value,
      defaultValue,
      disabled,
      readOnly,
      form,
      className,
      ...props
    },
    forwardedRef: React.Ref<HTMLInputElement>,
  ) {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [hasValue, setHasValue] = React.useState(
      () => String(defaultValue ?? "").length > 0,
    );
    const controlled = value != null;
    const filled = controlled ? String(value).length > 0 : hasValue;
    const showClear = filled && !disabled && !readOnly;

    const setRef = React.useCallback(
      (node: HTMLInputElement | null) => {
        inputRef.current = node;
        if (typeof forwardedRef === "function") {
          const cleanup = forwardedRef(node);
          if (typeof cleanup === "function") {
            return () => {
              inputRef.current = null;
              cleanup();
            };
          }
        } else if (forwardedRef) forwardedRef.current = node;
      },
      [forwardedRef],
    );

    React.useEffect(() => {
      const input = inputRef.current;
      if (!input) return;
      if (!controlled) setHasValue(input.value.length > 0);
      // Form ownership can change without this component re-rendering.
      const root = input.getRootNode();
      let timer: ReturnType<typeof setTimeout> | undefined;
      const onReset = (event: Event) => {
        if (event.target !== input.form) return;
        clearTimeout(timer);
        timer = setTimeout(() => {
          if (!controlled && input.isConnected)
            setHasValue(input.value.length > 0);
        }, 0);
      };
      root.addEventListener("reset", onReset, true);
      return () => {
        root.removeEventListener("reset", onReset, true);
        clearTimeout(timer);
      };
    }, [controlled, form]);

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
      const next = event.currentTarget.value;
      if (!controlled) setHasValue(next.length > 0);
      onChange?.(event);
      onValueChange?.(next);
    }

    function handleClear() {
      const input = inputRef.current;
      if (!input || input.matches(":disabled") || input.readOnly) return;
      if (!controlled) {
        input.value = "";
        setHasValue(false);
      }
      onValueChange?.("");
      if (input.isConnected && !input.matches(":disabled") && !input.readOnly)
        input.focus();
    }

    return (
      <span className="@container block w-full min-w-0">
        <span
          className="relative block w-full min-w-0 has-[>input:disabled]:[&>button]:hidden"
          data-shortcut={!filled && Boolean(shortcut) ? "" : undefined}
          data-clear={showClear ? "" : undefined}
        >
          <Input
            {...props}
            ref={setRef}
            type="search"
            form={form}
            value={value}
            defaultValue={defaultValue}
            disabled={disabled}
            readOnly={readOnly}
            onChange={handleChange}
            className={clsx(
              "pr-[12px] pl-[37px] [&::-webkit-search-cancel-button]:appearance-none",
              showClear && "pr-[40px]",
              !filled && shortcut && "@min-[200px]:pr-[96px]",
              className,
            )}
          />
          <Search
            aria-hidden="true"
            className="text-muted-foreground pointer-events-none absolute top-[10px] left-[12px]"
            size={16}
            strokeWidth={1.5}
          />
          {!filled && shortcut && (
            <kbd
              className="border-border bg-muted text-muted-foreground pointer-events-none absolute top-[8px] right-[13px] box-border hidden h-[20px] max-w-[76px] overflow-hidden rounded-[var(--radius-xs)] border px-[6px] py-[1px] text-ellipsis whitespace-nowrap [font:var(--type-mono)] @min-[200px]:block"
              aria-hidden="true"
            >
              {shortcut}
            </kbd>
          )}
          {showClear && (
            <button
              className="text-muted-foreground focus-visible:outline-accent absolute top-[4px] right-[8px] grid size-[28px] cursor-pointer place-items-center rounded-[var(--radius-xs)] border-0 bg-transparent p-0 focus-visible:outline-2 focus-visible:outline-offset-[-2px] forced-colors:focus-visible:outline-[Highlight]"
              type="button"
              aria-label={clearLabel}
              onClick={handleClear}
            >
              <X aria-hidden="true" size={16} strokeWidth={1.5} />
            </button>
          )}
        </span>
      </span>
    );
  },
);
