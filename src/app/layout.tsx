import type { Metadata } from "next";
import "./globals.css";

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
        <div className="relative z-10 min-h-screen">{children}</div>
      </body>
    </html>
  );
}
