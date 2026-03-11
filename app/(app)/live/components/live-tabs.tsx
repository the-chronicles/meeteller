import { LiveTranscript } from "./live-transcript";
import { LiveSummary } from "./live-summary";
import { LiveTasks } from "./live-tasks";

export function LiveTabs() {
  return (
    <div className="grid grid-cols-3 gap-4 h-full">
      <LiveTranscript />
      <LiveSummary />
      <LiveTasks />
    </div>
  );
}
