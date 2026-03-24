// "use client";

// import { useState } from "react";
// import Image from "next/image";
// import { ChevronDown, ChevronUp } from "lucide-react";
// import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
// import { useRef } from "react";

// const features = [
//   {
//     title: "Accurate Transcription",
//     text: "Real-time meeting transcription with high accuracy.",
//     image: "/double.png",
//   },
//   {
//     title: "Smart Summaries",
//     text: "AI-generated summaries that capture decisions & next steps.",
//     image: "/features/summaries.png",
//   },
//   {
//     title: "Task Management",
//     text: "Automatically identifies tasks, owners and deadlines.",
//     image: "/features/tasks.png",
//   },
//   {
//     title: "Multi-lingual Playback",
//     text: "Playback your meeting in African or global accents.",
//     image: "/features/playback.png",
//   },
//   {
//     title: "Calendar Automation",
//     text: "Sync reminders and meeting notes to your calendar.",
//     image: "/features/calendar.png",
//   },
//   {
//     title: "Works Everywhere",
//     text: "Use Meeteller on browser, desktop, mobile and extensions.",
//     image: "/features/everywhere.png",
//   },
// ];

// export default function FeatureGrid() {
//   const [openIndex, setOpenIndex] = useState(0);

//   const imageRef = useRef(null);
//   const { scrollYProgress } = useScroll({
//     target: imageRef,
//     offset: ["start end", "end start"],
//   });

//   // Parallax motion (moves slightly on scroll)
//   const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -60]); // adjust stronger/weaker
//   const parallaxScale = useTransform(scrollYProgress, [0, 1], [1.05, 1]); // subtle zoom effect

//   return (
//     <section className="py-20 px-6 bg-white">
//       <motion.h2
//         className="text-4xl text-[#282828] font-bold text-center mb-4"
//         initial={{ opacity: 0, y: 30 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//       >
//         Powerful Features
//       </motion.h2>

//       <motion.p
//         className="text-center text-[#8c8b8b] mb-14 max-w-xl mx-auto"
//         initial={{ opacity: 0, y: 30 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.15, duration: 0.6 }}
//       >
//         Meeteller doesn’t just take notes — it understands context, detects tasks, and keeps your team aligned.
//       </motion.p>

//       <motion.div
//         className="
//           max-w-7xl mx-auto flex flex-col md:flex-row items-center
//           bg-white shadow-lg justify-center rounded-3xl
//           px-3 py-10 md:p-20 gap-10 md:gap-20
//         "
//         initial={{ opacity: 0, scale: 0.95 }}
//         whileInView={{ opacity: 1, scale: 1 }}
//         transition={{ duration: 0.6 }}
//       >
//         {/* LEFT SIDE – ACCORDION */}
//         <div className="w-full md:w-2/6 p-4 md:p-8">
//           {features.map((f, index) => {
//             const isOpen = openIndex === index;

//             return (
//               <motion.div
//                 key={index}
//                 className="border-b text-[#282828] border-gray-300 py-6"
//                 initial={{ opacity: 0, y: 20 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 transition={{ delay: index * 0.1, duration: 0.4 }}
//               >
//                 <button
//                   className="w-full flex items-center justify-between text-left"
//                   onClick={() => setOpenIndex(isOpen ? -1 : index)}
//                 >
//                   <motion.span
//                     className="text-xl font-semibold"
//                     whileTap={{ scale: 0.97 }}
//                   >
//                     {f.title}
//                   </motion.span>

//                   {isOpen ? <ChevronUp /> : <ChevronDown />}
//                 </button>

//                 <AnimatePresence>
//                   {isOpen && (
//                     <motion.p
//                       className="mt-4 text-[#8c8b8b] leading-relaxed"
//                       initial={{ opacity: 0, height: 0 }}
//                       animate={{ opacity: 1, height: "auto" }}
//                       exit={{ opacity: 0, height: 0 }}
//                       transition={{ duration: 0.3 }}
//                     >
//                       {f.text}
//                     </motion.p>
//                   )}
//                 </AnimatePresence>
//               </motion.div>
//             );
//           })}
//         </div>

//         {/* RIGHT SIDE – IMAGE WITH PARALLAX + BLUR ZOOM TRANSITION */}
//         <div className="w-full md:w-4/6 flex justify-center">
//           <motion.div
//             ref={imageRef}
//             style={{ y: parallaxY, scale: parallaxScale }}
//             className="relative w-full"
//           >
//             <AnimatePresence mode="wait">
//               <motion.div
//                 key={features[openIndex]?.image}
//                 initial={{ opacity: 0, scale: 1.05, filter: "blur(12px)" }}
//                 animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
//                 exit={{ opacity: 0, scale: 0.97, filter: "blur(10px)" }}
//                 transition={{ duration: 0.6, ease: "easeOut" }}
//               >
//                 <Image
//                   src={features[openIndex]?.image}
//                   alt={features[openIndex]?.title}
//                   width={2000}
//                   height={1200}
//                   className="w-full h-auto"
//                 />
//               </motion.div>
//             </AnimatePresence>
//           </motion.div>
//         </div>
//       </motion.div>
//     </section>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Pause, Play } from "lucide-react";
import Image from "next/image";

const features = [
  {
    id: 1,
    title: "Take control",
    description:
      "Manage access, roles, and permissions with confidence. Your workspace stays organised, secure, and fully in your hands.",
    accent: "#5b09c4",
    image: "/Test.png",
    imageAlt: "Dashboard control preview",
  },
  {
    id: 2,
    title: "Tailor it to you",
    description:
      "Adjust layouts, views, and appearance so the experience feels natural for the way you work best.",
    accent: "#f59e0b",
    image: "/Test.png",
    imageAlt: "Customizable dashboard preview",
  },
  {
    id: 3,
    title: "Hear it back",
    description:
      "Replay meeting moments and listen to AI voice summaries that keep everyone aligned without starting from scratch.",
    accent: "#22c55e",
    image: "/Test.png",
    imageAlt: "Audio meeting summary dashboard preview",
  },
  {
    id: 4,
    title: "Clarity through action",
    description:
      "Turn conversations into tasks and next steps instantly, so progress starts the moment the meeting ends.",
    accent: "#0ea5e9",
    image: "/Test.png",
    imageAlt: "Task tracking dashboard preview",
  },
];

const AUTOPLAY_DELAY = 6500;

export default function FeatureGrid() {
  const [page, setPage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setPage((prev) => (prev + 1) % features.length);
    }, AUTOPLAY_DELAY);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const currentFeature = features[page];

  return (
    <section className="bg-[#282828] px-4 py-16 md:px-6 md:py-24">
      <div className="mx-auto max-w-375">
        <div className="relative overflow-hidden rounded-[36px] bg-black">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentFeature.id}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -28 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="grid min-h-135 w-full grid-cols-1 lg:min-h-180 lg:grid-cols-[0.9fr_1.1fr]"
            >
              {/* Left content */}
              <div className="relative flex items-center px-8 py-12 md:px-12 lg:px-16 lg:py-16 xl:px-20">
                <div className="max-w-130">
                  <motion.h2
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.12, duration: 0.45 }}
                    className="font-helvetica bg-clip-text text-4xl font-semibold tracking-tight text-transparent md:text-5xl xl:text-6xl"
                    style={{
                      backgroundImage: `linear-gradient(to right, ${currentFeature.accent}, white)`,
                    }}
                  >
                    {currentFeature.title}
                  </motion.h2>

                  <motion.p
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.45 }}
                    className="mt-6 text-base leading-8 font-light text-[#8c8b8b] md:text-lg"
                  >
                    {currentFeature.description}
                  </motion.p>
                </div>
              </div>

              {/* Right image */}
              <div className="relative flex items-end justify-end overflow-hidden">
                <motion.div
                  initial={{ opacity: 0, x: 36, scale: 0.98 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ delay: 0.12, duration: 0.55, ease: "easeOut" }}
                  className="relative top-16 h-80 w-full sm:h-95 md:h-115 lg:h-full"
                >
                  <Image
                    src={currentFeature.image}
                    alt={currentFeature.imageAlt}
                    fill
                    className="rounded-l-[28px] rounded-r-none object-cover object-bottom-left"
                    priority={page === 0}
                  />
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            onClick={() => setIsPlaying((prev) => !prev)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d7d7dd] bg-white text-[#444] transition hover:bg-[#f8f8fa]"
            aria-label={isPlaying ? "Pause autoplay" : "Play autoplay"}
          >
            {isPlaying ? (
              <Pause size={16} />
            ) : (
              <Play size={16} className="ml-0.5" />
            )}
          </button>

          <div className="flex items-center gap-2.5">
            {features.map((feature, index) => (
              <button
                key={feature.id}
                onClick={() => setPage(index)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  index === page ? "w-8" : "w-2.5 bg-[#cfcfd6]"
                }`}
                style={
                  index === page
                    ? { backgroundColor: feature.accent }
                    : undefined
                }
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
