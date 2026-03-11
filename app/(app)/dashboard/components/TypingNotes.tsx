"use client";

import { useDayMood } from "@/hooks/useDayMood";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const notes = [
  "Review tasks",
  "Follow up meeting",
  "Plan next meeting",
  "Record meetings",
];

export function TypingNotes() {
  const [text, setText] = useState("");
  const [noteIndex, setNoteIndex] = useState(0);
  const mood = useDayMood();

  useEffect(() => {
    let i = 0;
    const current = notes[noteIndex];

    const interval = setInterval(() => {
      setText(current.slice(0, i));
      i++;

      if (i > current.length) {
        clearInterval(interval);
        setTimeout(() => {
          setText("");
          setNoteIndex((prev) => (prev + 1) % notes.length);
        }, 1200);
      }
    }, 80 / mood.speed);

    return () => clearInterval(interval);
  }, [noteIndex, mood.speed]);

  return (
    <div className="mx-auto inline-flex items-center justify-center text-gray-500 dark:text-gray-400">
      <span className="font-mono text-sm">
        {text}
        <motion.span
          className="h-4 w-0.5 bg-gray-400"
          animate={{ opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 1 }}
        />
      </span>
    </div>
  );
}