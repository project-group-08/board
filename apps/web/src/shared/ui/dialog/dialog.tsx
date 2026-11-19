"use client";

import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { X } from "lucide-react";
import { useContext, useLayoutEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

import { IconButton } from "../icon-button";
import { ModalContext } from "../toast/modal-context";

export type DialogProps = Omit<BaseDialog.Root.Props, "modal">;

export function Dialog(props: DialogProps) {
  const coordinator = useContext(ModalContext);
  const [internalOpen, setInternalOpen] = useState(props.defaultOpen ?? false);
  const open = props.open ?? internalOpen;
  const release = useRef<(() => void) | null>(null);
  const openRef = useRef(open);

  useLayoutEffect(() => {
    openRef.current = open;
    if (open && !release.current)
      release.current = coordinator?.enter() ?? null;
  }, [coordinator, open]);
  useLayoutEffect(
    () => () => {
      release.current?.();
      release.current = null;
    },
    [coordinator],
  );

  return (
    <BaseDialog.Root
      {...props}
      modal
      onOpenChange={(next, details) => {
        props.onOpenChange?.(next, details);
        if (!details.isCanceled && props.open === undefined)
          setInternalOpen(next);
      }}
      onOpenChangeComplete={(next) => {
        if (!next && !openRef.current) {
          release.current?.();
          release.current = null;
        }
        props.onOpenChangeComplete?.(next);
      }}
    />
  );
}

export const DialogTrigger = BaseDialog.Trigger;
export const DialogClose = BaseDialog.Close;

export type DialogContentProps = {
  title: string;
  description?: string;
  children?: ReactNode;
  actions?: ReactNode;
};

export function DialogContent({
  title,
  description,
  children,
  actions,
}: DialogContentProps) {
  return (
    <BaseDialog.Portal>
      <BaseDialog.Backdrop className="fixed inset-0 z-50 min-h-dvh bg-[var(--color-overlay)] transition-opacity duration-200 ease-out data-ending-style:opacity-0 data-starting-style:opacity-0 supports-[-webkit-touch-callout:none]:absolute motion-reduce:transition-none" />
      <BaseDialog.Viewport className="fixed inset-0 z-50 flex overflow-y-auto overscroll-contain p-[var(--space-16)]">
        <BaseDialog.Popup
          aria-modal="true"
          className="border-border bg-background text-foreground m-auto box-border flex w-full max-w-[440px] shrink-0 flex-col gap-[var(--space-20)] rounded-[var(--radius-lg)] border p-[var(--space-24)] shadow-[var(--shadow-floating)] transition-[opacity,translate,scale] duration-200 ease-out outline-none data-ending-style:translate-y-[8px] data-ending-style:scale-[0.98] data-ending-style:opacity-0 data-starting-style:translate-y-[8px] data-starting-style:scale-[0.98] data-starting-style:opacity-0 motion-reduce:transition-none motion-reduce:data-ending-style:translate-y-0 motion-reduce:data-ending-style:scale-100 motion-reduce:data-starting-style:translate-y-0 motion-reduce:data-starting-style:scale-100"
        >
          <div className="flex items-start gap-0">
            <div className="flex min-w-0 flex-1 flex-col gap-[var(--space-4)]">
              <BaseDialog.Title className="tracking-[var(--tracking-title)] [overflow-wrap:anywhere] [font:var(--type-title)]">
                {title}
              </BaseDialog.Title>
              {description && (
                <BaseDialog.Description className="text-muted-foreground [overflow-wrap:anywhere] [font:var(--type-body-s)]">
                  {description}
                </BaseDialog.Description>
              )}
            </div>
            <BaseDialog.Close
              render={
                <IconButton aria-label="Закрыть">
                  <X strokeWidth={1.5} />
                </IconButton>
              }
            />
          </div>
          {children}
          {actions && (
            <div className="flex flex-wrap justify-end gap-[var(--space-8)]">
              {actions}
            </div>
          )}
        </BaseDialog.Popup>
      </BaseDialog.Viewport>
    </BaseDialog.Portal>
  );
}
