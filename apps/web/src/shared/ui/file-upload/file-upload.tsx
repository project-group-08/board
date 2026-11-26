"use client";

import { LoaderCircle, Upload } from "lucide-react";
import Image from "next/image";
import * as React from "react";

import { Button } from "../button";

export type FileUploadState =
  | { kind: "empty"; title: string; hint: string }
  | {
      kind: "uploading";
      fileName: string;
      progress: number;
      progressLabel: string;
    }
  | { kind: "error"; fileName: string; error: string }
  | { kind: "done"; fileName: string; previewUrl?: string };

export type FileUploadProps = {
  state: FileUploadState;
  labels: {
    upload: string;
    uploading: string;
    retry: string;
    done: string;
    replace: string;
    remove: string;
  };
  accept?: string;
  disabled?: boolean;
  contextLabel?: string;
  onFileSelect: (file: File) => void;
  onRetry: () => void;
  onRemove: () => void;
};

export function FileUpload({
  state,
  labels,
  accept,
  disabled,
  contextLabel,
  onFileSelect,
  onRetry,
  onRemove,
}: FileUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const actionRef = React.useRef<HTMLButtonElement>(null);
  const statusRef = React.useRef<HTMLOutputElement>(null);
  const lastFocusedRef = React.useRef<HTMLElement | null>(null);
  const previousKindRef = React.useRef(state.kind);
  const previousDisabledRef = React.useRef(Boolean(disabled));
  const hintId = React.useId();
  const errorId = React.useId();
  const context =
    contextLabel || (state.kind === "empty" ? state.title : state.fileName);
  const progress =
    state.kind === "uploading" && Number.isFinite(state.progress)
      ? Math.min(100, Math.max(0, state.progress))
      : 0;

  React.useLayoutEffect(() => {
    const changed = previousKindRef.current !== state.kind;
    const newlyDisabled = Boolean(disabled) && !previousDisabledRef.current;
    previousKindRef.current = state.kind;
    previousDisabledRef.current = Boolean(disabled);
    if (!changed && !newlyDisabled) return;

    const focused = document.activeElement;
    const previous = lastFocusedRef.current;
    const ownsFocus =
      rootRef.current?.contains(focused) ||
      (focused === document.body &&
        previous &&
        (!previous.isConnected ||
          (newlyDisabled &&
            previous instanceof HTMLButtonElement &&
            previous.disabled)));
    if (!ownsFocus) return;

    const target =
      state.kind === "uploading" || disabled
        ? statusRef.current
        : actionRef.current;
    target?.focus();
  }, [state.kind, disabled]);

  return (
    <div
      ref={rootRef}
      data-slot="file-upload"
      className="flex min-w-0 items-center gap-[16px]"
      onFocusCapture={(event) => {
        lastFocusedRef.current = event.target;
      }}
      onBlurCapture={(event) => {
        if (
          !event.currentTarget.contains(event.relatedTarget) &&
          !(
            event.relatedTarget === null &&
            event.target instanceof HTMLButtonElement &&
            event.target.disabled
          )
        ) {
          lastFocusedRef.current = null;
        }
      }}
    >
      <div
        aria-hidden="true"
        className={
          state.kind === "done"
            ? "from-muted relative size-[64px] shrink-0 overflow-hidden rounded-[var(--radius-md)] bg-linear-to-br to-[var(--color-surface)]"
            : `bg-muted text-muted-foreground flex size-[64px] shrink-0 items-center justify-center rounded-[var(--radius-md)] border ${state.kind === "uploading" ? "border-border" : "border-dashed"} ${state.kind === "error" ? "border-destructive" : "border-border"}`
        }
      >
        {state.kind === "done" ? (
          state.previewUrl && (
            <Image
              src={state.previewUrl}
              alt=""
              fill
              unoptimized
              sizes="64px"
              className="size-full object-cover"
            />
          )
        ) : state.kind === "uploading" ? (
          <LoaderCircle
            size={16}
            strokeWidth={1.5}
            className="animate-spin motion-reduce:animate-none"
          />
        ) : (
          <Upload size={16} strokeWidth={1.5} />
        )}
      </div>
      <div className="flex min-w-0 flex-col items-start gap-[8px]">
        <div className="flex min-w-0 flex-col">
          <span className="text-foreground min-w-0 [overflow-wrap:anywhere] [font:var(--type-label)]">
            {state.kind === "empty" ? state.title : state.fileName}
          </span>
          <output
            ref={statusRef}
            tabIndex={-1}
            id={
              state.kind === "empty"
                ? hintId
                : state.kind === "error"
                  ? errorId
                  : undefined
            }
            aria-atomic="true"
            className={`${state.kind === "error" ? "text-destructive" : "text-muted-foreground"} min-w-0 rounded-[var(--radius-xs)] [overflow-wrap:anywhere] [font:var(--type-caption)] focus-visible:shadow-[var(--shadow-focus)] focus-visible:outline-2 focus-visible:outline-transparent`}
          >
            <span className="sr-only">{context}: </span>
            {state.kind === "empty"
              ? state.hint
              : state.kind === "error"
                ? state.error
                : state.kind === "uploading"
                  ? labels.uploading
                  : labels.done}
          </output>
        </div>
        {state.kind === "uploading" ? (
          <progress
            aria-label={state.progressLabel}
            max={100}
            value={progress}
            className="bg-muted [&::-webkit-progress-bar]:bg-muted [&::-webkit-progress-value]:bg-foreground [&::-moz-progress-bar]:bg-foreground h-[4px] w-[200px] max-w-full appearance-none overflow-hidden rounded-full [&::-moz-progress-bar]:rounded-full [&::-webkit-progress-value]:rounded-full"
          />
        ) : (
          <div className="flex max-w-full flex-wrap gap-[8px]">
            {state.kind === "error" ? (
              <Button
                ref={actionRef}
                variant="outline"
                size="small"
                disabled={disabled}
                onClick={onRetry}
                aria-label={`${labels.retry} — ${context}`}
                aria-describedby={errorId}
              >
                {labels.retry}
              </Button>
            ) : (
              <Button
                ref={actionRef}
                variant="outline"
                size="small"
                disabled={disabled}
                aria-describedby={state.kind === "empty" ? hintId : undefined}
                aria-label={`${state.kind === "empty" ? labels.upload : labels.replace} — ${context}`}
                onClick={() => inputRef.current?.click()}
              >
                {state.kind === "empty" ? labels.upload : labels.replace}
              </Button>
            )}
            {state.kind === "done" && (
              <Button
                variant="ghost"
                size="small"
                disabled={disabled}
                onClick={onRemove}
                aria-label={`${labels.remove} — ${context}`}
              >
                {labels.remove}
              </Button>
            )}
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        disabled={disabled}
        tabIndex={-1}
        aria-hidden="true"
        className="hidden"
        onChange={(event) => {
          const file = event.currentTarget.files?.[0];
          // Сброс позволяет выбрать тот же файл повторно.
          event.currentTarget.value = "";
          if (file) onFileSelect(file);
        }}
      />
    </div>
  );
}
