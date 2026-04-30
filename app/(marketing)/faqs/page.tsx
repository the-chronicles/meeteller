import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import React from "react";

function FAQs() {
  return (
    <section className="bg-[#f5f2f8] px-4 pt-32 pb-24">
      {" "}
      <div className="mx-auto mt-20 grid max-w-7xl grid-cols-1 items-start gap-10 md:grid-cols-[1fr_1fr] md:gap-16">
        {" "}
        {/* LEFT SIDE */}
        <div>
          <h2 className="text-5xl leading-[1.1] font-bold text-[#1a1a1a]">
            Frequently asked <br /> questions
          </h2>

          {/* CTA CARD */}
          <div className="mt-12 max-w-md rounded-2xl border border-gray-100 bg-white p-8 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
            <h3 className="mb-2 text-lg font-semibold">
              Still have a questions?
            </h3>
            <p className="mb-5 text-sm leading-relaxed text-gray-500">
              Can’t find the answer to your question? Send us an email and we’ll
              get back to you as soon as possible!
            </p>
            <button className="rounded-lg bg-linear-to-r from-purple-600 to-purple-500 px-5 py-2 text-sm font-medium text-white">
              Send email
            </button>
          </div>
        </div>
        {/* RIGHT SIDE */}
        <div className="max-w-xl space-y-5">
          <Accordion type="single" collapsible className="space-y-5">
            <AccordionItem
              value="item-1"
              className="rounded-xl border border-gray-100 bg-white px-6 py-4 shadow-[0_6px_20px_rgba(0,0,0,0.04)]"
            >
              <AccordionTrigger className="text-left text-sm font-medium hover:no-underline">
                What is Meeteller and how does the AI note-taker work?
              </AccordionTrigger>
              <AccordionContent className="pt-2 text-sm text-gray-500">
                Meeteller is an AI-powered meeting assistant that automatically
                records, transcribes, and summarizes your meetings. It captures
                key points, action items, and decisions so you don’t have to
                take notes manually.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-2"
              className="rounded-xl border border-gray-100 bg-white px-6 py-4 shadow-[0_6px_20px_rgba(0,0,0,0.04)]"
            >
              <AccordionTrigger className="text-left text-sm font-medium hover:no-underline">
                How do I start using Meeteller for my meetings?
              </AccordionTrigger>
              <AccordionContent className="pt-2 text-sm text-gray-500">
                Simply sign up, connect your calendar or meeting platform, and
                let Meeteller join your sessions. It will automatically generate
                notes and summaries after each meeting.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-3"
              className="rounded-xl border border-gray-100 bg-white px-6 py-4 shadow-[0_6px_20px_rgba(0,0,0,0.04)]"
            >
              <AccordionTrigger className="text-left text-sm font-medium hover:no-underline">
                Is my meeting data and recordings secure?
              </AccordionTrigger>
              <AccordionContent className="pt-2 text-sm text-gray-500">
                Yes, Meeteller uses secure encryption and strict access controls
                to protect your data. Your recordings and notes are private and
                only accessible to authorized users.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-4"
              className="rounded-xl border border-gray-100 bg-white px-6 py-4 shadow-[0_6px_20px_rgba(0,0,0,0.04)]"
            >
              <AccordionTrigger className="text-left text-sm font-medium hover:no-underline">
                Does Meeteller work with Zoom, Google Meet, or Microsoft Teams?
              </AccordionTrigger>
              <AccordionContent className="pt-2 text-sm text-gray-500">
                Yes, Meeteller integrates with popular meeting platforms like
                Zoom, Google Meet, and Microsoft Teams, making it easy to
                capture and organize notes across all your meetings.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </section>
  );
}

export default FAQs;
