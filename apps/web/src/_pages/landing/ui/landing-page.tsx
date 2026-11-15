export function LandingPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center p-6">
      <section
        aria-labelledby="welcome-title"
        className="border-border bg-card flex w-full max-w-2xl flex-col gap-6 rounded-3xl border p-8 sm:p-12"
      >
        <p className="text-primary text-sm font-semibold tracking-widest uppercase">
          Tabula
        </p>
        <h1
          id="welcome-title"
          className="text-4xl font-semibold tracking-tight sm:text-5xl"
        >
          Пространство для совместных идей
        </h1>
        <p className="text-muted-foreground text-lg leading-relaxed">
          Интерактивные доски для заметок, обсуждений и работы команды.
        </p>
        <p className="text-muted-foreground text-sm">
          Мы готовим первую версию. Скоро здесь можно будет создать свою доску.
        </p>
      </section>
    </main>
  );
}
