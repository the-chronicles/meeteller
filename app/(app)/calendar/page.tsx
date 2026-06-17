/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useEvents, type CalEvent } from "@/context/EventProvider";
import { useSearchParams } from "next/navigation";

type ViewMode = "day" | "week";

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
function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function getWeekNumber(d: Date) {
  // ISO week number (Monday start)
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil((((date.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

function formatHeaderRange(anchor: Date, mode: ViewMode) {
  const optsMonth: Intl.DateTimeFormatOptions = { month: "long", year: "numeric" };
  if (mode === "day")
    return anchor.toLocaleDateString(undefined, { weekday: "long", ...optsMonth });

  const ws = startOfWeek(anchor);
  const we = addDays(ws, 6);
  const sameMonth = ws.getMonth() === we.getMonth() && ws.getFullYear() === we.getFullYear();
  if (sameMonth) {
    return `${ws.toLocaleDateString(undefined, { month: "long", year: "numeric" })}`;
  }
  return `${ws.toLocaleDateString(undefined, optsMonth)} – ${we.toLocaleDateString(
    undefined,
    optsMonth,
  )}`;
}

function dayLabel(d: Date) {
  return d.toLocaleDateString(undefined, { weekday: "short" });
}

function monthGrid(year: number, month: number) {
  // month: 0-11
  const first = new Date(year, month, 1);
  const start = startOfWeek(first); // monday
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

  const [mode, setMode] = useState<ViewMode>("week");
  const [anchor, setAnchor] = useState<Date>(() => new Date());
  const [selected, setSelected] = useState<CalEvent | null>(null);
  const [highlightId, setHighlightId] = useState<string | null>(null);

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

  // Jump from upcoming meetings: /calendar?eventId=xxx
  useEffect(() => {
    const targetId = params.get("eventId");
    if (!targetId) return;

    const e = storeEvents.find((x) => x.id === targetId);
    if (!e) return;

    const start = new Date(e.start);
    setAnchor(start);
    setSelected(e);
    setHighlightId(e.id);
    setMode("week");

    requestAnimationFrame(() => {
      const scroller = scrollerRef.current;
      if (!scroller) return;
      const mins = minutesSinceStartOfDay(start);
      const top = (mins / (24 * 60)) * 2400;
      scroller.scrollTo({ top: Math.max(0, top - 140), behavior: "smooth" });
      window.setTimeout(() => setHighlightId(null), 2500);
    });
  }, [params, storeEvents]);

  const weekStart = useMemo(() => startOfWeek(anchor), [anchor]);

  const days = useMemo(() => {
    if (mode === "day") return [toDate(anchor)];
    return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  }, [mode, anchor, weekStart]);

  const hours = useMemo(() => Array.from({ length: 24 }, (_, i) => i), []);

  const visibleEvents = useMemo(() => {
    return storeEvents.filter((e) => {
      if (e.source === "internal") return calToggles.internal;
      if (e.source === "google") return calToggles.google;
      if (e.source === "microsoft") return calToggles.microsoft;
      return true;
    });
  }, [storeEvents, calToggles]);

  const eventsByDay = useMemo(() => {
    const map = new Map<string, CalEvent[]>();
    for (const d of days) map.set(d.toDateString(), []);

    for (const e of visibleEvents) {
      const s = new Date(e.start);
      const key = toDate(s).toDateString();
      if (map.has(key)) map.get(key)!.push(e);
    }

    for (const [k, arr] of map.entries()) {
      arr.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
      map.set(k, arr);
    }
    return map;
  }, [visibleEvents, days]);

  const miniMonth = useMemo(() => {
    const y = anchor.getFullYear();
    const m = anchor.getMonth();
    return monthGrid(y, m);
  }, [anchor]);

  const headerTitle = useMemo(() => formatHeaderRange(anchor, mode), [anchor, mode]);

  const goToday = () => setAnchor(new Date());
  const goPrev = () => setAnchor((d) => addDays(d, mode === "day" ? -1 : -7));
  const goNext = () => setAnchor((d) => addDays(d, mode === "day" ? 1 : 7));

  const showNowLine = useMemo(() => {
    const today = toDate(liveNow);
    return days.some((d) => isSameDay(d, today));
  }, [days, liveNow]);

  const nowTop = useMemo(() => {
    const mins = minutesSinceStartOfDay(liveNow);
    return (mins / (24 * 60)) * 2400;
  }, [liveNow]);

  const gridColsHeader =
    mode === "day" ? "grid-cols-[64px_1fr]" : "grid-cols-[64px_42px_repeat(7,1fr)]";

  return (
    <div className="h-full">
      <div className="mx-auto h-full w-full overflow-hidden rounded-3xl bg-white dark:bg-zinc-900/50 dark:border dark:border-white/10 shadow-sm">
        {/* Toolbar */}
        <div className="border-b dark:border-white/10">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2">
              <button
                onClick={goToday}
                className="rounded-lg border dark:border-white/10 px-3 py-1.5 text-sm text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800"
              >
                Today
              </button>
              <div className="flex items-center gap-1">
                <button
                  onClick={goPrev}
                  className="rounded-lg border dark:border-white/10 px-2 py-1.5 text-sm text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800"
                >
                  ‹
                </button>
                <button
                  onClick={goNext}
                  className="rounded-lg border dark:border-white/10 px-2 py-1.5 text-sm text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800"
                >
                  ›
                </button>
              </div>

              <h1 className="ml-2 text-base font-semibold text-gray-900 dark:text-white">{headerTitle}</h1>
            </div>

            <div className="flex items-center gap-2">
              <div className="rounded-xl border dark:border-white/10 bg-gray-50 dark:bg-zinc-800/50 p-1">
                <button
                  onClick={() => setMode("day")}
                  className={`rounded-lg px-3 py-1 text-sm ${
                    mode === "day"
                      ? "bg-white dark:bg-zinc-700 text-gray-900 dark:text-white shadow-sm"
                      : "text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  Day
                </button>
                <button
                  onClick={() => setMode("week")}
                  className={`rounded-lg px-3 py-1 text-sm ${
                    mode === "week"
                      ? "bg-white dark:bg-zinc-700 text-gray-900 dark:text-white shadow-sm"
                      : "text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  Week
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid h-[calc(100vh-170px)] grid-cols-1 md:grid-cols-[280px_1fr]">
          {/* Sidebar */}
          <aside className="hidden md:block border-r dark:border-white/10 bg-gray-50/60 dark:bg-zinc-900/30 p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-sm font-semibold text-gray-900 dark:text-white">
                {anchor.toLocaleDateString(undefined, { month: "long", year: "numeric" })}
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => setAnchor((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))}
                  className="rounded-md border dark:border-white/10 bg-white dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 px-2 py-1 text-sm hover:bg-gray-50 dark:hover:bg-zinc-700"
                >
                  ‹
                </button>
                <button
                  onClick={() => setAnchor((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))}
                  className="rounded-md border dark:border-white/10 bg-white dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 px-2 py-1 text-sm hover:bg-gray-50 dark:hover:bg-zinc-700"
                >
                  ›
                </button>
              </div>
            </div>

            {/* Mini month with week numbers */}
            <div className="rounded-2xl border dark:border-white/10 bg-white dark:bg-zinc-900/50 p-3">
              <div className="grid grid-cols-8 gap-1 text-[11px] text-gray-500 dark:text-zinc-400">
                <div className="text-center">Week</div>
                {["M", "T", "W", "T", "F", "S", "S"].map((x) => (
                  <div key={x} className="text-center">
                    {x}
                  </div>
                ))}
              </div>

              <div className="mt-2 space-y-1">
                {miniMonth.map((week, wi) => (
                  <div key={wi} className="grid grid-cols-8 gap-1">
                    <div className="flex h-7 items-center justify-center text-[11px] text-gray-400 dark:text-zinc-500">
                      {getWeekNumber(week[0])}
                    </div>

                    {week.map((d) => {
                      const inMonth = d.getMonth() === anchor.getMonth();
                      const active = isSameDay(d, anchor);
                      const today = isSameDay(d, new Date());
                      return (
                        <button
                          key={d.toISOString()}
                          onClick={() => setAnchor(d)}
                          className={[
                            "h-7 rounded-lg text-xs transition",
                            inMonth ? "text-gray-900 dark:text-zinc-100" : "text-gray-400 dark:text-zinc-600",
                            active ? "bg-[#5b09c4] text-white" : "hover:bg-gray-100 dark:hover:bg-zinc-800",
                            today && !active ? "ring-1 ring-[#5b09c4]" : "",
                          ].join(" ")}
                        >
                          {d.getDate()}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Calendar toggles */}
            <div className="mt-4 rounded-2xl border dark:border-white/10 bg-white dark:bg-zinc-900/50 p-3">
              <div className="text-xs font-semibold text-gray-800 dark:text-zinc-300">Calendars</div>

              <div className="mt-3 space-y-2 text-sm text-gray-700 dark:text-zinc-300">
                <label className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    <span>Internal</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={calToggles.internal}
                    onChange={(e) =>
                      setCalToggles((p) => ({ ...p, internal: e.target.checked }))
                    }
                    className="h-4 w-4 accent-emerald-600"
                  />
                </label>

                <label className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                    <span>Google</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={calToggles.google}
                    onChange={(e) =>
                      setCalToggles((p) => ({ ...p, google: e.target.checked }))
                    }
                    className="h-4 w-4 accent-blue-600"
                  />
                </label>

                <label className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-purple-500" />
                    <span>Microsoft</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={calToggles.microsoft}
                    onChange={(e) =>
                      setCalToggles((p) => ({ ...p, microsoft: e.target.checked }))
                    }
                    className="h-4 w-4 accent-purple-600"
                  />
                </label>
              </div>
            </div>
          </aside>

          {/* Main calendar */}
          <section className="relative">
            {/* Day headers */}
            <div className="sticky top-0 z-10 border-b dark:border-white/10 bg-white dark:bg-zinc-900">
              <div className={`grid ${gridColsHeader}`}>
                <div className="px-3 py-2 text-xs text-gray-400 dark:text-zinc-500" />
                {mode === "week" && <div className="px-2 py-2 text-[11px] text-gray-400 dark:text-zinc-500">Week</div>}

                {days.map((d) => {
                  const isToday = isSameDay(d, new Date());
                  return (
                    <div key={d.toISOString()} className="px-3 py-2">
                      <div className="flex items-baseline justify-between">
                        <div className="text-xs text-gray-500 dark:text-zinc-400">{dayLabel(d)}</div>

                        {isToday ? (
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-sm font-semibold text-white">
                            {d.getDate()}
                          </div>
                        ) : (
                          <div className="text-sm font-semibold text-gray-900 dark:text-white">{d.getDate()}</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* All-day row */}
              <div className={`grid border-t dark:border-white/10 ${gridColsHeader}`}>
                <div className="px-3 py-2 text-[11px] text-gray-400 dark:text-zinc-500">all-day</div>
                {mode === "week" && (
                  <div className="px-2 py-2 text-[11px] text-gray-400 dark:text-zinc-500">
                    {getWeekNumber(days[0])}
                  </div>
                )}
                {days.map((d) => (
                  <div
                    key={d.toISOString()}
                    className="min-h-8.5 border-l dark:border-white/10 px-2 py-1 first:border-l-0"
                  />
                ))}
              </div>
            </div>

            {/* Scroll grid */}
            <div
              ref={scrollerRef}
              className="relative h-[calc(100vh-250px)] overflow-auto bg-white dark:bg-zinc-900"
            >
              {/* Current time line */}
              {showNowLine && (
                <div
                  className="pointer-events-none absolute left-0 right-0 z-20"
                  style={{ top: nowTop }}
                >
                  <div className="flex items-center">
                    <div className="w-16 px-2 text-[10px] text-gray-400 dark:text-zinc-500">
                      {liveNow.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                    <div className="h-px flex-1 bg-red-500/80" />
                  </div>
                </div>
              )}

              <div className={`grid ${gridColsHeader}`}>
                {/* time gutter */}
                <div className="relative">
                  {hours.map((h) => (
                    <div key={h} className="h-25 border-b dark:border-white/10 px-2 pt-1">
                      <span className="text-[11px] text-gray-400 dark:text-zinc-500">{pad2(h)}:00</span>
                    </div>
                  ))}
                </div>

                {/* week-number spine */}
                {mode === "week" && (
                  <div className="relative border-r dark:border-white/10 bg-white dark:bg-zinc-900">
                    {hours.map((h) => (
                      <div key={h} className="h-25 border-b dark:border-white/10" />
                    ))}
                  </div>
                )}

                {/* day columns */}
                {days.map((d) => {
                  const key = d.toDateString();
                  const dayEvents = eventsByDay.get(key) ?? [];

                  return (
                    <div key={key} className="relative border-l dark:border-white/10 first:border-l-0">
                      {hours.map((h) => (
                        <div key={h} className="h-25 border-b dark:border-white/10" />
                      ))}

                      <div className="absolute inset-0">
                        {dayEvents.map((e) => {
                          const s = new Date(e.start);
                          const t = new Date(e.end);

                          const startMin = minutesSinceStartOfDay(s);
                          const endMin = minutesSinceStartOfDay(t);

                          const top = (startMin / (24 * 60)) * 2400;
                          const height = Math.max(
                            22,
                            ((endMin - startMin) / (24 * 60)) * 2400,
                          );

                          const isHighlight = highlightId === e.id;

                          return (
                            <button
                              key={e.id}
                              onClick={() => setSelected(e)}
                              className={[
                                "absolute left-2 right-2 rounded-xl border px-2 py-1.5 text-left shadow-sm backdrop-blur",
                                "transition hover:shadow-md",
                                appleEventColor(e.color),
                                isHighlight ? "ring-2 ring-black dark:ring-white animate-pulse" : "",
                              ].join(" ")}
                              style={{ top: top + 6, height: height - 10 }}
                            >
                              <div className="truncate text-xs font-semibold">{e.title}</div>
                              <div className="mt-0.5 text-[11px] opacity-70">
                                {s.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} –{" "}
                                {t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
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

            {/* Details popover */}
            {selected && (
              <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/20 dark:bg-black/40 p-4 md:items-center">
                <div className="w-full max-w-md rounded-2xl bg-white dark:bg-zinc-800 border dark:border-white/10 p-4 shadow-xl">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white">{selected.title}</h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-zinc-400">
                        {new Date(selected.start).toLocaleString()} →{" "}
                        {new Date(selected.end).toLocaleString()}
                      </p>
                      {selected.location && (
                        <p className="mt-1 text-sm text-gray-500 dark:text-zinc-400">{selected.location}</p>
                      )}
                    </div>
                    <button
                      onClick={() => setSelected(null)}
                      className="rounded-lg border dark:border-white/10 px-3 py-1.5 text-sm text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-700"
                    >
                      Done
                    </button>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {selected.joinUrl ? (
                      <a
                        href={selected.joinUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-lg bg-black dark:bg-white dark:text-black px-3 py-2 text-sm font-medium text-white hover:bg-gray-900 dark:hover:bg-zinc-100"
                      >
                        Join
                      </a>
                    ) : null}

                    <button className="rounded-lg border dark:border-white/10 text-gray-700 dark:text-zinc-300 px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-zinc-700">
                      Edit
                    </button>
                    <button className="rounded-lg border dark:border-white/10 text-gray-700 dark:text-zinc-300 px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-zinc-700">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}