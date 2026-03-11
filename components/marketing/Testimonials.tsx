"use client";

import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Amina Yusuf",
    role: "HR Manager · Lagos",
    text: "Meeteller has changed the way we run meetings. The summaries and task extraction are incredibly accurate.",
    bg: "bg-[#C4B5FD]" // purple
  },
  {
    name: "Kwame Mensah",
    role: "Product Lead · Accra",
    text: "The African TTS voices feel so natural — we use them for team playback after every meeting.",
    bg: "bg-[#FEF08A]" // yellow
  },
  {
    name: "Sarah Adewale",
    role: "Operations · Nairobi",
    text: "The extension joining meetings automatically is a killer feature. Zero manual setup.",
    bg: "bg-[#E5E7EB]" // light gray
  },
  {
    name: "James Okoro",
    role: "Founder · Abuja",
    text: "Meeteller has become an essential part of my workflow. The AI summaries save me HOURS every week.",
    bg: "bg-[#1F2937] text-white" // dark
  }
];

export default function Testimonials() {
  return (
    <section className="py-32 relative overflow-hidden">

      {/* Background Behind White Box */}
      <div className="absolute inset-0 bg-[url('/2.png')] bg-black bg-cover"></div>

      {/* White Rounded Container */}
      <div className="
        relative max-w-7xl mx-auto bg-white rounded-3xl 
        shadow-xl px-10 md:px-20 py-20 overflow-visible
      ">
        {/* LEFT SIDE */}
        <div className="flex flex-col md:flex-row gap-16 relative justify-center items-center">

          <div className="md:w-1/2 z-10">
            <h2 className="text-5xl font-bold mb-4 text-[#282828]">
              Loved by Teams Across The World
            </h2>
            <p className="text-xl text-[#8c8b8b] mb-2">
              Professionals rely on Meeteller to handle everything from note-taking to task automation.
            </p>
          </div>

          {/* RIGHT SIDE — FREE DRAG AREA */}
          <div className="md:w-1/2 relative h-[420px] overflow-visible">

            {/* Position + Rotation Just Like Screenshot */}
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                drag
                dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
                dragElastic={0.9}
                dragMomentum={false}
                whileDrag={{ scale: 1.05, rotate: 0 }}
                className={`
                  absolute p-6 w-72 rounded-xl shadow-xl cursor-grab active:cursor-grabbing 
                  ${t.bg}
                `}
                style={{
                  rotate: [-10, 6, -4, 8][i] || 0,
                  top: [0, 20, 140, 200][i] || 0,
                  left: [40, 160, 0, 120][i] || 0
                }}
              >
                {/* Stars */}
                <div className="flex gap-1 mb-3">
                  <span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span>
                </div>

                <p className="mb-4 leading-relaxed text-sm">{t.text}</p>

                <p className="font-semibold">{t.name}</p>
                <p className="opacity-70 text-xs">{t.role}</p>
              </motion.div>
            ))}

          </div>
        </div>
      </div>
    </section>
  );
}
