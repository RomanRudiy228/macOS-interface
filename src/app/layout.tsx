import type { Metadata } from "next";
import "./globals.css";
import { DockMenu } from "@/components/dock-menu/dock-menu";

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
        <DockMenu />
      </body>
    </html>
  );
}
