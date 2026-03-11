import { Mic, ClipboardList } from "lucide-react";

export function CalendarEventCard({
  type,
  title,
}: {
  type: "meeting" | "task";
  title: string;
}) {
  const isMeeting = type === "meeting";

  return (
    <div
      className={`mt-1 flex items-center gap-2 text-xs px-2 py-1 rounded-md
        ${
          isMeeting
            ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
            : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
        }
      `}
    >
      {isMeeting ? <Mic size={12} /> : <ClipboardList size={12} />}
      <span className="truncate">{title}</span>
    </div>
  );
}
