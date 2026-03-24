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
      className="relative w-full bg-black text-[#282828] pt-20 pb-14 overflow-hidden"
    >
      {/* GIANT BACKGROUND TEXT WITH SLOW FLOAT */}
      <motion.div
        className="
          pointer-events-none select-none 
          absolute md:bottom-[-20%] bottom-[-4%] left-1/2 -translate-x-1/2
          opacity-[0.05] text-[6rem] md:text-[24rem] font-bold text-white leading-none
        "
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      >
        Meeteller
      </motion.div>

      {/* TOP SECTION */}
      <div
        className="
          relative z-10 
          max-w-7xl mx-auto px-6
          grid grid-cols-2 md:grid-cols-4 
          gap-12
        "
      >
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
            links: ["Features", "Platforms", "Ecosystem", "Integrations"],
          },
          {
            title: "Pricing",
            links: ["Individual", "Pro", "Teams"],
          },
          {
            title: "Download",
            links: ["iOS app", "Android app", "Chrome extension", "Desktop"],
          },
          {
            title: "Social",
            links: ["LinkedIn", "X"],
          },
        ].map((section, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: idx * 0.15 }}
            viewport={{ once: true }}
          >
            <h4 className="font-medium text-white mb-4">{section.title}</h4>

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
        className="
          relative z-10 
          max-w-7xl mx-auto px-6 mt-20 pt-8 
          border-t border-[#5b09c4] 
          flex flex-col md:flex-row 
          items-start md:items-center 
          justify-between 
          text-white text-sm gap-6
        "
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        viewport={{ once: true }}
      >
        <p>© {new Date().getFullYear()} Meeteller</p>

        <div className="flex flex-col md:flex-row gap-4 md:gap-6">
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
            )
          )}
        </div>
      </motion.div>
    </motion.footer>
  );
};
