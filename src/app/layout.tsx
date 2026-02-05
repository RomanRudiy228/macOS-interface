import type { Metadata } from "next";
import "./globals.css";
import { DockMenuWrapper } from "@components/dock-menu";
import { TooltipProvider } from "@shared";

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
          {children}
          <DockMenuWrapper />
        </TooltipProvider>
      </body>
    </html>
  );
}
