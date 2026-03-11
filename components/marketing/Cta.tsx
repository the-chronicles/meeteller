"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRef } from "react";

export function CTASection() {
  const ref = useRef(null);


  return (
    <section
      ref={ref}
      className="relative py-28 bg-[#5b09c4] text-white overflow-hidden"
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
        className="absolute inset-0 bg-gradient-to-b-from-transparent-via-[#ffffff0a]-to-transparent"
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
      <div className="relative max-w-4xl mx-auto text-center px-6 z-10">
        {/* Title */}
        <motion.h2
          className="text-4xl font-bold mb-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          Ready to Level Up Your Meetings?
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          className="text-lg mb-8 opacity-90"
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
            <Link
              href="/auth/signup"
              className="px-8 py-4 bg-white text-[#5b09c4] font-semibold rounded-sm shadow transition"
            >
              Download Now
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
