"use client";

import { useState } from "react";
import { Check } from "lucide-react";

type BillingCycle = "monthly" | "yearly";

const PLANS = [
  {
    id: "basic",
    name: "Welcome Gift",
    subtitle: "Perfect to get started",
    prices: {
      monthly: 0,
      yearly: 0,
    },
    featured: false,
    current: true,
    features: [
      "Up to 10 team members",
      "Basic dashboard access",
      "Community support",
    ],
  },
  {
    id: "personal",
    name: "Personal Plan",
    subtitle: "For individual creators",
    prices: {
      monthly: 199,
      yearly: 199 * 10, // 2 months free
    },
    featured: true,
    current: false,
    features: [
      "1 team member",
      "Unlimited exports",
      "Commercial use license",
      "Advanced editor access",
      "Shareable preview links",
    ],
  },
  {
    id: "teams",
    name: "Teams Plan",
    subtitle: "For growing teams",
    prices: {
      monthly: 299,
      yearly: 299 * 10, // 2 months free
    },
    featured: false,
    current: false,
    features: [
      "Up to 20 team members",
      "Team management",
      "Unified billing",
      "Priority support",
    ],
  },
];

const INVOICES = [
  "Invoice_March_2025",
  "Invoice_February_2025",
  "Invoice_January_2025",
  "Invoice_December_2024",
];

export default function BillingSettings() {
  const [billingCycle, setBillingCycle] =
    useState<BillingCycle>("monthly");

  const handleSubscribe = (planId: string) => {
    console.log("Subscribing to:", planId, billingCycle);
    // 👉 Hook this to Paystack / Stripe
    // router.push(`/checkout?plan=${planId}&cycle=${billingCycle}`)
  };

  return (
    <section className="max-w-6xl space-y-14">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Manage your plan and billing history here.
        </p>

        {/* Billing Toggle */}
        <div className="flex items-center gap-2 rounded-xl border bg-white p-1 text-sm">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`rounded-lg px-3 py-1.5 transition ${
              billingCycle === "monthly"
                ? "bg-[#5b09c4] text-white"
                : "text-gray-500 hover:text-black"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle("yearly")}
            className={`rounded-lg px-3 py-1.5 transition ${
              billingCycle === "yearly"
                ? "bg-[#5b09c4] text-white"
                : "text-gray-500 hover:text-black"
            }`}
          >
            Yearly
          </button>
        </div>
      </div>

      {/* Plans */}
      <div className="grid gap-6 md:grid-cols-3">
        {PLANS.map((plan) => {
          const price = plan.prices[billingCycle];

          return (
            <div
              key={plan.id}
              className={`rounded-2xl border p-7 ${
                plan.featured
                  ? "border-[#5b09c4] bg-[#5b09c4]/10"
                  : "bg-white"
              }`}
            >
              {/* Title */}
              <div className="space-y-1">
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <p className="text-sm text-gray-500">{plan.subtitle}</p>
              </div>

              {/* Price */}
              <div className="mt-6">
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-semibold">
                    ₦{price}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  {billingCycle === "monthly"
                    ? "Billed per month"
                    : "Billed yearly (2 months free)"}
                </p>
              </div>

              {/* Discount */}
              {!plan.current && billingCycle === "yearly" && (
                <div className="mt-4 rounded-lg border border-dashed bg-white px-4 py-3 text-sm">
                  <span className="font-medium">
                    Yearly discount applied
                  </span>{" "}
                  — save more with annual billing
                </div>
              )}

              {/* CTA */}
              <div className="mt-6">
                {plan.current ? (
                  <button
                    disabled
                    className="flex w-full items-center justify-center gap-2 rounded-xl border bg-gray-100 px-4 py-3 text-sm font-medium text-gray-600"
                  >
                    <Check size={16} />
                    Current plan
                  </button>
                ) : (
                  <button
                    onClick={() => handleSubscribe(plan.id)}
                    className={`w-full rounded-xl px-4 py-3 text-sm font-medium transition ${
                      plan.featured
                        ? "bg-black text-white hover:bg-black/90"
                        : "border bg-white hover:bg-gray-50"
                    }`}
                  >
                    Start Subscription
                  </button>
                )}
              </div>

              {/* Features */}
              <ul className="mt-8 space-y-3 text-sm">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-3 text-gray-700"
                  >
                    <Check className="h-4 w-4 text-gray-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* Billing History */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium">
          Billing history{" "}
          <span className="text-gray-400">{INVOICES.length}</span>
        </h3>

        <div className="rounded-xl border bg-white">
          {INVOICES.map((invoice, index) => (
            <label
              key={invoice}
              className={`flex cursor-pointer items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 ${
                index !== INVOICES.length - 1 ? "border-b" : ""
              }`}
            >
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300"
              />

              <div className="flex flex-1 items-center gap-3">
                <span className="rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                  PDF
                </span>
                <span>{invoice}</span>
              </div>
            </label>
          ))}
        </div>
      </div>
    </section>
  );
}
