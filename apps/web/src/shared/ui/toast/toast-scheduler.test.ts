import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ToastScheduler } from "./toast-scheduler";
import type { ToastOptions } from "./toast-scheduler";

describe("ToastScheduler", () => {
  let scheduler: ToastScheduler;
  let shown: { id: string; options: ToastOptions }[];
  let closed: string[];
  let updates: { id: string; options: ToastOptions }[];

  beforeEach(() => {
    vi.useFakeTimers();
    shown = [];
    closed = [];
    updates = [];
    scheduler = new ToastScheduler();
    scheduler.connect({
      show: (id, options) => {
        shown.push({ id, options });
        scheduler.shown(id);
      },
      update: (id, options) => updates.push({ id, options }),
      close: (id) => {
        closed.push(id);
        setTimeout(() => scheduler.removed(id), 200);
      },
    });
  });

  afterEach(() => {
    scheduler.disconnect();
    vi.useRealTimers();
  });

  const success = (title: string) => ({ variant: "success" as const, title });
  const advance = (ms: number) => vi.advanceTimersByTime(ms);

  it("показывает три и вытесняет старейшее после трёх секунд, освобождая место после выхода", () => {
    const first = scheduler.add(success("1"));
    scheduler.add(success("2"));
    scheduler.add(success("3"));
    const fourth = scheduler.add(success("4"));
    advance(0);
    expect(shown.map((item) => item.options.title)).toEqual(["1", "2", "3"]);
    advance(2999);
    expect(closed).toEqual([]);
    advance(1);
    expect(closed).toEqual([first]);
    expect(shown).toHaveLength(3);
    advance(201);
    expect(shown.at(-1)?.id).toBe(fourth);
  });

  it("не зацикливает таймеры при ожидании завершения вытеснения", () => {
    const timeouts = vi.spyOn(globalThis, "setTimeout");
    scheduler.add(success("1"));
    scheduler.add(success("2"));
    scheduler.add(success("3"));
    scheduler.add(success("4"));
    advance(0);
    advance(2999);
    timeouts.mockClear();
    advance(101);
    const immediate = timeouts.mock.calls.filter(([, delay]) => delay === 0);
    expect(immediate.length).toBeLessThanOrEqual(1);
    expect(closed).toHaveLength(1);
    expect(shown).toHaveLength(3);
    advance(101);
    expect(shown.at(-1)?.options.title).toBe("4");
  });

  it("учитывает 5 и 10 секунд, явный durationMs и нулевую длительность", () => {
    const plain = scheduler.add(success("обычное"));
    const action = scheduler.add({
      ...success("действие"),
      action: { label: "Отменить", onClick() {} },
    });
    const zero = scheduler.add({ ...success("ноль"), durationMs: 0 });
    advance(1);
    expect(closed).toEqual([zero]);
    advance(4999);
    expect(closed).toContain(plain);
    expect(closed).not.toContain(action);
    advance(5000);
    expect(closed).toContain(action);
  });

  it("защищает заданную длительность от вытеснения", () => {
    const first = scheduler.add({ ...success("долгое"), durationMs: 9000 });
    scheduler.add({ ...success("два"), durationMs: 9000 });
    scheduler.add({ ...success("три"), durationMs: 9000 });
    scheduler.add(success("ожидает"));
    advance(0);
    advance(8999);
    expect(closed).not.toContain(first);
    advance(1);
    expect(closed).toContain(first);
  });

  it("не вытесняет постоянные, обновляет или закрывает ожидающие без показа", () => {
    const first = scheduler.add({ variant: "loading", title: "1" });
    scheduler.add({ variant: "offline", title: "2" });
    scheduler.add({ variant: "loading", title: "3" });
    const waiting = scheduler.add(success("ожидание"));
    const cancelled = scheduler.add(success("отменено"));
    scheduler.update(waiting, { title: "обновлено" });
    scheduler.close(cancelled);
    advance(30000);
    expect(closed).toEqual([]);
    expect(shown).toHaveLength(3);
    scheduler.close(first);
    advance(201);
    expect(shown.at(-1)?.options.title).toBe("обновлено");
    expect(shown.some((item) => item.id === cancelled)).toBe(false);
  });

  it("сбрасывает часы при обновлении и снимает таймер у постоянного статуса", () => {
    const id = scheduler.add({ ...success("до"), durationMs: 1000 });
    advance(0);
    advance(900);
    scheduler.update(id, { variant: "loading", title: "работает" });
    advance(10000);
    expect(closed).toEqual([]);
    scheduler.update(id, {
      variant: "success",
      title: "готово",
      durationMs: 2000,
    });
    advance(1999);
    expect(closed).toEqual([]);
    advance(1);
    expect(closed).toEqual([id]);
    expect(updates.map((item) => item.options.variant)).toEqual([
      "loading",
      "success",
    ]);
  });

  it("пауза приостанавливает часы и показ очереди до снятия всех причин", () => {
    const first = scheduler.add(success("1"));
    scheduler.add(success("2"));
    scheduler.add(success("3"));
    scheduler.add(success("4"));
    advance(0);
    advance(1000);
    scheduler.pause("hover", true);
    scheduler.pause("dialog", true);
    advance(10000);
    scheduler.pause("hover", false);
    advance(10000);
    expect(closed).toEqual([]);
    scheduler.pause("dialog", false);
    advance(1999);
    expect(closed).toEqual([]);
    advance(1);
    expect(closed).toEqual([first]);
  });

  it("обновление видимого уведомления заново запускает защиту от вытеснения", () => {
    const first = scheduler.add(success("первое"));
    scheduler.add({ variant: "loading", title: "занято" });
    scheduler.add({ variant: "offline", title: "занято" });
    scheduler.add(success("очередь"));
    advance(0);
    advance(2500);
    scheduler.update(first, { title: "обновлено" });
    advance(2999);
    expect(closed).toEqual([]);
    advance(1);
    expect(closed).toEqual([first]);
  });

  it("отклоняет недопустимые значения и durationMs у постоянных статусов", () => {
    for (const durationMs of [-1, NaN, Infinity]) {
      expect(() => scheduler.add({ ...success("ошибка"), durationMs })).toThrow(
        RangeError,
      );
      expect(() => scheduler.update("отсутствует", { durationMs })).toThrow(
        RangeError,
      );
    }
    const invalid: ToastOptions = JSON.parse(
      '{"variant":"loading","title":"ошибка","durationMs":0}',
    );
    expect(() => scheduler.add(invalid)).toThrow(TypeError);
    const id = scheduler.add(success("обычное"));
    const invalidUpdate = JSON.parse('{"variant":"offline","durationMs":1}');
    expect(() => scheduler.update(id, invalidUpdate)).toThrow(TypeError);
  });
});
