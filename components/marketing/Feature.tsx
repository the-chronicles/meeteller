"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const features = [
  {
    title: "Accurate Transcription",
    text: "Real-time meeting transcription with high accuracy.",
    image: "/double.png",
  },
  {
    title: "Smart Summaries",
    text: "AI-generated summaries that capture decisions & next steps.",
    image: "/features/summaries.png",
  },
  {
    title: "Task Management",
    text: "Automatically identifies tasks, owners and deadlines.",
    image: "/features/tasks.png",
  },
  {
    title: "Multi-lingual Playback",
    text: "Playback your meeting in African or global accents.",
    image: "/features/playback.png",
  },
  {
    title: "Calendar Automation",
    text: "Sync reminders and meeting notes to your calendar.",
    image: "/features/calendar.png",
  },
  {
    title: "Works Everywhere",
    text: "Use Meeteller on browser, desktop, mobile and extensions.",
    image: "/features/everywhere.png",
  },
];

export default function FeatureGrid() {
  const [openIndex, setOpenIndex] = useState(0);

  const imageRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: imageRef,
    offset: ["start end", "end start"],
  });

  // Parallax motion (moves slightly on scroll)
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -60]); // adjust stronger/weaker
  const parallaxScale = useTransform(scrollYProgress, [0, 1], [1.05, 1]); // subtle zoom effect

  return (
    <section className="py-20 px-6 bg-white">
      <motion.h2
        className="text-4xl text-[#282828] font-bold text-center mb-4"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Powerful Features
      </motion.h2>

      <motion.p
        className="text-center text-[#8c8b8b] mb-14 max-w-xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.6 }}
      >
        Meeteller doesn’t just take notes — it understands context, detects tasks, and keeps your team aligned.
      </motion.p>

      <motion.div
        className="
          max-w-7xl mx-auto flex flex-col md:flex-row items-center 
          bg-white shadow-lg justify-center rounded-3xl 
          px-3 py-10 md:p-20 gap-10 md:gap-20
        "
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* LEFT SIDE – ACCORDION */}
        <div className="w-full md:w-2/6 p-4 md:p-8">
          {features.map((f, index) => {
            const isOpen = openIndex === index;

            return (
              <motion.div
                key={index}
                className="border-b text-[#282828] border-gray-300 py-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
              >
                <button
                  className="w-full flex items-center justify-between text-left"
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                >
                  <motion.span
                    className="text-xl font-semibold"
                    whileTap={{ scale: 0.97 }}
                  >
                    {f.title}
                  </motion.span>

                  {isOpen ? <ChevronUp /> : <ChevronDown />}
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.p
                      className="mt-4 text-[#8c8b8b] leading-relaxed"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {f.text}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* RIGHT SIDE – IMAGE WITH PARALLAX + BLUR ZOOM TRANSITION */}
        <div className="w-full md:w-4/6 flex justify-center">
          <motion.div
            ref={imageRef}
            style={{ y: parallaxY, scale: parallaxScale }}
            className="relative w-full"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={features[openIndex]?.image}
                initial={{ opacity: 0, scale: 1.05, filter: "blur(12px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.97, filter: "blur(10px)" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <Image
                  src={features[openIndex]?.image}
                  alt={features[openIndex]?.title}
                  width={2000}
                  height={1200}
                  className="w-full h-auto"
                />
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
