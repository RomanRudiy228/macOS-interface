import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { AppShell } from "@/components/app-shell";
import { DockMenuWrapper } from "@/components/dock-menu";
import { TooltipProvider } from "@/components/tooltip";

export const metadata: Metadata = {
  title: "macOS Interface",
  description: "macOS Interface built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk">
      <body className="min-h-screen bg-gray-800">
        <TooltipProvider delayDuration={100}>
          <AppShell>
            {children}
            <Suspense fallback={null}>
              <DockMenuWrapper />
            </Suspense>
          </AppShell>
        </TooltipProvider>
      </body>
    </html>
  );
}
