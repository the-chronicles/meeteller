"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const features = [
  "Accurate Transcription",
  "Smart Summaries",
  "Task Management",
  "Multi-lingual Playback",
  "Calendar Automation",
  "Works Everywhere",
];

export function FeatureCarousel() {
  // Duplicate features to make the infinite loop seamless
  const items = [...features, ...features, ...features];

  return (
    <section className="py-20 bg-[#282828] overflow-hidden">
      <h2 className="text-4xl text-white font-bold text-center mb-10">
        Powerful Features
      </h2>

      <div className="relative w-full overflow-hidden">
        <motion.div
          className="flex gap-6"
          initial={{ x: 0 }}
          animate={{ x: ["0%", "-100%"] }}
          transition={{
            repeat: Infinity,
            duration: 18,
            ease: "linear",
          }}
        >
          {items.map((title, i) => (
            <Link
              key={i}
              href="/how-it-works"
              className="flex-shrink-0 cursor-pointer"
            >
              <div
                className="
                px-10 py-5 
                bg-white 
                text-[#5b09c4] 
                font-semibold 
                text-lg 
                rounded-xl 
                shadow-md 
                hover:shadow-xl 
                hover:scale-105 
                transition 
                whitespace-nowrap
              "
              >
                {title}
              </div>
            </Link>
          ))}
        </motion.div>
      </div>

      {/* Gradient Fade on Sides */}
      <div className="absolute left-0 top-0 w-40 h-full bg-gradient-to-r from-[#282828] to-transparent" />
      <div className="absolute right-0 top-0 w-40 h-full bg-gradient-to-l from-[#282828] to-transparent" />
    </section>
  );
}
