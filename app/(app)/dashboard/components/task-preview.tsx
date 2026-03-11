import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

const tasks = [
  "Send follow-up email to client",
  "Prepare roadmap summary",
  "Review action items",
];

export function TasksPreview() {
  return (
    <div className="">
      <div className="flex items-center justify-between rounded-t-xl border border-b border-[#5b09c4] bg-[#5b09c4] px-4 py-3">
        {/* <h3 className="font-medium text-white">Your Tasks</h3> */}
        <Link href="/tasks" className="text-xs text-white hover:underline">
          View all
        </Link>
      </div>

      <div className="space-y-3 shadow-sm rounded-b-xl dark:shadow-sm/30 dark:shadow-[#8c8b8b] bg-white p-4 dark:bg-black dark:text-[#8c8b8b]">
        {tasks.map((task, i) => (
          <div key={i} className="flex items-start gap-2">
            <CheckCircle2 size={16} className="mt-0.5 text-gray-400" />
            <p className="text-sm">{task}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
