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
      className={`h-screen w-screen flex items-center justify-center transition-all duration-500 ${bgClass}`}
      style={bgStyle}
    >
      {/* DASHBOARD CARD */}
      <div
        className="w-[95%] h-[95%] rounded-2xl shadow-2xl overflow-hidden flex bg-white/80 backdrop-blur-xl"
        style={{ backdropFilter: `blur(${settings.blur}px)` }}
      >
        <Sidebar />

        <div className="flex-1 flex flex-col">
          <Topbar />
          <main className="flex-1 overflow-auto p-4 bg-white/60">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
