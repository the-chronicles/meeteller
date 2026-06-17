/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { useContext } from "react";
import { AuthContext } from "@/context/auth-context";

import Image from "next/image";
import {
  CaretDown,
  CaretLeft,
  Lock,
  List,
  X,
  House,
  Chat,
  ClipboardText,
  VideoCamera,
  Calendar,
  Users,
  Gear,
  SignOut,
} from "@phosphor-icons/react";

const mainNavItems = [
  { name: "Home", href: "/dashboard", icon: House },
  { name: "Meetings", href: "/meetings", icon: Chat },
  { name: "Tasks", href: "/tasks", icon: ClipboardText },
  { name: "Live", href: "/live", icon: VideoCamera },
  { name: "Calendar", href: "/calendar", icon: Calendar },
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
  const auth = useContext(AuthContext);

  const pathname = usePathname();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // later from backend/subscription
  const hasTeamsAccess = true;
  // const hasTeamsAccess = false;

  const [teamsOpen, setTeamsOpen] = useState(true);

  const teamsActive = useMemo(() => pathname.startsWith("/teams"), [pathname]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

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
            : "text-black/80 hover:bg-[#282828] dark:text-white/80"
        } ${collapsed ? "justify-center" : ""}`}
      >
        <Icon size={23} />
        {!collapsed && <span className="whitespace-nowrap">{name}</span>}
      </Link>
    );
  };

  const sidebarInner = (
    <div
      className={`relative flex h-full flex-col border-r border-black/10 bg-transparent px-4 py-6 text-black shadow-xl transition-all duration-300 ease-in-out dark:border-white/10 dark:text-white ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Collapse button - desktop only */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute top-16 -right-3 z-50 hidden rounded-full bg-white p-1 text-black shadow-md lg:block dark:bg-white/10 dark:text-white"
      >
        <CaretLeft
          size={24}
          className={`${collapsed ? "rotate-180" : ""} transition-transform`}
        />
      </button>

      {/* Mobile close button */}
      <button
        onClick={() => setMobileOpen(false)}
        className="absolute top-4 right-4 rounded-lg p-2 text-black/80 hover:bg-black/5 lg:hidden dark:text-white/80 dark:hover:bg-white/10"
      >
        <X size={20} />
      </button>

      {/* Logo */}
      <div className="mb-10 flex shrink-0 justify-center lg:mb-16">
        {!collapsed ? (
          <>
            <Image
              src="/logo-black.png"
              width={140}
              height={40}
              alt="logo"
              className="block dark:hidden"
            />
            <Image
              src="/logo-white.png"
              width={140}
              height={40}
              alt="logo"
              className="hidden dark:block"
            />
          </>
        ) : (
          <Image
            src="/icon.png"
            width={36}
            height={36}
            alt="logo"
            className="dark:invert"
          />
        )}
      </div>

      {/* Scrollable middle content */}
      <div className="min-h-0 flex-1 overflow-y-auto pr-1">
        <div>
          {!collapsed && (
            <p className="mb-3 px-3 text-[11px] font-medium tracking-[0.12em] text-black/40 uppercase dark:text-white/40">
              Workspace
            </p>
          )}

          <nav className="space-y-3">{mainNavItems.map(renderMainItem)}</nav>
        </div>

        <div className="my-8">
          {!collapsed && (
            <p className="mb-3 px-3 text-[11px] font-medium tracking-[0.12em] text-black/40 uppercase dark:text-white/40">
              Collaboration
            </p>
          )}

          {!hasTeamsAccess ? (
            <Link
              href="/teams"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                teamsActive
                  ? "bg-[#282828] text-white"
                  : "text-black/80 hover:bg-[#282828] dark:text-white/80"
              } ${collapsed ? "justify-center" : ""}`}
            >
              <div className="relative flex items-center">
                <Users size={23} />
                {collapsed && (
                  <span className="absolute -top-1 -right-1 rounded-full bg-white p-0.5 text-black">
                    <Lock size={8} />
                  </span>
                )}
              </div>

              {!collapsed && (
                <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
                  <span className="whitespace-nowrap">Teams</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-black/90 dark:text-white/90">
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
                    : "text-black/80 hover:bg-[#282828] dark:text-white/80"
                } ${collapsed ? "justify-center" : ""}`}
              >
                <Users size={23} />

                {!collapsed && (
                  <>
                    <span className="flex-1 text-left whitespace-nowrap">
                      Teams
                    </span>
                    <CaretDown
                      size={16}
                      className={`transition-transform ${
                        teamsOpen ? "rotate-180" : ""
                      }`}
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
                            : "text-black/70 hover:bg-white/5 hover:text-white dark:text-white/70"
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
      </div>

      {/* Bottom actions */}
      <div className="mt-4 mb-3 shrink-0 space-y-4 border-t border-black/10 pt-4 pb-2 dark:border-white/10">
        <Link
          href="/settings"
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-black/90 hover:bg-black/5 dark:text-white/90 dark:hover:bg-white/10 ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <Gear size={23} />
          {!collapsed && "Settings"}
        </Link>

        <button
          onClick={auth?.logout}
          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-black/90 hover:bg-black/5 dark:text-white/90 dark:hover:bg-white/10 ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <SignOut size={23} />
          {!collapsed && "Logout"}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile trigger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 rounded-lg bg-white p-2 text-black shadow-lg lg:hidden dark:bg-[#0a0014] dark:text-white"
      >
        <List size={20} />
      </button>

      {/* Desktop sidebar */}
      <div className="hidden h-screen lg:block">{sidebarInner}</div>

      {/* Mobile / tablet overlay drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0">{sidebarInner}</div>
        </div>
      )}
    </>
  );
}
