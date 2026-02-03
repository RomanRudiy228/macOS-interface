import type { Metadata } from "next";
import "./globals.css";
import { DockMenuWrapper } from "@/components/dock-menu/dock-menu-wrapper";

export const metadata: Metadata = {
  title: "macOS Interface",
  description: "macOS Interface built with Next.js",
  icons: {
    icon: "/favicon/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk">
      <body className="min-h-screen">
        {children}
        <DockMenuWrapper />
      </body>
    </html>
  );
}
