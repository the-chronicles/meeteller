// import { ScribbleLine } from "./ScribbleLine";
import { TypingNotes } from "./TypingNotes";
import { AudioWaveCanvas } from "./AudioWaveCanvas";
import { useUser } from "@/context/UserProvider";
import { useDayMood } from "@/hooks/useDayMood";

export function DashboardGreeting() {
  const { user } = useUser();
  const mood = useDayMood();

  const greeting =
    mood.label === "morning"
      ? "Good morning"
      : mood.label === "afternoon"
      ? "Good afternoon"
      : "Good evening";

  return (
    <div className="relative overflow-hidden bg-white p-30 backdrop-blur-xl dark:bg-black">
      <AudioWaveCanvas />

      <div className="relative z-10 space-y-4 text-center">
        <h2 className="text-5xl font-bold text-gray-900 dark:text-white">
          {greeting},
          {user?.email && (
            <span className="text-gray-500 dark:text-gray-400">
              {` ${user.email.split("@")[0]}`}
            </span>
          )}
          👋
        </h2>

        <p className="text-2xl text-gray-600 dark:text-gray-400">
          Let&apos;s make today productive!
        </p>
        <TypingNotes />
        {/* <ScribbleLine /> */}


      </div>
    </div>
  );
}
