"use client";

import React from "react";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import tetsAnimation from "@/public/illustrations/Tets.json";
import notesAnimation from "@/public/illustrations/meeteller_notes_arrive.json";
import soundAnimation from "@/public/illustrations/Audio&Voice-A-002.json";

function HowItWorks() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-white px-4 pt-32 pb-40 text-center md:min-h-screen md:pt-40">
      {/* // <div className="flex min-h-screen bg-white px-4 pt-32"> */}
      <motion.div
        className="relative z-10 mx-auto mt-15 flex max-w-7xl flex-col items-center"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        ></motion.div>

        <motion.p
          className="font-regular max-w-3xl text-[18px] text-[#8c8b8b]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
        ></motion.p>
        <motion.p
          className="mt-3 max-w-2xl text-[18px] font-light text-[#8c8b8b]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
        ></motion.p>

        <motion.div
          className="mt-5 flex justify-center gap-4"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.2 },
            },
          }}
        >
          <motion.div
            variants={{
              hidden: { y: 20, opacity: 0 },
              visible: { y: 0, opacity: 1 },
            }}
          >
            <Button
              asChild
              size="lg"
              className="bg-[#5b09c4] text-white hover:bg-[#5b09c4]/80"
            >
              <Link href="/signup">Download Chrome Extension →</Link>
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
      {/* </div> */}

      <div className="mx-auto mt-16 max-w-7xl space-y-2 text-left">
        {[
          {
            step: "Step 1",
            title: "Connect Once",
            subtitle: "Connect once. We handle the rest.",
            description:
              "Link your Google or Outlook calendar. That’s it.\nOur extension records conversations automatically. No copy-paste links. No “can you add the bot?”",
            animation: soundAnimation,
          },
          {
            step: "Step 2",
            title: "Built for you.",
            subtitle: "AI listens and understands",
            description: "While you talk, AI transcribes in real time.",
            animation: soundAnimation,
          },
          {
            step: "Step 3",
            title: "Meeting ends. Notes arrive.",
            subtitle: "Get Notes",
            description:
              "2 minutes after your meeting, get:\n1. Smart summary of key points\n2. Action items with who + deadline\n3. Searchable transcript with timestamps",
            animation: soundAnimation,
          },
        ].map((item, index) => (
          <motion.div
            key={item.step}
            className="grid gap-10 p-8 md:grid-cols-2 md:items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.1 }}
          >
            <div className="space-y-2 text-left md:pr-8">
              <span className="text-2xl font-medium text-black">
                {item.step}
              </span>
              <h2 className="font-helvetica text-3xl font-bold text-[#5b09c4] sm:text-4xl">
                {item.title}
              </h2>
              <p className="text-lg font-medium text-[#374151]">
                {item.subtitle}
              </p>
              <p className="max-w-2xl text-lg font-light whitespace-pre-line text-[#6b7280]">
                {item.description}
              </p>
            </div>
            <div className="flex h-100 items-center justify-center rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <Lottie
                animationData={item.animation}
                loop={true}
                className="h-full w-full"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default HowItWorks;
