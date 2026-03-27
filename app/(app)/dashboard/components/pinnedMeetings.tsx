"use client";

import Link from "next/link";
import { Mic } from "lucide-react";
import clsx from "clsx";
// import { PIN_STYLES } from "./pinnedColors";
import { RealisticPin } from "./RealisticPin";
import { PIN_STYLES } from "@/lib/pinnedColors";

const pinnedMeetings = [
  {
    id: "1",
    title: "Product Sync",
    date: "Today • 10:00 AM",
    color: "green",
    rotate: "-rotate-2",
  },
  {
    id: "2",
    title: "Engineering Standup",
    date: "Yesterday • 4:30 PM",
    color: "purple",
    rotate: "rotate-1",
  },
  {
    id: "3",
    title: "Client Review",
    date: "Mon • 1:00 PM",
    color: "blue",
    rotate: "-rotate-1",
  },
];

export default function PinnedMeetings() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-black">
      {/* <h3 className="mb-4 text-sm font-semibold">Pinned Meetings</h3> */}

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
        {pinnedMeetings.map((m) => {
          const style = PIN_STYLES[m.color as keyof typeof PIN_STYLES];

          return (
            <Link
              key={m.id}
              href={`/meetings/${m.id}`}
              className={clsx(
                "relative rounded-xl p-4",
                "bg-linear-to-br",
                style.card,
                style.glow,
                "shadow-lg transition hover:shadow-xl",
                "animate-pin-drop",
                m.rotate,
              )}
            >
              <RealisticPin color={style.pin} />

              <div className="mt-6 flex items-start gap-3">
                <Mic size={18} className="text-gray-400" />
                <div>
                  <p className="font-medium md:text-xs lg:text-[12px]">
                    {m.title}
                  </p>
                  <p className="text-gray-600 md:text-xs lg:text-[12px]">
                    {m.date}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
