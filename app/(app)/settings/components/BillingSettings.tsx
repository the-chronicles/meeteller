/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Check, Download } from "lucide-react";
import { formatCurrency } from "@/utils/formatCurrency";
import { payWithPaystack } from "@/utils/paystack";
import { useUser } from "@/context/UserProvider";

type BillingCycle = "monthly" | "yearly";

const PLANS = [
  {
    id: "basic",
    name: "Welcome Gift",
    subtitle: "Get started for free",
    prices: {
      monthly: 0,
      yearly: 0,
    },
    featured: false,
    current: true,
    features: [
      "Full platform access",
      "Up to 2 meetings",
      "Basic experience to explore features",
    ],
  },
  {
    id: "personal",
    name: "Personal Plan",
    subtitle: "For individuals",
    prices: {
      monthly: 9999,
      yearly: Math.floor(9999 * 12 * 0.9),
    },
    featured: true,
    current: false,
    features: [
      "Full platform access",
      "1 member",
      "Unlimited exports",
      "Task tracking",
    ],
  },
  {
    id: "teams",
    name: "Teams Plan",
    subtitle: "For teams & collaboration",
    prices: {
      monthly: 30000,
      yearly: Math.floor(30000 * 12 * 0.85),
    },
    featured: false,
    current: false,
    features: [
      "Up to 20 team members",
      "Team Dashboard",
      "Team management",
      "Unified billing",
      "Priority support",
      "Task tracking",
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
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);

  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");

  const formatPrice = (amount: number) => amount.toLocaleString("en-NG");

  const handleDownload = (invoice: string) => {
    const link = document.createElement("a");
    link.href = `/invoices/${invoice}.pdf`; // 👈 update to your backend route
    link.download = `${invoice}.pdf`;
    link.click();
  };

  // const handleSubscribe = (planId: string) => {
  //   console.log("Subscribing to:", planId, billingCycle);
  //   // 👉 Hook this to Paystack / Stripe
  //   // router.push(`/checkout?plan=${planId}&cycle=${billingCycle}`)
  // };

  const { user } = useUser();

  const handleSubscribe = (plan: any) => {
    if (!plan?.prices?.[billingCycle]) {
      console.error("Invalid plan data:", plan);
      return;
    }

    if (!user?.email) {
      console.error("User email is required");
      return;
    }

    payWithPaystack({
      email: user.email,
      amount: plan.prices[billingCycle] * 100,

      onSuccess: () => {
        console.log("Payment successful");
      },

      onClose: () => {
        console.log("Payment closed");
      },
    });
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
                plan.featured ? "border-[#5b09c4] bg-[#5b09c4]/10" : "bg-white"
              }`}
            >
              {/* Title */}
              <div className="space-y-1">
                <h3 className="font-helvetica text-lg font-semibold">
                  {plan.name}
                </h3>
                <p className="text-sm text-gray-500">{plan.subtitle}</p>
              </div>

              {/* Price */}
              <div className="mt-6">
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-semibold">
                    {formatCurrency(price)}
                  </span>
                </div>

                <p className="mt-1 text-sm text-gray-500">
                  {billingCycle === "monthly"
                    ? "Billed per month"
                    : "Billed yearly"}
                </p>

                {billingCycle === "yearly" && !plan.current && (
                  <p className="text-sm text-gray-400 line-through">
                    ₦{formatPrice(plan.prices.monthly * 12)}
                  </p>
                )}
              </div>

              {/* Discount */}
              {!plan.current && billingCycle === "yearly" && (
                <span className="font-medium">
                  {plan.id === "personal" && "Save 10% with yearly billing"}
                  {plan.id === "teams" && "Save 15% with yearly billing"}
                </span>
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
                    onClick={() => handleSubscribe(plan)}
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
            <div
              key={invoice}
              className={`flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 ${
                index !== INVOICES.length - 1 ? "border-b" : ""
              }`}
            >
              <div className="flex flex-1 items-center gap-3">
                <span className="rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                  PDF
                </span>
                <span>{invoice}</span>
              </div>

              <button
                // onClick={() => handleDownload(invoice)}
                onClick={() => setSelectedInvoice(invoice)}
                className="rounded-lg p-2 transition hover:bg-gray-200"
              >
                <Download className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-[90%] max-w-3xl rounded-xl bg-white p-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-medium">{selectedInvoice}</h3>

              <button
                onClick={() => setSelectedInvoice(null)}
                className="text-sm text-gray-500"
              >
                Close
              </button>
            </div>

            {/* PDF Preview */}
            <iframe
              src={`/invoices/${selectedInvoice}.pdf`}
              className="h-[400px] w-full rounded-lg border"
            />

            {/* Actions */}
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => setSelectedInvoice(null)}
                className="px-4 py-2 text-sm"
              >
                Cancel
              </button>

              <a
                href={`/invoices/${selectedInvoice}.pdf`}
                download
                className="rounded-lg bg-black px-4 py-2 text-sm text-white"
              >
                Download
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
