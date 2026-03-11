import Link from "next/link";
import React from "react";

function privacyPolicy() {
  return (
    <>
      <div className="flex bg-linear-to-b from-black via-[#0a0014] to-[#5b09c4] px-4 pt-32 pb-40 md:pt-45">
        <div className="mx-auto max-w-7xl items-center pt-10 text-center">
          <h1 className="mb-6 text-5xl font-bold text-white">Privacy Policy</h1>
          <p className="text-xl text-[#8c8b8b]">
            Meeteller values your privacy. This policy explains how we collect,
            use, and protect your data when you use our business communication
            services.
          </p>
        </div>
      </div>

      <section className="container mx-auto max-w-7xl bg-white px-6 py-20">
        <div className="mb-10">
          <h2 className="mb-5 text-2xl font-bold text-[#282828]">
            Data Collection
          </h2>
          <p className="text-[#8c8b8b]">
            We collect email addresses and contact info you provide via forms,
            and usage data (e.g., clicks, interactions) via cookies.
          </p>
        </div>
        <div className="mb-10">
          <h2 className="mb-5 text-2xl font-bold text-[#282828]">Data Use</h2>
          <p className="text-[#8c8b8b]">
            We use data for communication, improving services, and personalized
            marketing (if opted in). We dont share data with third parties
            without consent.
          </p>
        </div>
        <div className="mb-10">
          <h2 className="mb-5 text-2xl font-bold text-[#282828]">
            Data Protection
          </h2>
          <p className="text-[#8c8b8b]">
            We use encryption and secure servers to protect data.
          </p>
        </div>
        <div className="mb-10">
          <h2 className="mb-5 text-2xl font-bold text-[#282828]">
            User Rights
          </h2>
          <p className="text-[#8c8b8b]">
            Contact us to access, update, or delete your data. Opt out of
            marketing anytime via email.
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
            For questions, email <Link href="privacy@meeteller.com" className="underline italic">privacy@meeteller.com</Link> 
          </p>
        </div>
      </section>
    </>
  );
}

export default privacyPolicy;
