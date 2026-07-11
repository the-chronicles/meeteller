"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const products = [
  {
    title: "Web Dashboard",
    href: "/product/web",
    description: "Manage meetings, tasks, and summaries.",
  },
  {
    title: "Desktop App",
    href: "/product/desktop",
    description: "Floating assistant on Mac & Windows.",
  },
  {
    title: "Browser Extension",
    href: "/product/extension",
    description: "Works inside Google Meet, Zoom, Teams.",
  },
  {
    title: "Mobile App",
    href: "/product/mobile",
    description: "Transcribe & summarize on the go.",
  },
];

export const ProductCards = () => {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="font-helvetica mb-3 text-center text-5xl font-semibold tracking-tight">
          Built for the conversations that matter.
        </h2>

        <p className="font-dm-sans mx-auto max-w-2xl text-center font-light text-[#8c8b8b]">
          No matter what your role is or where your work takes you, you can
          spend less time remembering the conversation—and more time acting on
          it.{" "}
        </p>

        <motion.div
          className="relative z-10 mx-auto mt-15 flex max-w-7xl flex-col items-center tracking-tight"
          // className="absolute bottom-0 left-1/2 z-20 flex w-full -translate-x-1/2 translate-y-1/3 justify-center md:translate-y-1/2"
          animate={{ y: [0, 0, 0] }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="w-full max-w-350 px-4">
            <Image
              src="/mmmm.png"
              alt="preview"
              width={2000}
              height={1200}
              className="w-full rounded-2xl shadow-2xl"
              style={{
                WebkitMaskImage:
                  "linear-gradient(to bottom, white 40%, transparent 100%)",
                maskImage:
                  "linear-gradient(to bottom, white 40%, transparent 100%)",
              }}
            />
          </div>
        </motion.div>

        {/* <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          {products.map((p) => (
            <Link
              key={p.title}
              href={p.href}
              className="rounded-xl border p-6 transition hover:shadow-lg"
            >
              <h3 className="text-lg font-semibold">{p.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{p.description}</p>
            </Link>
          ))}
        </div> */}
      </div>
    </section>
  );
};
