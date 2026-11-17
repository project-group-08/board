import type { ReactNode } from "react";
import "@fontsource-variable/geist";
import "@fontsource-variable/geist-mono";

import "../styles/globals.css";

export function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <body className="bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
