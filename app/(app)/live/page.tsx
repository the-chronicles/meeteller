"use client";

import { useState, useEffect, useMemo } from "react";
import { LiveTranscript } from "./components/live-transcript";
import OrbitVisual from "./components/OrbitVisual";
import AvatarCards from "./components/AvatarCards";
import { useMeetings } from "@/hooks/useMeetings";
import { useUpdateMeeting } from "@/hooks/useUpdateMeeting";
import { useCreateMeeting } from "@/hooks/useCreateMeeting";
import AppLoader from "@/components/ui/AppLoader";

export default function LiveMeetingPage() {
  const [showTranscript, setShowTranscript] = useState(false);

  const { data: meetings = [], isLoading } = useMeetings();
  const updateMutation = useUpdateMeeting();
  const createMutation = useCreateMeeting();

  const liveMeeting = meetings.find((m) => m.status === "live");
  const scheduled = meetings.filter((m) => m.status === "scheduled");

  // Auto-open transcript panel if a live meeting is active
  useEffect(() => {
    if (liveMeeting) {
      setShowTranscript(true);
    }
  }, [liveMeeting]);

  const handleStartQuickLive = () => {
    createMutation.mutate({
      title: "Quick Live Meeting",
      status: "live",
      startedAt: new Date().toISOString(),
    });
  };

  const handleGoLive = (id: number) => {
    updateMutation.mutate({
      id: id.toString(),
      data: {
        status: "live",
        startedAt: new Date().toISOString(),
      },
    });
  };

  const handleEndMeeting = () => {
    if (liveMeeting) {
      updateMutation.mutate({
        id: liveMeeting.id.toString(),
        data: {
          status: "completed",
          endedAt: new Date().toISOString(),
        },
      });
    }
  };

  const participants = useMemo(() => {
    if (!liveMeeting) return [];

    let attendees: { name: string; role?: string }[] = [];
    try {
      if (liveMeeting.providerMetadata) {
        const meta = JSON.parse(liveMeeting.providerMetadata);

        // Handle Google Calendar attendees
        if (meta.attendees && Array.isArray(meta.attendees)) {
          attendees = meta.attendees.map((att: any) => ({
            name: att.displayName || att.email.split("@")[0],
            role: att.email === liveMeeting.owner?.email ? "Host" : "Attendee",
          }));
        }

        // Include organizer/host if not in the attendees list
        if (meta.organizer) {
          const orgName =
            meta.organizer.displayName || meta.organizer.email.split("@")[0];
          const hasOrg = attendees.some(
            (att) => att.name.toLowerCase() === orgName.toLowerCase(),
          );
          if (!hasOrg) {
            attendees.unshift({
              name: orgName,
              role: "Host",
            });
          }
        }
      }
    } catch (e) {
      console.error("Error parsing providerMetadata:", e);
    }

    // Fallback if no attendees exist to populate avatar cards nicely
    if (attendees.length === 0) {
      attendees = [
        { name: liveMeeting.owner?.name || "Host", role: "Host" },
        { name: "Esther Howard", role: "Designer" },
        { name: "Arlene McCoy", role: "Product Manager" },
      ];
    }

    return attendees;
  }, [liveMeeting]);

  if (isLoading) {
    return <AppLoader />;
  }

  // If NO live meeting is active, render clean empty state with quick actions
  if (!liveMeeting) {
    return (
      <div className="flex h-full w-full items-center justify-center p-4">
        <div className="w-full max-w-2xl rounded-3xl p-12 text-center dark:bg-transparent">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl text-red-600">
            <span className="relative flex h-6 w-6">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex h-6 w-6 rounded-full bg-red-500"></span>
            </span>
          </div>

          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            No live meeting in progress
          </h2>
          <p className="text-md mx-auto mt-4 max-w-2xl text-gray-500 dark:text-zinc-400">
            Join a Google Meet or Zoom meeting, or launch a quick meeting to
            activate real-time recording and AI transcription.
          </p>

          <div className="mt-8 flex justify-center">
            <button
              onClick={handleStartQuickLive}
              disabled={createMutation.isPending}
              className="cursor-pointer rounded-xl bg-[#5b09c4] px-6 py-3 text-lg font-semibold text-white transition-colors hover:bg-[#5b09c4]/90 disabled:opacity-50"
            >
              {createMutation.isPending
                ? "Starting..."
                : "+ Start Quick Live Meeting"}
            </button>
          </div>

          {scheduled.length > 0 && (
            <div className="mt-10 pt-6 text-left">
              <h3 className="mb-3 text-sm font-semibold tracking-wider text-gray-500 uppercase dark:text-zinc-400">
                Or start a scheduled meeting
              </h3>
              <div className="max-h-[260px] space-y-3 overflow-y-auto pr-1">
                {scheduled.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center justify-between rounded-xl p-4 text-sm"
                  >
                    <div className="min-w-0 flex-1 pr-4">
                      <p className="truncate font-semibold text-gray-900 dark:text-white">
                        {m.title}
                      </p>
                      <p className="truncate text-sm text-gray-400">
                        {m.description || "No description"}
                      </p>
                    </div>
                    <button
                      onClick={() => handleGoLive(m.id)}
                      disabled={updateMutation.isPending}
                      className="shrink-0 cursor-pointer rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-500 disabled:opacity-50"
                    >
                      Go Live
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // If a live meeting IS active, render active canvas and dynamic transcript
  return (
    <div className="relative flex h-full w-full overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl dark:border-white/10 dark:bg-black">
      {/* ================= LEFT MAIN ================= */}
      <div
        className={`relative flex flex-1 flex-col transition-all duration-500 ${
          showTranscript ? "pr-0 sm:pr-[33%] md:pr-[25%]" : ""
        }`}
      >
        {/* Title */}
        <div className="space-y-2 pt-14 text-center">
          <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-red-600 dark:text-red-400">
            <span className="h-2 w-2 animate-ping rounded-full bg-red-600" />
            <span>Live meeting in progress</span>
          </div>

          <h1 className="text-4xl font-semibold tracking-tight text-gray-900 dark:text-white">
            {liveMeeting.title}
            <span className="relative ml-2 inline-block">Meeting</span>
          </h1>
        </div>

        {/* Animated center */}
        <div className="relative flex flex-1 items-center justify-center">
          <OrbitVisual />
          <AvatarCards participants={participants} />
        </div>

        {/* CTA */}
        <div className="flex flex-col items-center justify-center gap-3 pb-10">
          <button
            onClick={() => setShowTranscript((v) => !v)}
            className="group inline-flex cursor-pointer items-center gap-1 text-sm font-medium text-gray-800 hover:text-black dark:text-gray-200 dark:hover:text-white"
          >
            {showTranscript ? "Hide live transcript" : "View live transcript"}
            <span className="transition group-hover:translate-x-0.5">↗</span>
          </button>

          <button
            onClick={handleEndMeeting}
            disabled={updateMutation.isPending}
            className="mt-2 cursor-pointer rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-500 disabled:opacity-50"
          >
            {updateMutation.isPending ? "Ending..." : "End Live Meeting"}
          </button>
        </div>
      </div>

      {/* ================= TRANSCRIPT SIDE ================= */}
      {showTranscript && (
        <div className="absolute top-0 right-0 h-full w-full border-l border-gray-200 bg-white sm:w-1/3 md:w-1/4 dark:border-white/10 dark:bg-zinc-950">
          <LiveTranscript meetingId={liveMeeting.id} />
        </div>
      )}
    </div>
  );
}
