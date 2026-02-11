import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { ThemeProvider } from "@/provider/theme-provider";
import { getWallpapers } from "@/actions/wallpapers-get";
import { getSettings } from "@/actions/settings-get";
import { WindowsProvider, WallpaperProvider } from "@/contexts";
import { DesktopBackground } from "@/components/desktop-background";
import { WindowsLayer } from "@/components/windows-layer";
import { DockMenuWrapper } from "@/components/dock-menu";
import { TooltipProvider } from "@/components/tooltip";

export const metadata: Metadata = {
  title: "macOS Interface",
  description: "macOS Interface built with Next.js",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Весь код отримання даних та return має бути всередині цієї функції
  const [wallpapers, settings] = await Promise.all([
    getWallpapers(),
    getSettings(),
  ]);

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
            <WindowsProvider>
              <WallpaperProvider
                initialWallpapers={wallpapers}
                initialWallpaperId={settings.wallpaperId}
              >
                <DesktopBackground>
                  {children}
                  <Suspense fallback={null}>
                    <DockMenuWrapper />
                  </Suspense>
                  <WindowsLayer />
                </DesktopBackground>
              </WallpaperProvider>
            </WindowsProvider>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
