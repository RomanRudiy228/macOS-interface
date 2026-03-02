import { Suspense } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getWallpapers } from "@/actions/wallpapers-get";
import { getSettings } from "@/actions/settings-get";
import { Menubar } from "@/components/menu-bar/menu-bar";
import { WindowsProvider, WallpaperProvider } from "@/contexts";
import { DesktopBackground } from "@/components/desktop-background";
import { WindowsLayer } from "@/components/windows-layer";
import { DockMenuWrapper } from "@/components/dock-menu";
import { TooltipProvider } from "@/components/tooltip";
import { createClient } from "@/supabase/server";

export default async function DesktopPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [wallpapers, settings] = await Promise.all([
    getWallpapers(),
    getSettings(),
  ]);

  return (
    <TooltipProvider delayDuration={100}>
      <WindowsProvider>
        <WallpaperProvider
          initialWallpapers={wallpapers}
          initialWallpaperId={settings.wallpaperId}
        >
          <DesktopBackground>
            <main className="flex min-h-screen flex-col items-center justify-center p-24">
              <Menubar />
            </main>
            <Suspense fallback={null}>
              <DockMenuWrapper />
            </Suspense>
            <WindowsLayer />
          </DesktopBackground>
        </WallpaperProvider>
      </WindowsProvider>
    </TooltipProvider>
  );
}
