"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      viewport={{ once: true }}
      className="relative w-full overflow-hidden bg-black pt-20 pb-14 text-[#282828]"
    >
      {/* GIANT BACKGROUND TEXT WITH SLOW FLOAT */}
      <motion.div
        className="pointer-events-none absolute bottom-[-4%] left-1/2 -translate-x-1/2 text-[6rem] leading-none font-bold text-white opacity-[0.05] select-none md:bottom-[-20%] md:text-[18rem]"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      >
        Meeteller
      </motion.div>

      {/* TOP SECTION */}
      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-2 gap-12 px-6 md:grid-cols-4">
        {/* LOGO */}
        <motion.div
          className="col-span-2 md:col-span-1"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <Image
            src="/logo-white.png"
            alt="Logo"
            width={120}
            height={40}
            className="mb-6"
          />
        </motion.div>

        {/* LINKS — Stagger Animation */}
        {[
          {
            title: "How It Works",
            links: [""],
          },
          {
            title: "Pricing",
            links: ["Individual", "Teams"],
          },
          {
            title: "Download",
            links: [
              "iOS app (Coming Soon)",
              "Android app (Coming Soon)",
              "Chrome extension (Coming Soon)",
              "Desktop (Coming Soon)",
            ],
          },
        ].map((section, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: idx * 0.15 }}
            viewport={{ once: true }}
          >
            <h4 className="mb-4 font-medium text-white">{section.title}</h4>

            {/* Sub-links */}
            <motion.ul
              className="space-y-2 text-[#8c8b8b]"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: {},
                visible: {
                  transition: { staggerChildren: 0.15 },
                },
              }}
            >
              {section.links.map((item, i) => (
                <motion.li
                  key={i}
                  variants={{
                    hidden: { opacity: 0, x: -10 },
                    visible: { opacity: 1, x: 0 },
                  }}
                  whileHover={{ x: 4, opacity: 1 }}
                  transition={{ duration: 0.25 }}
                  className="text-sm font-light text-[#8c8b8b] hover:text-gray-300"
                >
                  <Link href="#">{item}</Link>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        ))}
      </div>

      {/* BOTTOM FOOTER */}
      <motion.div
        className="relative z-10 mx-auto mt-20 flex max-w-7xl flex-col items-start justify-between gap-6 border-t border-[#5b09c4] px-6 pt-8 text-sm text-white md:flex-row md:items-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        viewport={{ once: true }}
      >
        <p>© {new Date().getFullYear()} Meeteller</p>

        <div className="flex flex-col gap-4 md:flex-row md:gap-6">
          {["Privacy policy", "Terms of service", "Cookie settings"].map(
            (item, i) => (
              <motion.div
                key={i}
                whileHover={{ x: 5, opacity: 0.9 }}
                transition={{ duration: 0.25 }}
              >
                <Link href="" className="hover:text-gray-300">
                  {item}
                </Link>
              </motion.div>
            ),
          )}
        </div>
      </motion.div>
    </motion.footer>
  );
};
