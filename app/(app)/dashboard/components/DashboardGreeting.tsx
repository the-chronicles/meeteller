// import { ScribbleLine } from "./ScribbleLine";
import { TypingNotes } from "./TypingNotes";
import { AudioWaveCanvas } from "./AudioWaveCanvas";
// import { useUser } from "@/context/UserProvider";
import { useDayMood } from "@/hooks/useDayMood";
import { useAuth } from "@/hooks/useAuth";

export function DashboardGreeting() {
  const { user } = useAuth();
  const mood = useDayMood();
  const displayName = user?.name?.trim() || user?.email?.split("@")[0];

  const greeting =
    mood.label === "morning"
      ? "Good morning"
      : mood.label === "afternoon"
        ? "Good afternoon"
        : "Good evening";

  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white/40 p-8 backdrop-blur-xl md:p-40 dark:border-white/10 dark:bg-[#282828]">
      {/* <AudioWaveCanvas /> */}

      <div className="relative z-10 space-y-4 text-center">
        <h2 className="font-helvetica text-2xl font-bold text-gray-900 sm:text-4xl dark:text-white">
          {greeting},
          {displayName && (
            <span className="text-gray-500 dark:text-gray-400">
              {` ${displayName}`}
            </span>
          )}{" "}
          👋
        </h2>

        <p className="text-xl text-gray-600 dark:text-gray-400">
          Let&apos;s make today productive!
        </p>
        <TypingNotes />
        {/* <ScribbleLine /> */}
      </div>
    </div>
  );
}
