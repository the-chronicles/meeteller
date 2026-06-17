"use client";

import { useMemo, useState } from "react";

import AppLoader from "@/components/ui/AppLoader";

import { useMeetings } from "@/hooks/useMeetings";

import { MeetingsHeader } from "./components/meetings-header";

import { MeetingsTable } from "./components/meetings-table";

export default function MeetingsPage() {
  const [query, setQuery] = useState("");

  const [openCreate, setOpenCreate] = useState(false);

  const { data: meetings = [], isLoading } = useMeetings();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    if (!q) return meetings;

    return meetings.filter((m) => {
      const started = m.startedAt
        ? new Date(m.startedAt).toLocaleString().toLowerCase()
        : "";

      return (
        m.title.toLowerCase().includes(q) ||
        (m.description || "").toLowerCase().includes(q) ||
        started.includes(q)
      );
    });
  }, [meetings, query]);

  if (isLoading) {
    return <AppLoader />;
  }

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
      />
    </div>
  );
}
