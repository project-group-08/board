import type { ReactNode } from "react";
import "@fontsource-variable/geist";
import "@fontsource-variable/geist-mono";

import { ToastProvider } from "@/shared/ui/toast";

import "../styles/globals.css";

export function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <body className="bg-background text-foreground antialiased">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
