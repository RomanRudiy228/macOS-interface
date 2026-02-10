import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
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
      <body className="min-h-screen">
        <TooltipProvider delayDuration={100}>
          <div className="relative z-10 min-h-screen">{children}</div>
          <Suspense fallback={null}>
            <DockMenuWrapper />
          </Suspense>
        </TooltipProvider>
      </body>
    </html>
  );
}
