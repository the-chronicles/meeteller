"use client";

import React, { createContext, useContext, useMemo, useState } from "react";

export type MeetingPlatform = "google_meet" | "zoom";
export type CalendarSource = "all" | "google" | "microsoft" | "internal";
export type EventStatus = "confirmed" | "tentative" | "cancelled";

export type CalEvent = {
  id: string;
  title: string;
  start: string; // ISO
  end: string; // ISO
  source: Exclude<CalendarSource, "all">;
  status?: EventStatus;
  color?: "purple" | "blue" | "green" | "yellow" | "pink";
  location?: string;
  attendees?: number;

  // meeting-only extras
  isMeeting?: boolean;
  platform?: MeetingPlatform;
  joinUrl?: string;
};

type EventsCtx = {
  events: CalEvent[];
  addEvent: (e: CalEvent) => void;
  updateEvent: (id: string, patch: Partial<CalEvent>) => void;
  removeEvent: (id: string) => void;
};

const EventsContext = createContext<EventsCtx | null>(null);

const seedEvents: CalEvent[] = [
  {
    id: "m1",
    title: "Discovery Call",
    start: "2026-01-22T10:00:00",
    end: "2026-01-22T10:30:00",
    source: "internal",
    status: "confirmed",
    color: "green",
    isMeeting: true,
    platform: "google_meet",
    joinUrl: "https://meet.google.com/abc-defg-hij",
  },
  {
    id: "m2",
    title: "Company Onboarding",
    start: "2026-01-22T12:00:00",
    end: "2026-01-22T13:00:00",
    source: "internal",
    status: "confirmed",
    color: "yellow",
    isMeeting: true,
    platform: "zoom",
    joinUrl: "https://zoom.us/j/12345678901?pwd=abcd1234",
  },
];

export function EventsProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<CalEvent[]>(seedEvents);

  const addEvent = (e: CalEvent) => setEvents((prev) => [e, ...prev]);

  const updateEvent = (id: string, patch: Partial<CalEvent>) =>
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e)));

  const removeEvent = (id: string) =>
    setEvents((prev) => prev.filter((e) => e.id !== id));

  const value = useMemo(
    () => ({ events, addEvent, updateEvent, removeEvent }),
    [events],
  );

  return <EventsContext.Provider value={value}>{children}</EventsContext.Provider>;
}

export function useEvents() {
  const ctx = useContext(EventsContext);
  if (!ctx) throw new Error("useEvents must be used inside EventsProvider");
  return ctx;
}