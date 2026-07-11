/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useEvents, type CalEvent } from "@/context/EventProvider";
import { useSearchParams } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Video,
  Calendar,
  X,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import AppLoader from "@/components/ui/AppLoader";

type ViewMode = "day" | "week" | "month";

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function toDate(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function addDays(d: Date, days: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + days);
  return x;
}

function startOfWeek(d: Date) {
  // Monday start
  const x = toDate(d);
  const day = x.getDay(); // 0 Sun..6 Sat
  const diff = (day === 0 ? -6 : 1) - day;
  return addDays(x, diff);
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function minutesSinceStartOfDay(date: Date) {
  return date.getHours() * 60 + date.getMinutes();
}

function getWeekNumber(d: Date) {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

function dayLabel(d: Date) {
  return d.toLocaleDateString(undefined, { weekday: "short" });
}

function monthGrid(year: number, month: number) {
  const first = new Date(year, month, 1);
  const start = startOfWeek(first);
  const weeks: Date[][] = [];
  let cur = start;
  for (let w = 0; w < 6; w++) {
    const row: Date[] = [];
    for (let i = 0; i < 7; i++) {
      row.push(cur);
      cur = addDays(cur, 1);
    }
    weeks.push(row);
  }
  return weeks;
}

function appleEventColor(c?: CalEvent["color"]) {
  switch (c) {
    case "blue":
      return "bg-blue-500/15 text-blue-900 border-blue-500/20 dark:text-blue-200 dark:border-blue-500/30";
    case "green":
      return "bg-emerald-500/15 text-emerald-900 border-emerald-500/20 dark:text-emerald-200 dark:border-emerald-500/30";
    case "yellow":
      return "bg-amber-500/15 text-amber-900 border-amber-500/20 dark:text-amber-200 dark:border-amber-500/30";
    case "pink":
      return "bg-pink-500/15 text-pink-900 border-pink-500/20 dark:text-pink-200 dark:border-pink-500/30";
    case "purple":
      return "bg-purple-500/15 text-purple-900 border-purple-500/20 dark:text-purple-200 dark:border-purple-500/30";
    default:
      return "bg-gray-900/5 text-gray-900 border-gray-900/10 dark:bg-white/5 dark:text-zinc-200 dark:border-white/10";
  }
}

export default function CalendarPage() {
  const { events: storeEvents } = useEvents();
  const params = useSearchParams();

  const [viewMode, setViewMode] = useState<ViewMode>("day");
  const [anchor, setAnchor] = useState<Date>(() => new Date());
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [closedByUser, setClosedByUser] = useState(false);
  const [highlightId, setHighlightId] = useState<string | null>(null);

  const handleCloseSidebar = () => {
    setSelectedEvent(null);
    setClosedByUser(true);
  };

  const handleSelectEvent = (evt: any) => {
    setSelectedEvent(evt);
    setClosedByUser(false);
  };

  const [calToggles, setCalToggles] = useState({
    internal: true,
    google: true,
    microsoft: true,
  });

  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [liveNow, setLiveNow] = useState<Date>(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setLiveNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  const weekStart = useMemo(() => startOfWeek(anchor), [anchor]);

  const daysOfWeek = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  }, [weekStart]);

  const hours = useMemo(() => Array.from({ length: 24 }, (_, i) => i), []);

  const visibleEvents = useMemo(() => {
    return storeEvents.filter((e) => {
      if (e.source === "internal") return calToggles.internal;
      if (e.source === "google") return calToggles.google;
      if (e.source === "microsoft") return calToggles.microsoft;
      return true;
    });
  }, [storeEvents, calToggles]);

  // Real events occurring on the anchor day
  const dayEvents = useMemo(() => {
    const dayStart = new Date(
      anchor.getFullYear(),
      anchor.getMonth(),
      anchor.getDate(),
      0,
      0,
      0,
    );
    const dayEnd = new Date(
      anchor.getFullYear(),
      anchor.getMonth(),
      anchor.getDate(),
      23,
      59,
      59,
    );

    return visibleEvents.filter((e) => {
      const start = new Date(e.start);
      return start >= dayStart && start <= dayEnd;
    });
  }, [visibleEvents, anchor]);

  const mergedEvents = useMemo(() => {
    const sorted = [...dayEvents];
    sorted.sort(
      (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
    );
    return sorted;
  }, [dayEvents]);

  const eventsByDay = useMemo(() => {
    const map = new Map<string, CalEvent[]>();
    for (const d of daysOfWeek) map.set(d.toDateString(), []);

    for (const e of visibleEvents) {
      const s = new Date(e.start);
      const key = toDate(s).toDateString();
      if (map.has(key)) map.get(key)!.push(e);
    }

    for (const [k, arr] of map.entries()) {
      arr.sort(
        (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
      );
      map.set(k, arr);
    }
    return map;
  }, [visibleEvents, daysOfWeek]);

  const miniMonth = useMemo(() => {
    const y = anchor.getFullYear();
    const m = anchor.getMonth();
    return monthGrid(y, m);
  }, [anchor]);

  // Jump from upcoming meetings deep-link
  useEffect(() => {
    const targetId = params.get("eventId");
    if (!targetId) return;

    const e = storeEvents.find((x) => x.id === targetId);
    if (!e) return;

    const start = new Date(e.start);
    setAnchor(start);
    setSelectedEvent(e);
    setClosedByUser(false);
    setHighlightId(e.id);
    setViewMode("day");

    requestAnimationFrame(() => {
      window.setTimeout(() => setHighlightId(null), 2500);
    });
  }, [params, storeEvents]);

  // Set the default selected event to the first real event on day change
  useEffect(() => {
    setClosedByUser(false);
  }, [anchor]);

  useEffect(() => {
    if (closedByUser) return;

    if (mergedEvents.length > 0) {
      // Find matching current highlighted event or default to first
      const exists = mergedEvents.find((e) => e.id === selectedEvent?.id);
      if (!exists) {
        setSelectedEvent(mergedEvents[0]);
      }
    } else {
      setSelectedEvent(null);
    }
  }, [mergedEvents, selectedEvent, closedByUser]);

  const handlePrevWeek = () => setAnchor((d) => addDays(d, -7));
  const handleNextWeek = () => setAnchor((d) => addDays(d, 7));
  const handleToday = () => setAnchor(new Date());

  const showNowLine = useMemo(() => {
    const today = toDate(liveNow);
    return daysOfWeek.some((d) => isSameDay(d, today));
  }, [daysOfWeek, liveNow]);

  const nowTop = useMemo(() => {
    const mins = minutesSinceStartOfDay(liveNow);
    return (mins / (24 * 60)) * 2400;
  }, [liveNow]);

  const getBorderColor = (source: string) => {
    if (source === "google") return "border-l-4 border-blue-500";
    if (source === "microsoft") return "border-l-4 border-purple-500";
    return "border-l-4 border-[#5b09c4]";
  };

  const renderDetailContent = () => {
    if (!selectedEvent) return null;

    const start = new Date(selectedEvent.start);
    const end = new Date(selectedEvent.end);
    const timeLabel = `${start.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })} – ${end.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`;
    const durationMin = Math.round((end.getTime() - start.getTime()) / 60000);
    const durationLabel =
      durationMin >= 60
        ? `${Math.round(durationMin / 60)}h`
        : `${durationMin}m`;

    const hasJoinUrl = !!selectedEvent.joinUrl;
    const isZoom = selectedEvent.platform === "zoom";

    return (
      <div className="space-y-6">
        {/* Title */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-xl leading-tight font-bold text-gray-900 dark:text-white">
              {selectedEvent.title}
            </h3>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-500 dark:text-zinc-400">
              <Clock className="h-3.5 w-3.5 text-gray-400" />
              <span>{timeLabel}</span>
              <span>({durationLabel})</span>
            </div>
            {selectedEvent.location && (
              <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-500 dark:text-zinc-400">
                <Video className="h-3.5 w-3.5 text-gray-400" />
                <span>{selectedEvent.location}</span>
              </div>
            )}
          </div>
          <button
            onClick={handleCloseSidebar}
            className="shrink-0 cursor-pointer rounded-lg border border-gray-100 p-1.5 hover:bg-gray-50 dark:border-white/5 dark:hover:bg-white/5"
          >
            <X className="h-4 w-4 text-gray-500 dark:text-zinc-400" />
          </button>
        </div>

        {/* Description */}
        {selectedEvent.description && (
          <div className="space-y-2">
            <h4 className="text-xs font-semibold tracking-wider text-gray-400 uppercase dark:text-zinc-500">
              Description
            </h4>
            <p className="text-sm text-gray-600 dark:text-zinc-300">
              {selectedEvent.description}
            </p>
          </div>
        )}

        {/* Assistant */}
        {selectedEvent.isMeeting && (
          <div className="space-y-3 rounded-2xl border border-gray-100 bg-white/50 p-4 shadow-xs dark:border-white/5 dark:bg-[#1f1f1f]/50">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold tracking-wider text-gray-400 uppercase dark:text-zinc-500">
                Meeting Assistant
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Ready
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-zinc-400">
                  Provider
                </span>
                <span className="font-semibold text-gray-800 dark:text-zinc-200">
                  {isZoom ? "Zoom" : "Google Meet"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-zinc-400">
                  Transcription
                </span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  Enabled
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-zinc-400">
                  Recording
                </span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  Enabled
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-zinc-400">
                  Smart Notes
                </span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  Enabled
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-2 pt-2">
          {hasJoinUrl ? (
            <button
              onClick={() => window.open(selectedEvent.joinUrl, "_blank")}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#5b09c4] py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#5b09c4]/90"
            >
              <Video className="h-4 w-4" />
              Join Meeting
            </button>
          ) : (
            <button
              onClick={() =>
                toast.info("No external call link for this event.")
              }
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gray-100 py-3 text-sm font-semibold text-gray-500 transition hover:bg-gray-200 dark:bg-zinc-800 dark:text-zinc-400"
            >
              No link available
            </button>
          )}
        </div>
      </div>
    );
  };

  const gridColsHeader = "grid-cols-[64px_42px_repeat(7,1fr)]";

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl lg:flex-row dark:border-white/10 dark:bg-black">
      {/* Main Schedule Side */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Horizontal Calendar Slider */}
        <div className="flex items-center justify-between border-b border-gray-100 bg-white p-4 dark:border-white/5 dark:bg-[#282828]">
          <button
            onClick={handlePrevWeek}
            className="cursor-pointer rounded-xl border border-gray-100 p-2 hover:bg-gray-50 dark:border-white/5 dark:hover:bg-white/5"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-zinc-400" />
          </button>

          <div className="flex flex-1 justify-around px-2">
            {daysOfWeek.map((d) => {
              const isSelected = isSameDay(d, anchor);
              const isToday = isSameDay(d, new Date());
              const label = d.toLocaleDateString("en-US", { weekday: "short" });
              const dayNum = d.getDate();

              return (
                <div
                  key={d.toISOString()}
                  onClick={() => setAnchor(d)}
                  className={`flex cursor-pointer flex-col items-center rounded-2xl px-4 py-2 transition ${
                    isSelected
                      ? "border border-[#282828] bg-white shadow-xs dark:border-white/20 dark:bg-[#282828]/20"
                      : "hover:bg-gray-50 dark:hover:bg-white/5"
                  }`}
                >
                  <span
                    className={`text-[11px] font-medium ${
                      isSelected
                        ? "text-[#282028] dark:text-white"
                        : "text-gray-400 dark:text-zinc-500"
                    }`}
                  >
                    {label}
                  </span>
                  <span
                    className={`mt-1 flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold ${
                      isSelected
                        ? "bg-[#282828] text-white dark:bg-white/20"
                        : isToday
                          ? "bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400"
                          : "text-gray-800 dark:text-zinc-200"
                    }`}
                  >
                    {dayNum}
                  </span>
                  {isSelected && (
                    <span className="mt-1 h-1 w-1 rounded-full bg-[#282828] dark:bg-white/20" />
                  )}
                </div>
              );
            })}
          </div>

          <button
            onClick={handleNextWeek}
            className="cursor-pointer rounded-xl border border-gray-100 p-2 hover:bg-gray-50 dark:border-white/5 dark:hover:bg-white/5"
          >
            <ChevronRight className="h-5 w-5 text-gray-600 dark:text-zinc-400" />
          </button>
        </div>

        {/* Schedule Title & Toggles */}
        <div className="flex flex-col gap-4 border-b border-gray-50 px-6 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-white/5">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              {anchor.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
              's Schedule
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Source filters */}
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() =>
                  setCalToggles((p) => ({ ...p, internal: !p.internal }))
                }
                className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium transition ${
                  calToggles.internal
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/30 dark:bg-emerald-950/20 dark:text-emerald-400"
                    : "border-gray-100 bg-white text-gray-500 hover:bg-gray-50 dark:border-zinc-800 dark:bg-transparent dark:text-zinc-400"
                }`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Internal
              </button>
              <button
                onClick={() =>
                  setCalToggles((p) => ({ ...p, google: !p.google }))
                }
                className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium transition ${
                  calToggles.google
                    ? "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/30 dark:bg-blue-950/20 dark:text-blue-400"
                    : "border-gray-100 bg-white text-gray-500 hover:bg-gray-50 dark:border-zinc-800 dark:bg-transparent dark:text-zinc-400"
                }`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                Google
              </button>
              <button
                onClick={() =>
                  setCalToggles((p) => ({ ...p, microsoft: !p.microsoft }))
                }
                className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium transition ${
                  calToggles.microsoft
                    ? "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-900/30 dark:bg-purple-950/20 dark:text-purple-400"
                    : "border-gray-100 bg-white text-gray-500 hover:bg-gray-50 dark:border-zinc-800 dark:bg-transparent dark:text-zinc-400"
                }`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                Microsoft
              </button>
            </div>

            {/* View Mode Selector Dropdown */}
            <div className="relative">
              <select
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value as any)}
                className="cursor-pointer rounded-xl border border-gray-100 bg-white px-3.5 py-1.5 text-xs font-semibold text-gray-700 transition outline-none hover:bg-gray-50 dark:border-white/5 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-white/5"
              >
                <option value="day">Day</option>
                <option value="week">Week</option>
                <option value="month">Month</option>
              </select>
            </div>

            {/* Today Button */}
            <button
              onClick={handleToday}
              className="cursor-pointer rounded-xl border border-gray-100 px-3.5 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-white/5 dark:text-zinc-300 dark:hover:bg-white/5"
            >
              Today
            </button>
          </div>
        </div>

        {/* Dynamic calendar view grid */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* 1. DAY VIEW AGENDA TIMELINE */}
          {viewMode === "day" && (
            <div className="flex-1 overflow-y-auto px-6 py-6 select-none">
              {mergedEvents.length === 0 ? (
                <div className="flex h-[300px] flex-col items-center justify-center text-center">
                  <Calendar className="h-10 w-10 text-gray-300 dark:text-zinc-700" />
                  <p className="mt-3 text-sm font-semibold text-gray-500 dark:text-zinc-400">
                    No scheduled events on this day.
                  </p>
                </div>
              ) : (
                <div className="relative space-y-6 pl-20">
                  {/* Vertical timeline line */}
                  <div className="absolute top-4 bottom-4 left-[70px] w-0.5 bg-purple-100 dark:bg-zinc-800" />

                  {mergedEvents.map((evt) => {
                    const start = new Date(evt.start);
                    const end = new Date(evt.end);
                    const isHighlighted = selectedEvent?.id === evt.id;

                    const timeStr = start.toLocaleTimeString([], {
                      hour: "numeric",
                      minute: "2-digit",
                    });
                    const durationMin = Math.round(
                      (end.getTime() - start.getTime()) / 60000,
                    );
                    const durationLabel =
                      durationMin >= 60
                        ? `${Math.round(durationMin / 60)}h`
                        : `${durationMin}m`;

                    const isZoom = evt.platform === "zoom";

                    return (
                      <div key={evt.id} className="relative flex items-start">
                        {/* Time label on the left */}
                        <div className="absolute left-[-80px] mt-2 w-14 text-right text-xs font-bold text-gray-400 dark:text-zinc-500">
                          {timeStr}
                        </div>

                        {/* Bullet circular indicator */}
                        <div className="absolute left-[-17px] z-10 mt-2.5 flex h-4 w-4 items-center justify-center">
                          {isHighlighted ? (
                            <div className="h-4 w-4 rounded-full border-4 border-white bg-[#5b09c4] shadow-sm ring-2 ring-[#5b09c4] dark:border-black" />
                          ) : (
                            <div className="h-3 w-3 rounded-full border-2 border-white bg-purple-300 ring-1 ring-purple-100 dark:border-black dark:bg-zinc-700 dark:ring-zinc-800" />
                          )}
                        </div>

                        {/* Card content */}
                        <div className="w-full">
                          {isHighlighted ? (
                            <div
                              onClick={() => handleSelectEvent(evt)}
                              className={`flex cursor-pointer flex-col gap-4 rounded-3xl border-l-[#282828] bg-white p-5 text-white shadow-md transition dark:border-l-white dark:bg-[#282828] dark:text-white`}
                            >
                              {/* Upper row */}
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <h4 className="text-sm font-semibold text-[#282828] dark:text-white">
                                    {evt.title}
                                  </h4>
                                </div>

                                <div className="flex shrink-0 flex-col items-end gap-1.5">
                                  <span className="rounded-full bg-[#282828] px-2 py-0.5 text-[10px] font-medium dark:bg-white/20">
                                    {start.toLocaleTimeString([], {
                                      hour: "numeric",
                                      minute: "2-digit",
                                    })}{" "}
                                    –{" "}
                                    {end.toLocaleTimeString([], {
                                      hour: "numeric",
                                      minute: "2-digit",
                                    })}
                                  </span>
                                  {evt.isMeeting && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-[#282828] px-2.5 py-0.5 text-[10px] font-semibold dark:bg-white/20">
                                      <Video className="h-3 w-3" />
                                      {isZoom ? "Zoom" : "Google Meet"}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div
                              onClick={() => handleSelectEvent(evt)}
                              className={`flex cursor-pointer items-start justify-between gap-4 rounded-3xl border border-gray-100 bg-white p-5 text-gray-900 transition hover:bg-gray-50 dark:border-white/5 dark:bg-[#121212] dark:hover:bg-white/5 ${getBorderColor(evt.source)}`}
                            >
                              <div>
                                <h4 className="text-sm font-semibold dark:text-white">
                                  {evt.title}
                                </h4>
                              </div>

                              <div className="flex shrink-0 flex-col items-end gap-1.5 text-right">
                                <span className="text-[10px] font-medium text-gray-400 dark:text-zinc-500">
                                  {start.toLocaleTimeString([], {
                                    hour: "numeric",
                                    minute: "2-digit",
                                  })}{" "}
                                  –{" "}
                                  {end.toLocaleTimeString([], {
                                    hour: "numeric",
                                    minute: "2-digit",
                                  })}
                                </span>
                                {evt.isMeeting && (
                                  <span className="inline-flex items-center gap-1 rounded-full border border-gray-100 bg-gray-50 px-2.5 py-0.5 text-[9px] font-semibold text-gray-500 dark:border-white/5 dark:bg-zinc-800 dark:text-zinc-400">
                                    <Video className="h-3 w-3" />
                                    {isZoom ? "Zoom" : "Google Meet"}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* 2. WEEK VIEW HOUR GRID */}
          {viewMode === "week" && (
            <div className="flex flex-1 flex-col overflow-hidden bg-white dark:bg-zinc-900">
              <div className="sticky top-0 z-10 border-b bg-white dark:border-white/10 dark:bg-zinc-900">
                <div className={`grid ${gridColsHeader}`}>
                  <div className="px-3 py-2 text-xs text-gray-400 dark:text-zinc-500" />
                  <div className="px-2 py-2 text-[11px] text-gray-400 dark:text-zinc-500">
                    Week
                  </div>

                  {daysOfWeek.map((d) => {
                    const isToday = isSameDay(d, new Date());
                    return (
                      <div
                        key={d.toISOString()}
                        className="border-l px-3 py-2 first:border-l-0 dark:border-white/10"
                      >
                        <div className="flex items-baseline justify-between">
                          <div className="text-xs text-gray-500 dark:text-zinc-400">
                            {dayLabel(d)}
                          </div>
                          {isToday ? (
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-sm font-semibold text-white">
                              {d.getDate()}
                            </div>
                          ) : (
                            <div className="text-sm font-semibold text-gray-900 dark:text-white">
                              {d.getDate()}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Scroll Grid */}
              <div
                ref={scrollerRef}
                className="relative flex-1 overflow-y-auto bg-white dark:bg-zinc-900"
              >
                {/* Current time line */}
                {showNowLine && (
                  <div
                    className="pointer-events-none absolute right-0 left-0 z-20"
                    style={{ top: nowTop }}
                  >
                    <div className="flex items-center">
                      <div className="w-16 px-2 text-[10px] text-red-500">
                        {liveNow.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                      <div className="h-px flex-1 bg-red-500" />
                    </div>
                  </div>
                )}

                <div className={`grid ${gridColsHeader}`}>
                  {/* time gutter */}
                  <div className="relative">
                    {hours.map((h) => (
                      <div
                        key={h}
                        className="h-25 border-b px-2 pt-1 dark:border-white/10"
                      >
                        <span className="text-[11px] text-gray-400 dark:text-zinc-500">
                          {pad2(h)}:00
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* spine */}
                  <div className="relative border-r bg-white dark:border-white/10 dark:bg-zinc-900">
                    {hours.map((h) => (
                      <div
                        key={h}
                        className="h-25 border-b dark:border-white/10"
                      />
                    ))}
                  </div>

                  {/* day columns */}
                  {daysOfWeek.map((d) => {
                    const key = d.toDateString();
                    const dayEventsList = eventsByDay.get(key) ?? [];

                    return (
                      <div
                        key={key}
                        className="relative border-l first:border-l-0 dark:border-white/10"
                      >
                        {hours.map((h) => (
                          <div
                            key={h}
                            className="h-25 border-b dark:border-white/10"
                          />
                        ))}

                        <div className="absolute inset-0">
                          {dayEventsList.map((e) => {
                            const s = new Date(e.start);
                            const t = new Date(e.end);

                            const startMin = minutesSinceStartOfDay(s);
                            const endMin = minutesSinceStartOfDay(t);

                            const top = (startMin / (24 * 60)) * 2400;
                            const height = Math.max(
                              22,
                              ((endMin - startMin) / (24 * 60)) * 2400,
                            );

                            const isHighlight = selectedEvent?.id === e.id;

                            return (
                              <button
                                key={e.id}
                                onClick={() => handleSelectEvent(e)}
                                className={`absolute right-2 left-2 overflow-hidden rounded-xl border px-2 py-1.5 text-left shadow-sm backdrop-blur transition hover:shadow-md ${appleEventColor(e.color)} ${
                                  isHighlight
                                    ? "animate-pulse ring-2 ring-[#5b09c4] dark:ring-white"
                                    : ""
                                }`}
                                style={{ top: top + 6, height: height - 10 }}
                              >
                                <div className="truncate text-xs font-semibold">
                                  {e.title}
                                </div>
                                <div className="mt-0.5 text-[10px] opacity-70">
                                  {s.toLocaleTimeString([], {
                                    hour: "numeric",
                                    minute: "2-digit",
                                  })}{" "}
                                  –{" "}
                                  {t.toLocaleTimeString([], {
                                    hour: "numeric",
                                    minute: "2-digit",
                                  })}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* 3. MONTH VIEW GRID */}
          {viewMode === "month" && (
            <div className="flex flex-1 flex-col overflow-hidden border-t bg-white dark:border-white/5 dark:bg-zinc-900">
              {/* Day headers */}
              <div className="grid grid-cols-7 border-b border-gray-100 py-2 text-center text-xs font-semibold text-gray-500 dark:border-white/5 dark:text-zinc-400">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                  <div key={d}>{d}</div>
                ))}
              </div>

              {/* Grid Body */}
              <div className="grid flex-1 grid-cols-7 grid-rows-6 divide-x divide-y divide-gray-100 overflow-hidden border-r border-b border-gray-100 dark:divide-white/5 dark:border-white/5">
                {miniMonth.map((week, wi) =>
                  week.map((day, di) => {
                    const isSelected = isSameDay(day, anchor);
                    const isToday = isSameDay(day, new Date());
                    const inMonth = day.getMonth() === anchor.getMonth();

                    // Filter events for this month day
                    const dayStart = new Date(
                      day.getFullYear(),
                      day.getMonth(),
                      day.getDate(),
                      0,
                      0,
                      0,
                    );
                    const dayEnd = new Date(
                      day.getFullYear(),
                      day.getMonth(),
                      day.getDate(),
                      23,
                      59,
                      59,
                    );
                    const dayEvts = visibleEvents.filter((e) => {
                      const start = new Date(e.start);
                      return start >= dayStart && start <= dayEnd;
                    });

                    return (
                      <div
                        key={day.toISOString()}
                        onClick={() => setAnchor(day)}
                        className={`flex min-h-0 cursor-pointer flex-col justify-between p-2 transition ${
                          isSelected
                            ? "bg-purple-50/40 dark:bg-purple-950/10"
                            : "hover:bg-gray-50 dark:hover:bg-white/5"
                        }`}
                      >
                        {/* Day number/counter row */}
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-xs font-bold ${
                              inMonth
                                ? isToday
                                  ? "flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white"
                                  : "text-gray-900 dark:text-zinc-200"
                                : "text-gray-300 dark:text-zinc-600"
                            }`}
                          >
                            {day.getDate()}
                          </span>
                          {dayEvts.length > 0 && (
                            <span className="rounded-sm bg-[#5b09c4]/5 px-1 text-[9px] font-bold text-[#5b09c4] dark:bg-[#5b09c4]/20 dark:text-purple-400">
                              {dayEvts.length}
                            </span>
                          )}
                        </div>

                        {/* Event list preview */}
                        <div className="mt-1 flex-1 space-y-1 overflow-hidden">
                          {dayEvts.slice(0, 2).map((e) => (
                            <div
                              key={e.id}
                              className={`truncate rounded px-1 py-0.5 text-[9px] font-medium ${
                                e.source === "google"
                                  ? "bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400"
                                  : e.source === "microsoft"
                                    ? "bg-purple-50 text-purple-700 dark:bg-purple-950/20 dark:text-purple-400"
                                    : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400"
                              }`}
                            >
                              {e.title}
                            </div>
                          ))}
                          {dayEvts.length > 2 && (
                            <div className="pl-1 text-[8px] text-gray-400 italic dark:text-zinc-500">
                              +{dayEvts.length - 2} more
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  }),
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Detail Sidebar (Desktop view) */}
      {selectedEvent && (
        <div className="hidden w-[360px] overflow-y-auto border-l border-gray-100 bg-gray-50/50 p-6 lg:block dark:border-white/5 dark:bg-[#0b0014]/50">
          {renderDetailContent()}
        </div>
      )}

      {/* Detail Drawer (Mobile view overlay) */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex justify-end lg:hidden">
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-xs"
            onClick={handleCloseSidebar}
          />
          <div className="relative flex h-full w-full max-w-md flex-col overflow-y-auto bg-white p-6 shadow-2xl dark:bg-[#0c0017]">
            {renderDetailContent()}
          </div>
        </div>
      )}
    </div>
  );
}
