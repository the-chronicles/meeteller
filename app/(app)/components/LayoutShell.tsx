"use client";

import { useUISettings } from "@/context/UISettingsProvider";
import { Sidebar } from "@/app/(app)/layouts/sidebar";
import { Topbar } from "@/app/(app)/layouts/topbar";

export default function LayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const { settings } = useUISettings();

  const bgClass =
    settings.bgType === "gradient"
      ? `bg-gradient-to-br ${settings.bgValue}`
      : settings.bgType === "color"
        ? ""
        : "bg-cover bg-center";

  const bgStyle =
    settings.bgType === "color"
      ? { backgroundColor: settings.bgValue }
      : settings.bgType === "image"
        ? { backgroundImage: `url(${settings.bgValue})` }
        : {};

  return (
    <div
      className={`flex h-screen w-screen items-center justify-center transition-all duration-500 ${bgClass}`}
      style={bgStyle}
    >
      {/* DASHBOARD CARD */}
      <div
        className="flex h-full w-full overflow-hidden rounded-none border-0 bg-white/80 shadow-2xl backdrop-blur-xl lg:h-[95%] lg:w-[95%] lg:rounded-2xl dark:border-white/10 dark:bg-zinc-950/80 lg:dark:border"
        style={{ backdropFilter: `blur(${settings.blur}px)` }}
      >
        <Sidebar />

        <div className="flex flex-1 flex-col">
          <Topbar />
          <main className="flex-1 overflow-auto bg-white/60 p-4 dark:bg-zinc-950/45">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
