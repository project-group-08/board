"use client";

import { Toast as BaseToast } from "@base-ui/react/toast";
import { Check, LoaderCircle, WifiOff, X } from "lucide-react";
import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";

import { ModalContext } from "./modal-context";
import { ToastScheduler } from "./toast-scheduler";
import type { ToastOptions, ToastUpdate } from "./toast-scheduler";

export type ToastPosition =
  | "bottom-right"
  | "bottom-left"
  | "top-right"
  | "top-left";
export type ToastProviderProps = {
  children: ReactNode;
  position?: ToastPosition;
};

type ToastApi = {
  add: (options: ToastOptions) => string;
  update: (id: string, options: ToastUpdate) => void;
  close: (id: string) => void;
};

const ToastContext = createContext<ToastApi | null>(null);

export function useToast(): ToastApi {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast требует ToastProvider");
  return context;
}

export function ToastProvider({
  children,
  position = "bottom-right",
}: ToastProviderProps) {
  return (
    <BaseToast.Provider timeout={0}>
      <ToastRuntime position={position}>{children}</ToastRuntime>
    </BaseToast.Provider>
  );
}

function ToastRuntime({ children, position }: Required<ToastProviderProps>) {
  const manager = BaseToast.useToastManager<ToastOptions>();
  const { add: baseAdd, update: baseUpdate, close: baseClose } = manager;
  const [scheduler] = useState(() => new ToastScheduler());
  const [modalCount, setModalCount] = useState(0);
  const modals = useRef(new Set<symbol>());
  const modalContext = useMemo(
    () => ({
      enter() {
        const id = Symbol();
        modals.current.add(id);
        scheduler.pause("dialog", true);
        scheduler.pause("hover", false);
        scheduler.pause("focus", false);
        setModalCount(modals.current.size);
        return () => {
          if (!modals.current.delete(id)) return;
          scheduler.pause("dialog", modals.current.size > 0);
          setModalCount(modals.current.size);
        };
      },
    }),
    [scheduler],
  );
  const api = useMemo<ToastApi>(
    () => ({
      add: (options) => scheduler.add(options),
      update: (id, options) => scheduler.update(id, options),
      close: (id) => scheduler.close(id),
    }),
    [scheduler],
  );

  useEffect(() => {
    scheduler.connect({
      show: (id, options) =>
        baseAdd({
          id,
          title: options.title,
          description: options.description,
          type: options.variant,
          priority: options.priority,
          data: options,
          timeout: 0,
          onRemove: () => scheduler.removed(id),
        }),
      update: (id, options) =>
        baseUpdate(id, {
          title: options.title,
          description: options.description,
          type: options.variant,
          priority: options.priority,
          data: options,
          timeout: 0,
        }),
      close: (id) => baseClose(id),
    });
    return () => scheduler.disconnect();
  }, [scheduler, baseAdd, baseUpdate, baseClose]);

  useEffect(() => {
    const visibility = () => scheduler.pause("visibility", document.hidden);
    const blur = () => scheduler.pause("window", true);
    const focus = () => scheduler.pause("window", false);
    visibility();
    document.addEventListener("visibilitychange", visibility);
    window.addEventListener("blur", blur);
    window.addEventListener("focus", focus);
    return () => {
      document.removeEventListener("visibilitychange", visibility);
      window.removeEventListener("blur", blur);
      window.removeEventListener("focus", focus);
    };
  }, [scheduler]);

  return (
    <ToastContext.Provider value={api}>
      <ModalContext.Provider value={modalContext}>
        {children}
        {modalCount === 0 && (
          <BaseToast.Portal>
            <BaseToast.Viewport
              aria-label="Уведомления"
              onMouseEnter={() => scheduler.pause("hover", true)}
              onMouseLeave={() => scheduler.pause("hover", false)}
              onFocus={() => scheduler.pause("focus", true)}
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget))
                  scheduler.pause("focus", false);
              }}
              className={`fixed z-[60] flex w-[calc(100vw-32px)] max-w-[440px] gap-[var(--space-8)] outline-none ${position.startsWith("bottom") ? "bottom-[var(--space-16)] flex-col-reverse" : "top-[var(--space-16)] flex-col"} ${position.endsWith("right") ? "right-[var(--space-16)]" : "left-[var(--space-16)]"}`}
            >
              {manager.toasts.map((toast) => (
                <ToastItem key={toast.id} toast={toast} scheduler={scheduler} />
              ))}
            </BaseToast.Viewport>
          </BaseToast.Portal>
        )}
      </ModalContext.Provider>
    </ToastContext.Provider>
  );
}

function ToastItem({
  toast,
  scheduler,
}: {
  toast: BaseToast.Root.ToastObject<ToastOptions>;
  scheduler: ToastScheduler;
}) {
  useLayoutEffect(() => {
    scheduler.shown(toast.id);
  }, [scheduler, toast.id]);
  const options = toast.data;
  if (!options) return null;
  const icon =
    options.variant === "success" ? (
      <span className="text-background flex size-5 items-center justify-center rounded-full bg-[var(--color-success)]">
        <Check size={14} strokeWidth={1.5} />
      </span>
    ) : options.variant === "error" ? (
      <span className="bg-destructive text-background flex size-5 items-center justify-center rounded-full">
        <X size={14} strokeWidth={1.5} />
      </span>
    ) : options.variant === "loading" ? (
      <LoaderCircle
        className="text-muted-foreground size-5 animate-spin motion-reduce:animate-none"
        strokeWidth={1.5}
      />
    ) : (
      <WifiOff className="text-muted-foreground size-5" strokeWidth={1.5} />
    );
  return (
    <BaseToast.Root
      toast={toast}
      swipeDirection={[]}
      className="bg-background border-border text-foreground box-border flex w-full flex-wrap items-center gap-x-[var(--space-8)] gap-y-[var(--space-8)] rounded-[var(--radius-md)] border p-[var(--space-12)] shadow-[var(--shadow-floating)] transition-[opacity,translate] duration-200 ease-out outline-none data-ending-style:translate-y-[8px] data-ending-style:opacity-0 data-starting-style:translate-y-[8px] data-starting-style:opacity-0 motion-reduce:transition-none motion-reduce:data-ending-style:translate-y-0 motion-reduce:data-starting-style:translate-y-0"
    >
      <span aria-hidden="true" className="shrink-0">
        {icon}
      </span>
      <div className="flex min-w-[min(100%,120px)] flex-1 flex-col [overflow-wrap:anywhere]">
        <BaseToast.Title className="[font:var(--type-label)]" />
        {options.description && (
          <BaseToast.Description className="text-muted-foreground [font:var(--type-caption)]" />
        )}
      </div>
      {options.action && (
        <BaseToast.Action
          className="hover:bg-muted-hover max-w-full rounded-[var(--radius-sm)] px-[var(--space-8)] py-[var(--space-4)] text-left [overflow-wrap:anywhere] outline-none [font:var(--type-label)] focus-visible:shadow-[var(--shadow-focus)]"
          onClick={() => {
            scheduler.close(toast.id);
            options.action?.onClick();
          }}
        >
          {options.action.label}
        </BaseToast.Action>
      )}
    </BaseToast.Root>
  );
}
