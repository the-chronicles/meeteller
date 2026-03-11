"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronsLeft,
  Lock,
} from "lucide-react";
import Image from "next/image";
import {
  IconCalendar,
  IconClipboardCheck,
  IconGear,
  IconHouse,
  IconMsgs,
  IconVideo,
  IconUsers,
} from "nucleo-glass";
import { IconArrowDoorOut3FillDuo18 } from "nucleo-ui-essential-fill-duo-18";

const mainNavItems = [
  { name: "Home", href: "/dashboard", icon: IconHouse },
  { name: "Meetings", href: "/meetings", icon: IconMsgs },
  { name: "Tasks", href: "/tasks", icon: IconClipboardCheck },
  { name: "Live", href: "/live", icon: IconVideo },
  { name: "Calendar", href: "/calendar", icon: IconCalendar },
];

const teamChildren = [
  { name: "Overview", href: "/teams" },
  { name: "Members", href: "/teams/members" },
  { name: "Invitations", href: "/teams/invitations" },
  { name: "Shared Meetings", href: "/teams/meetings" },
  { name: "Integrations", href: "/teams/integrations" },
  { name: "Settings", href: "/teams/settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  // later from backend/subscription
  const hasTeamsAccess = true;
  // const hasTeamsAccess = false;

  const [teamsOpen, setTeamsOpen] = useState(true);

  const teamsActive = useMemo(
    () => pathname.startsWith("/teams"),
    [pathname],
  );

  const handleLogout = async () => {
    await fetch("/auth/logout", { method: "POST" });
    window.location.href = "/";
  };

  const renderMainItem = ({
    name,
    href,
    icon: Icon,
  }: {
    name: string;
    href: string;
    icon: React.ComponentType<{ size?: number }>;
  }) => {
    const active = pathname.startsWith(href);

    return (
      <Link
        key={href}
        href={href}
        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
          active
            ? "bg-[#282828] text-white"
            : "text-white/80 hover:bg-[#282828]"
        } ${collapsed ? "justify-center" : ""}`}
      >
        <Icon size={23} />
        {!collapsed && <span className="whitespace-nowrap">{name}</span>}
      </Link>
    );
  };

  return (
    <aside
      className={`relative h-screen ${collapsed ? "w-20" : "w-64"} z-10 flex flex-col border-r border-white/10 bg-linear-to-b from-black via-[#0a0014] to-[#5b09c4] px-4 py-6 text-white shadow-xl backdrop-blur-2xl transition-all duration-300 ease-in-out`}
    >
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute top-18 -right-3 z-20 rounded-full bg-white p-1 text-black shadow-md"
      >
        <ChevronsLeft
          size={24}
          className={`${collapsed ? "rotate-180" : ""} transition-transform`}
        />
      </button>

      <div className="mb-16 flex justify-center">
        {!collapsed ? (
          <Image src="/logo-white.png" width={140} height={40} alt="logo" />
        ) : (
          <Image src="/icon.png" width={36} height={36} alt="logo" />
        )}
      </div>

      <div>
        {!collapsed && (
          <p className="mb-3 px-3 text-[11px] font-medium uppercase tracking-[0.12em] text-white/40">
            Workspace
          </p>
        )}

        <nav className="space-y-3">
          {mainNavItems.map(renderMainItem)}
        </nav>
      </div>

      <div className="my-8">
        {!collapsed && (
          <p className="mb-3 px-3 text-[11px] font-medium uppercase tracking-[0.12em] text-white/40">
            Collaboration
          </p>
        )}

        {!hasTeamsAccess ? (
          <Link
            href="/teams"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
              teamsActive
                ? "bg-[#282828] text-white"
                : "text-white/80 hover:bg-[#282828]"
            } ${collapsed ? "justify-center" : ""}`}
          >
            <div className="relative flex items-center">
              <IconUsers size={23} />
              {collapsed && (
                <span className="absolute -right-1 -top-1 rounded-full bg-white p-0.5 text-black">
                  <Lock size={8} />
                </span>
              )}
            </div>

            {!collapsed && (
              <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
                <span className="whitespace-nowrap">Teams</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-white/90">
                  <Lock size={10} />
                  Locked
                </span>
              </div>
            )}
          </Link>
        ) : (
          <div className="space-y-2">
            <button
              onClick={() => !collapsed && setTeamsOpen((v) => !v)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                teamsActive
                  ? "bg-[#282828] text-white"
                  : "text-white/80 hover:bg-[#282828]"
              } ${collapsed ? "justify-center" : ""}`}
            >
              <IconUsers size={23} />

              {!collapsed && (
                <>
                  <span className="flex-1 text-left whitespace-nowrap">Teams</span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${teamsOpen ? "rotate-180" : ""}`}
                  />
                </>
              )}
            </button>

            {!collapsed && teamsOpen && (
              <div className="ml-4 space-y-1 border-l border-white/10 pl-3">
                {teamChildren.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`block rounded-md px-3 py-2 text-sm transition ${
                        active
                          ? "bg-white/10 text-white"
                          : "text-white/70 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-auto space-y-4 pb-10">
        <Link
          href="/settings"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-white/90 hover:bg-white/10"
        >
          <IconGear size={23} />
          {!collapsed && "Settings"}
        </Link>

        <hr className="border-white/10" />

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-white/90 hover:bg-white/10"
        >
          <IconArrowDoorOut3FillDuo18 size={23} />
          {!collapsed && "Logout"}
        </button>
      </div>
    </aside>
  );
}