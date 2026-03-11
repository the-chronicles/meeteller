// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@radix-ui/react-accordion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import React from "react";

function FAQs() {
  return (
    <div className=" container max-w-7xl mx-auto w-full px-4 pt-32 pb-40 md:pt-40 md:pb-52 min-h-50 md:min-h-212.5">
      <div className="text-4xl text-[#282828] font-bold mb-4 mt-10">
        Frequently Asked Questions
      </div>
      <div className="mt-10">
        <Accordion
          type="single"
          collapsible
          className="w-full rounded-md bg-white  border-[#8c8b8b] border  shadow-[0_2px_10px] p-10 shadow-black/5"
        >
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-xl font-semibold">What is Meeteller?</AccordionTrigger>
            <AccordionContent>
              Yes. It adheres to the WAI-ARIA design pattern.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger>Is it unstyled?</AccordionTrigger>
            <AccordionContent>
              Yes. Its unstyled by default, giving you freedom over the look and
              feel.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}

export default FAQs;
