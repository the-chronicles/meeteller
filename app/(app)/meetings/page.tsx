"use client";

import { useMemo, useState } from "react";
import { MeetingsHeader } from "./components/meetings-header";
import { MeetingsTable } from "./components/meetings-table";

export type MeetingStatus = "processing" | "completed";

export type Meeting = {
  id: string;
  title: string;
  startISO: string;      // ✅ real date/time
  durationMin: number;   // ✅ numeric duration
  status: MeetingStatus;
  summary?: string;
};

const initialMeetings: Meeting[] = [
  {
    id: "1",
    title: "Product Sync",
    startISO: new Date().toISOString(),
    durationMin: 45,
    status: "completed",
    summary: "Weekly alignment on priorities and blockers.",
  },
  {
    id: "2",
    title: "Engineering Standup",
    startISO: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    durationMin: 15,
    status: "processing",
    summary: "Daily updates across engineering teams.",
  },
  {
    id: "3",
    title: "Client Review",
    startISO: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    durationMin: 60,
    status: "completed",
    summary: "Review deliverables and next steps.",
  },
];

export default function MeetingsPage() {
  const [query, setQuery] = useState("");
  const [meetings, setMeetings] = useState<Meeting[]>(initialMeetings);
  const [openCreate, setOpenCreate] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return meetings;

    return meetings.filter((m) => {
      const start = new Date(m.startISO).toLocaleString().toLowerCase();
      return (
        m.title.toLowerCase().includes(q) ||
        (m.summary || "").toLowerCase().includes(q) ||
        start.includes(q)
      );
    });
  }, [meetings, query]);

  const createMeeting = (m: Omit<Meeting, "id">) => {
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : String(Date.now());

    setMeetings((prev) => [{ id, ...m }, ...prev]);
  };

  return (
    <div className="space-y-6">
      <MeetingsHeader
        query={query}
        setQuery={setQuery}
        onNewMeeting={() => setOpenCreate(true)}
      />

      <MeetingsTable
        meetings={filtered}
        openCreate={openCreate}
        setOpenCreate={setOpenCreate}
        onCreate={createMeeting}
      />
    </div>
  );
}