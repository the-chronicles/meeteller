"use client";

import { useParams } from "next/navigation";

import AppLoader from "@/components/ui/AppLoader";

// import { useMeeting } from "@/hooks/useMeeting";

import { AudioPlayer } from "./components/audio-player";

import { MeetingHeader } from "./components/meeting-header";

import { SummaryPanel } from "./components/summary-panel";

import { TasksPanel } from "./components/tasks-panel";

import { TranscriptPanel } from "./components/transcript-panel";
import { useMeeting } from "@/hooks/useMeetings";

export default function MeetingDetailPage() {
  const params = useParams();

  const id = params.id as string;

  const { data: meeting, isLoading } = useMeeting(id);

  if (isLoading) {
    return <AppLoader />;
  }

  if (!meeting) {
    return <div className="p-6">Meeting not found.</div>;
  }

  return (
    <div className="space-y-4 p-2 bg-transparent">
      <div className="mx-auto max-w-4xl space-y-4">
        <MeetingHeader
          meeting={{
            id: String(meeting.id),

            title: meeting.title,

            subtitle: meeting.description || "Meeting details",

            meetingName: meeting.title,

            dateLabel: new Date(meeting.createdAt).toLocaleDateString(),

            durationLabel: meeting.isLive ? "Live" : meeting.status,
          }}
        />

        <AudioPlayer />

        <div
          id="meeting-summary"
          className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#0a0014]"
        >
          <SummaryPanel
            meeting={{
              meetingName: meeting.title,

              dateLabel: new Date(meeting.createdAt).toLocaleDateString(),

              durationLabel: meeting.status,

              topic: meeting.title,

              attendees: [
                {
                  name: meeting.owner?.name || "Unknown",

                  avatar: meeting.owner?.picture || "/avatar.png",
                },
              ],

              objectives: meeting.description || "No objectives provided.",

              decisions: [],

              summary: meeting.description || "No summary yet.",
            }}
          />

          <div className="mt-6 border-t border-gray-200 dark:border-white/10 pt-6">
            <TasksPanel items={[]} />
          </div>
        </div>

        <TranscriptPanel transcript={[]} />
      </div>
    </div>
  );
}
