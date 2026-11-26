"use client";

import { ArrowUp, X } from "lucide-react";
import {
  useLayoutEffect,
  useRef,
  type KeyboardEvent,
  type ReactNode,
} from "react";

import { IconButton } from "../icon-button";

export type AiChatPanelProps = {
  labels: {
    title: string;
    description: string;
    close: string;
    input: string;
    placeholder: string;
    send: string;
  };
  counter: string;
  value: string;
  onValueChange: (value: string) => void;
  onClose: () => void;
  onSend: () => void;
  inputDisabled?: boolean;
  sendDisabled?: boolean;
  children?: ReactNode;
};

export function AiChatPanel({
  labels,
  counter,
  value,
  onValueChange,
  onClose,
  onSend,
  inputDisabled = false,
  sendDisabled = false,
  children,
}: AiChatPanelProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const composing = useRef(false);

  useLayoutEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    function resize() {
      if (!input) return;
      input.style.height = "auto";
      input.style.height = `${input.scrollHeight}px`;
    }

    resize();
    const observer = new ResizeObserver(resize);
    if (input.parentElement) observer.observe(input.parentElement);
    return () => observer.disconnect();
  }, [value]);

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (
      event.key !== "Enter" ||
      event.shiftKey ||
      event.nativeEvent.isComposing ||
      composing.current ||
      event.nativeEvent.keyCode === 229
    )
      return;
    event.preventDefault();
    if (!sendDisabled && !inputDisabled) onSend();
  }

  return (
    <section
      aria-label={labels.title}
      className="border-border bg-background text-foreground flex h-[756px] max-h-[100dvh] w-[360px] max-w-full min-w-0 flex-col overflow-x-hidden overflow-y-auto rounded-[var(--radius-lg)] border shadow-[var(--shadow-floating)]"
    >
      <header className="flex shrink-0 items-start gap-[8px] p-[16px]">
        <div className="min-w-0 flex-1 [overflow-wrap:anywhere]">
          <h2 className="[font:var(--type-label)]">{labels.title}</h2>
          <p className="text-muted-foreground [font:var(--type-caption)]">
            {labels.description}
          </p>
        </div>
        <IconButton aria-label={labels.close} onClick={onClose}>
          <X strokeWidth={1.5} />
        </IconButton>
      </header>
      <div className="min-h-0 min-w-0 flex-1 overflow-y-auto px-[16px] [overflow-wrap:anywhere]">
        {children}
      </div>
      <div className="text-muted-foreground shrink-0 px-[16px] py-[8px] [overflow-wrap:anywhere] [font:var(--type-caption)]">
        {counter}
      </div>
      <div className="border-border flex shrink-0 items-end gap-[8px] border-t px-[12px] py-[12px]">
        <div className="flex min-w-0 flex-1 items-center self-stretch">
          <textarea
            ref={inputRef}
            aria-label={labels.input}
            placeholder={labels.placeholder}
            rows={1}
            value={value}
            disabled={inputDisabled}
            onChange={(event) => onValueChange(event.target.value)}
            onCompositionStart={() => {
              composing.current = true;
            }}
            onCompositionEnd={() => {
              composing.current = false;
            }}
            onKeyDown={handleKeyDown}
            className="placeholder:text-muted-foreground max-h-[100px] min-h-[20px] min-w-0 flex-1 resize-none overflow-y-auto rounded-[var(--radius-sm)] bg-transparent px-[4px] py-0 [font:var(--type-body-s)] focus-visible:shadow-[var(--shadow-focus)] focus-visible:outline-2 focus-visible:outline-transparent disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        <IconButton
          aria-label={labels.send}
          onClick={onSend}
          disabled={sendDisabled}
          className="bg-accent-solid text-accent-foreground hover:not-disabled:bg-accent-hover shrink-0"
        >
          <ArrowUp strokeWidth={1.5} />
        </IconButton>
      </div>
    </section>
  );
}
