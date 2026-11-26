import type { ReactNode } from "react";
import "@fontsource-variable/geist";
import "@fontsource-variable/geist-mono";

import { ThemeProvider } from "../providers/theme-provider";
import { ToastProvider } from "@/shared/ui/toast";

import "../styles/globals.css";


export function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className="bg-background text-foreground antialiased">
        <ThemeProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
