"use client";

import Link from "next/link";
import { Mic, Pin, PinOff } from "lucide-react";
import { useState } from "react";

type Meeting = {
  id: string;
  title: string;
  date: string;
  pinned?: boolean;
};

const initialMeetings: Meeting[] = [
  {
    id: "1",
    title: "Product Sync",
    date: "Today • 10:00 AM",
  },
  {
    id: "2",
    title: "Engineering Standup",
    date: "Yesterday • 4:30 PM",
  },
  {
    id: "3",
    title: "Client Review",
    date: "Mon • 1:00 PM",
  },
];

export function RecentMeetings() {
  const [meetings, setMeetings] = useState(initialMeetings);

  const togglePin = (id: string) => {
    setMeetings((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, pinned: !m.pinned } : m
      )
    );
  };

  return (
    <div className="rounded-xl bg-white dark:bg-black border-gray-200 dark:border-white/10 shadow-sm">
      <div className="divide-y">
        {meetings.map((meeting) => (
          <Link
            key={meeting.id}
            href={`/meetings/${meeting.id}`}
            className="
              group flex items-center gap-3 px-4 py-3
              transition hover:bg-gray-50 dark:hover:bg-white/5
            "
          >
            <Mic size={18} className="text-gray-400" />

            <div>
              <p className="text-sm font-medium dark:text-white">
                {meeting.title}
              </p>
              <p className="text-xs text-[#8c8b8b]">
                {meeting.date}
              </p>
            </div>

            {/* PIN / UNPIN */}
            <button
              onClick={(e) => {
                e.preventDefault();
                togglePin(meeting.id);
              }}
              className="
                ml-auto rounded-md p-1
                opacity-0 group-hover:opacity-100
                transition hover:bg-black/5 dark:hover:bg-white/10
              "
              title={meeting.pinned ? "Unpin" : "Pin"}
            >
              {meeting.pinned ? (
                <PinOff size={16} />
              ) : (
                <Pin size={16} />
              )}
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
}
