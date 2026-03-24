"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) setScrolled(true);
      else setScrolled(false);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="pointer-events-none fixed top-0 left-0 z-50 mt-10 flex w-full justify-center">
      {/* Centered Container */}
      
      <div
        className={`pointer-events-auto rounded-md flex h-16 w-[90%] items-center justify-between px-8 py-9 transition-all duration-300 md:w-[70%] lg:w-[55%] ${
          scrolled
            ? "bg-gray-100/70 shadow-xl backdrop-blur-xl"
            : "bg-white shadow-sm"
        } `}
      >
                  {/* <div className="pointer-events-none absolute top-0 left-0 z-10 h-full w-20 bg-linear-to-r from-white to-transparent" /> */}
          {/* <div className="pointer-events-none absolute top-0 right-0 z-10 h-full w-20 bg-linear-to-l from-white to-transparent" /> */}

        {/* Logo */}
        <Link href="/" className="shrink-0">
          <Image
            src="/wordmark.png"
            alt="Meeteller Logo"
            width={120}
            height={10}
          />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden items-center gap-8 text-[15px] md:flex">
          <Link href="/how-it-works" className="hover:text-[#5b09c4]">
            How It Works
          </Link>
          <Link href="/pricing" className="hover:text-[#5b09c4]">
            Pricing
          </Link>
          <Link href="/faqs" className="hover:text-[#5b09c4]">
            FAQs
          </Link>
        </div>

        {/* Login / CTA */}
        <div className="hidden items-center gap-6 text-[15px] md:flex">
          <Link href="/login">Login</Link>
          <Link
            href="/signup"
            className=" bg-[#5b09c4] rounded-md px-4 py-2 text-white transition hover:bg-[#5b09c4]/90"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          ☰
        </button>

        {/* Mobile Dropdown */}
        {open && (
          <div className="absolute top-20 left-0 flex w-full flex-col gap-4 rounded-lg border-b bg-white p-6 shadow-lg md:hidden">
            <Link href="/how-it-works">How It Works</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/faqs">FAQs</Link>
            <Link href="https://app.mav4.com" className="text-blue-600">
              Sign In
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};
