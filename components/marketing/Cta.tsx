"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  const ref = useRef(null);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-[#5b09c4] py-28 text-white"
    >
      {/* FULL BACKGROUND IMAGE WITH MOTION */}
      <motion.div>
        <Image
          src="/d.jpg"
          alt="background"
          fill
          className="object-cover opacity-10"
          priority
        />
      </motion.div>

      {/* OPTIONAL GLOW (classy and subtle) */}
      <motion.div
        className="bg-gradient-to-b-from-transparent-via-[#ffffff0a]-to-transparent absolute inset-0"
        animate={{
          opacity: [0.06, 0.12, 0.06],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "mirror",
        }}
      />

      {/* CONTENT */}
      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        {/* Title */}
        <motion.h2
          className="font-helvetica mb-4 text-5xl font-bold"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          Ready to Level Up Your Meetings?
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          className="mb-8 font-light"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          viewport={{ once: true }}
        >
          Start using Meeteller today and get accurate notes, real summaries,
          and prioritized tasks automatically.
        </motion.p>

        {/* CTA BUTTON */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.96 }}>
            <Button
              asChild
              size="lg"
              className="text-[#5b09c4] bg-white hover:bg-white/80"
            >
              <Link href="/signup">Get Started</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
