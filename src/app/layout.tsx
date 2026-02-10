import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { ThemeProvider } from "@/provider/theme-provider";
import { DockMenuWrapper } from "@/components/dock-menu";
import { TooltipProvider } from "@/components/tooltip";

export const metadata: Metadata = {
  title: "macOS Interface",
  description: "macOS Interface built with Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk" suppressHydrationWarning>
      <body className="min-h-screen">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider delayDuration={100}>
            {children}

            <Suspense fallback={null}>
              <DockMenuWrapper />
            </Suspense>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
