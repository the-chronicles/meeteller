import { useDayMood } from "@/hooks/useDayMood";
import { motion } from "framer-motion";

export function ScribbleLine() {
  const mood = useDayMood();

  return (
    <svg viewBox="0 0 300 60" className="mx-auto h-14 w-72">
      <motion.path
        d="M5 30 C 40 10, 80 50, 120 30 
           C 160 10, 200 50, 240 30
           C 260 20, 280 40, 295 30"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        className="text-[#5b09c4] dark:text-gray-500"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{
          duration: 2 / mood.speed,
          repeat: Infinity,
          repeatType: "loop",
          ease: "easeInOut",
        }}
      />
    </svg>
  );
}
