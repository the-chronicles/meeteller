"use client";

import { useTheme } from "next-themes";
import { Search } from "lucide-react";
import { useUser } from "@/context/UserProvider";
import { useEffect, useState } from "react";
import { SearchDialog } from "./components/SearchDialog";
import { ThemeSwitch } from "./components/ThemeSwitch";

export function Topbar() {
  const { loading } = useUser();
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }

      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  if (loading) return null;

  return (
    <>
      <div className="sticky top-0 z-40">
        <div className="flex items-center justify-between bg-white/60 px-6 py-6 backdrop-blur-xl dark:bg-black">
          <button
            onClick={() => setOpen(true)}
            className="flex items-center justify-center gap-2 hover:cursor-pointer"
          >
            <Search className="h-5 w-5 text-[#282828] opacity-70 dark:text-[#ffffff]" />
            <span className="text-gray-500 dark:text-gray-400">Ctrl/⌘ + K</span>
          </button>

          <div className="flex-1" />

          <ThemeSwitch theme={theme} setTheme={setTheme} />
        </div>
      </div>

      {open && <SearchDialog onClose={() => setOpen(false)} />}
    </>
  );
}
