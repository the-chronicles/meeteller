"use client";

import { useMemo } from "react";
import { MeetingHeader } from "./components/meeting-header";
import { AudioPlayer } from "./components/audio-player";
import { SummaryPanel } from "./components/summary-panel";
import { TasksPanel } from "./components/tasks-panel";
import { TranscriptPanel } from "./components/transcript-panel";

export default function MeetingDetailPage() {
  // later: fetch by id from route params
  const meeting = useMemo(
    () => ({
      id: "1",
      title: "Meeting Summary",
      subtitle: "Key takeaways and action items from the latest team meeting.",
      meetingName: "Product Sync Meeting",
      dateLabel: "December 16, 2025",
      durationLabel: "45 minutes",
      topic: "Q3 Planning and Goal Setting",
      objectives:
        "Discuss and finalize Q3 goals, assign responsibilities, and identify potential roadblocks.",
      decisions: [
        "Increase monthly active users by 15%",
        "Launch new feature X by end of Q3",
        "Hire 2 additional engineers to support development",
      ],
      attendees: [
        { name: "John Doe", avatar: "/avatars/1.png" },
        { name: "Jane Smith", avatar: "/avatars/2.png" },
        { name: "Michael Johnson", avatar: "/avatars/3.png" },
        { name: "Emily Davis", avatar: "/avatars/4.png" },
      ],
      summary:
        "The council reviewed and adopted the 2025 financial plan, including operating and capital budgets. Concerns were raised regarding public engagement and a projected 17–21% tax increase following reassessment. Council emphasized fiscal responsibility while planning for long-term infrastructure needs.",
      actionItems: [
        {
          id: "t1",
          title: "Improve onboarding flow",
          assignee: "Jane Smith",
          dueISO: "2026-03-15",
          status: "Completed" as const,
        },
        {
          id: "t2",
          title: "Optimize search algorithm",
          assignee: "Michael Johnson",
          dueISO: "2026-04-01",
          status: "In Progress" as const,
        },
        {
          id: "t3",
          title: "Implement reporting dashboard",
          assignee: "Emily Davis",
          dueISO: "2026-04-30",
          status: "Not Started" as const,
        },
      ],
      transcript: [
        { speaker: "Mayor", text: "This is the special meeting to discuss the 2025 financial plan..." },
        { speaker: "Councillor Miller", text: "I have concerns regarding public engagement and rising tax rates..." },
      ],
    }),
    [],
  );

  return (
    <div className="min-h-screen bg-[#F6F8FB] p-6 dark:bg-black">
      <div className="mx-auto max-w-4xl space-y-4">
        <MeetingHeader meeting={meeting} />

        {/* keep your intent: playback stays */}
        <AudioPlayer />

        {/* MAIN CARD like screenshot */}
        <div
          id="meeting-summary"
          className="rounded-2xl border bg-white p-6 shadow-sm dark:bg-[#0a0014]"
        >
          <SummaryPanel meeting={meeting} />

          <div className="mt-6 border-t pt-6">
            <TasksPanel items={meeting.actionItems} />
          </div>
        </div>

        {/* Transcript as separate panel below (still consistent) */}
        <TranscriptPanel transcript={meeting.transcript} />
      </div>
    </div>
  );
}