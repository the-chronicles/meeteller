import Link from "next/link";
import React from "react";

function termsConditions() {
  return (
    <>
      <div className="flex bg-linear-to-b from-black via-[#0a0014] to-[#5b09c4] px-4 pt-32 pb-40 md:pt-45">
        <div className="mx-auto max-w-7xl items-center pt-10 text-center">
          <h1 className="mb-6 text-5xl font-bold text-white">
            Terms & Condtions
          </h1>
          <p className="text-xl text-[#8c8b8b]">
            By using Meeteller&apos;s services, you agree to these terms.
          </p>
        </div>
      </div>

      <section className="container mx-auto max-w-7xl bg-white px-6 py-20">
        <div className="mb-10">
          <h2 className="mb-5 text-2xl font-bold text-[#282828]">Services</h2>
          <p className="text-[#8c8b8b]">
            Meeteller provides business communication tools (email campaigns,
            messaging).
          </p>
        </div>
        <div className="mb-10">
          <h2 className="mb-5 text-2xl font-bold text-[#282828]">
            User Responsibilities
          </h2>
          <p className="text-[#8c8b8b]">
            <ul className="list-disc ml-5">
              <li>Provide accurate info.</li>
              <li>
                Use services legally; don&apos;t spam or misuse contact info.
              </li>
            </ul>
          </p>
        </div>
        <div className="mb-10">
          <h2 className="mb-5 text-2xl font-bold text-[#282828]">
            Intellectual Property
          </h2>
          <p className="text-[#8c8b8b]">
            Meeteller owns content and data (excluding user messages).

          </p>
        </div>
        <div className="mb-10">
          <h2 className="mb-5 text-2xl font-bold text-[#282828]">
             Liability
          </h2>
          <p className="text-[#8c8b8b]">
           Meeteller isn&apos;t liable for service disruptions or data loss.

          </p>
        </div>
        <div className="mb-10">
          <h2 className="mb-5 text-2xl font-bold text-[#282828]">Changes</h2>
          <p className="text-[#8c8b8b]">
            We will notify users of policy changes via email.
          </p>
        </div>
        <div className="mb-10">
          <h2 className="mb-5 text-2xl font-bold text-[#282828]">Contact</h2>
          <p className="text-[#8c8b8b]">
            For questions, email{" "}
            <Link href="support@meeteller.com" className="italic underline">
              support@meeteller.com
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}

export default termsConditions;
