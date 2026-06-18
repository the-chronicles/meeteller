"use client";

import { useParams } from "next/navigation";

import AppLoader from "@/components/ui/AppLoader";

// import { useMeeting } from "@/hooks/useMeeting";

// import { AudioPlayer } from "./components/audio-player";

import { MeetingHeader } from "./components/meeting-header";

import { SummaryPanel } from "./components/summary-panel";

import { TranscriptPanel } from "./components/transcript-panel";
import {
  useMeeting,
  useMeetingInsights,
  useMeetingTranscript,
} from "@/hooks/useMeetings";

export default function MeetingDetailPage() {
  const params = useParams();

  const id = params.id as string;

  const { data: meeting, isLoading } = useMeeting(id);
  const { data: insights } = useMeetingInsights(id);
  const { data: transcriptData } = useMeetingTranscript(id);

  if (isLoading) {
    return <AppLoader />;
  }

  if (!meeting) {
    return <div className="p-6">Meeting not found.</div>;
  }

  const tasks =
    insights?.actionItems?.map((title: string, index: number) => ({
      id: `insight-task-${index}`,
      title,
      assignee: meeting.owner?.name || "Unknown",
      dueISO: new Date(meeting.createdAt).toISOString(),
      status: "Not Started" as const,
    })) || [];

  const segments =
    transcriptData?.segments?.map((seg: any) => ({
      speaker: seg.speaker || "Speaker",
      text: seg.text,
    })) || [];

  return (
    <div className="space-y-4 bg-transparent p-2">
      <div className="max-w-8xl mx-auto space-y-4">
        <MeetingHeader
          meeting={{
            id: String(meeting.id),

            title: meeting.title,

            subtitle: meeting.description || "Meeting details",

            meetingName: meeting.title,

            dateLabel: new Date(meeting.createdAt).toLocaleDateString(),

            durationLabel: meeting.isLive ? "Live" : meeting.status,

            createdAt: meeting.createdAt,
          }}
        />

        {/* <AudioPlayer /> */}

        <div
          id="meeting-summary"
          className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#282828]"
        >
          {meeting.status === "processing" && (
            <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900/30 dark:bg-amber-950/20 dark:text-amber-300">
              <div className="flex items-center gap-2 font-medium">
                <span className="h-2 w-2 animate-ping rounded-full bg-amber-500" />
                <span>AI is currently processing your meeting insights...</span>
              </div>
              <p className="mt-1 text-xs opacity-90">
                We are generating the summary, key decisions, and action items.
                This usually takes less than a minute.
              </p>
            </div>
          )}

          <SummaryPanel
            meeting={{
              meetingName: meeting.title,
              objectives: meeting.description || "No objectives provided.",
              decisions: insights?.keyDecisions || [],
              summary:
                insights?.summary || meeting.description || "No summary yet.",
            }}
            tasks={tasks}
          />
        </div>

        <TranscriptPanel transcript={segments} />
      </div>
    </div>
  );
}
