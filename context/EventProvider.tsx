"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useMeetings } from "@/hooks/useMeetings";

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

export function EventsProvider({ children }: { children: React.ReactNode }) {
  const { data: meetings = [] } = useMeetings();
  const [localEvents, setLocalEvents] = useState<CalEvent[]>([]);

  // Load local calendar events on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("meeteller-calendar-events");
    if (saved) {
      try {
        setLocalEvents(JSON.parse(saved));
      } catch {
        setLocalEvents([]);
      }
    }
  }, []);

  // Map backend meetings with status = scheduled
  const dbEvents = useMemo(() => {
    return meetings
      .filter((m) => m.status === "scheduled")
      .map((m) => {
        let platform: MeetingPlatform = m.meetingType === "zoom" ? "zoom" : "google_meet";
        let joinUrl = m.externalMeetingUrl || "";
        
        if (!joinUrl && m.description) {
          const meetMatch = m.description.match(/Join link:\s*(https?:\/\/[^\s]+)/);
          const platformMatch = m.description.match(/Platform:\s*(\w+)/);
          if (meetMatch) {
            joinUrl = meetMatch[1];
          }
          if (platformMatch && platformMatch[1].toLowerCase().includes("zoom")) {
            platform = "zoom";
          }
        }

        return {
          id: String(m.id),
          title: m.title,
          start: m.startedAt || m.createdAt,
          end: m.endedAt || m.createdAt,
          source: "internal" as const,
          status: "confirmed" as const,
          color: (platform === "zoom" ? "purple" : "green") as any,
          isMeeting: true,
          platform,
          joinUrl,
          location: platform === "zoom" ? "Zoom" : "Google Meet",
        };
      });
  }, [meetings]);

  const addEvent = (e: CalEvent) => {
    const updated = [e, ...localEvents];
    setLocalEvents(updated);
    localStorage.setItem("meeteller-calendar-events", JSON.stringify(updated));
  };

  const updateEvent = (id: string, patch: Partial<CalEvent>) => {
    const updated = localEvents.map((e) => (e.id === id ? { ...e, ...patch } : e));
    setLocalEvents(updated);
    localStorage.setItem("meeteller-calendar-events", JSON.stringify(updated));
  };

  const removeEvent = (id: string) => {
    const updated = localEvents.filter((e) => e.id !== id);
    setLocalEvents(updated);
    localStorage.setItem("meeteller-calendar-events", JSON.stringify(updated));
  };

  const events = useMemo(() => {
    return [...dbEvents, ...localEvents];
  }, [dbEvents, localEvents]);

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