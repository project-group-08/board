export type ToastVariant = "success" | "error" | "loading" | "offline";

type ToastContent = {
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
  priority?: "low" | "high";
};

export type ToastOptions = ToastContent &
  (
    | { variant: "success" | "error"; durationMs?: number }
    | { variant: "loading" | "offline"; durationMs?: never }
  );

export type ToastUpdate = Partial<ToastContent> &
  (
    | { variant?: "success" | "error"; durationMs?: number }
    | { variant: "loading" | "offline"; durationMs?: never }
  );

type Entry = {
  id: string;
  options: ToastOptions;
  phase: "waiting" | "mounting" | "visible" | "ending";
  elapsed: number;
  startedAt: number;
};

type Bridge = {
  show: (id: string, options: ToastOptions) => void;
  update: (id: string, options: ToastOptions) => void;
  close: (id: string) => void;
};

function validateDuration(duration: number | undefined) {
  if (duration !== undefined && (!Number.isFinite(duration) || duration < 0)) {
    throw new RangeError(
      "durationMs должен быть конечным неотрицательным числом",
    );
  }
}

function validate(options: ToastOptions) {
  const duration = options.durationMs;
  validateDuration(duration);
  if (
    (options.variant === "loading" || options.variant === "offline") &&
    duration !== undefined
  ) {
    throw new TypeError("durationMs нельзя задавать для loading и offline");
  }
}

function limits(options: ToastOptions) {
  if (options.variant === "loading" || options.variant === "offline")
    return null;
  const duration = options.durationMs ?? (options.action ? 10000 : 5000);
  return { duration, protectedFor: options.durationMs ?? 3000 };
}

export class ToastScheduler {
  private entries: Entry[] = [];
  private pauses = new Set<string>();
  private timer: ReturnType<typeof setTimeout> | undefined;
  private sequence = 0;
  private bridge: Bridge | undefined;

  connect(bridge: Bridge) {
    this.bridge = bridge;
    this.schedule();
  }

  disconnect() {
    this.bridge = undefined;
    clearTimeout(this.timer);
  }

  add(options: ToastOptions) {
    validate(options);
    const id = `toast-${++this.sequence}`;
    this.entries.push({
      id,
      options,
      phase: "waiting",
      elapsed: 0,
      startedAt: 0,
    });
    this.schedule();
    return id;
  }

  update(id: string, update: ToastUpdate) {
    validateDuration(update.durationMs);
    if (
      (update.variant === "loading" || update.variant === "offline") &&
      update.durationMs !== undefined
    ) {
      throw new TypeError("durationMs нельзя задавать для loading и offline");
    }
    const entry = this.entries.find(
      (item) => item.id === id && item.phase !== "ending",
    );
    if (!entry) return;
    const options = { ...entry.options, ...update } as ToastOptions;
    if (
      (update.variant === "loading" || update.variant === "offline") &&
      !("durationMs" in update)
    ) {
      delete options.durationMs;
    }
    validate(options);
    entry.options = options;
    entry.elapsed = 0;
    entry.startedAt = Date.now();
    if (entry.phase !== "waiting") this.bridge?.update(id, options);
    this.schedule();
  }

  close(id: string) {
    const entry = this.entries.find((item) => item.id === id);
    if (!entry || entry.phase === "ending") return;
    if (entry.phase === "waiting") {
      this.entries = this.entries.filter((item) => item !== entry);
    } else {
      entry.phase = "ending";
      this.bridge?.close(id);
    }
    this.schedule();
  }

  shown(id: string) {
    const entry = this.entries.find(
      (item) => item.id === id && item.phase === "mounting",
    );
    if (!entry) return;
    entry.phase = "visible";
    entry.startedAt = Date.now();
    this.schedule();
  }

  removed(id: string) {
    this.entries = this.entries.filter((item) => item.id !== id);
    this.schedule();
  }

  pause(reason: string, paused: boolean) {
    const wasPaused = this.pauses.size > 0;
    if (paused) this.pauses.add(reason);
    else this.pauses.delete(reason);
    const isPaused = this.pauses.size > 0;
    if (wasPaused === isPaused) return;
    const now = Date.now();
    for (const entry of this.entries) {
      if (entry.phase !== "visible") continue;
      if (isPaused) entry.elapsed += now - entry.startedAt;
      else entry.startedAt = now;
    }
    this.schedule();
  }

  private schedule() {
    clearTimeout(this.timer);
    if (!this.bridge || this.pauses.size) return;
    // Отложенный запуск даёт Dialog зарегистрировать модальность до показа и объявления.
    this.timer = setTimeout(() => this.tick(), 0);
  }

  private tick() {
    const bridge = this.bridge;
    if (!bridge || this.pauses.size) return;
    const now = Date.now();
    for (const entry of this.entries) {
      const limit = limits(entry.options);
      if (
        entry.phase === "visible" &&
        limit &&
        entry.elapsed + now - entry.startedAt >= limit.duration
      ) {
        entry.phase = "ending";
        bridge.close(entry.id);
      }
    }
    let occupied = this.entries.filter(
      (entry) => entry.phase !== "waiting",
    ).length;
    for (const entry of this.entries) {
      if (occupied >= 3) break;
      if (entry.phase !== "waiting") continue;
      entry.phase = "mounting";
      occupied++;
      bridge.show(entry.id, entry.options);
    }
    const waiting = this.entries.some((entry) => entry.phase === "waiting");
    const ending = this.entries.some((entry) => entry.phase === "ending");
    if (waiting && occupied >= 3 && !ending) {
      const candidate = this.entries.find((entry) => {
        const limit = limits(entry.options);
        return (
          entry.phase === "visible" &&
          limit &&
          entry.elapsed + now - entry.startedAt >= limit.protectedFor
        );
      });
      if (candidate) {
        candidate.phase = "ending";
        bridge.close(candidate.id);
      }
    }
    let next = Infinity;
    for (const entry of this.entries) {
      const limit = limits(entry.options);
      if (entry.phase !== "visible" || !limit) continue;
      const elapsed = entry.elapsed + now - entry.startedAt;
      next = Math.min(next, limit.duration - elapsed);
      if (waiting && !ending && occupied >= 3)
        next = Math.min(next, Math.max(0, limit.protectedFor - elapsed));
    }
    if (Number.isFinite(next))
      this.timer = setTimeout(
        () => this.tick(),
        Math.max(0, Math.min(next, 2147483647)),
      );
  }
}
