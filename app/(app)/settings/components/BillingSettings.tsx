"use client";

import { useEffect, useState } from "react";
import { Check, Download } from "lucide-react";
import { toast } from "sonner";
import { formatCurrency } from "@/utils/formatCurrency";
import { payWithPaystack } from "@/utils/paystack";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";

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

type Plan = (typeof PLANS)[number];

export default function BillingSettings() {
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loadingInvoices, setLoadingInvoices] = useState(true);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");

  const { user, refreshUser } = useAuth();

  const fetchInvoices = async () => {
    try {
      const response = await api.get("/billing/history");
      setInvoices(response.data);
    } catch (err) {
      console.error("Failed to load invoice history:", err);
    } finally {
      setLoadingInvoices(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchInvoices();
    }
  }, [user]);

  const formatPrice = (amount: number) => amount.toLocaleString("en-NG");

  const getBackendBaseUrl = () => {
    return process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001/";
  };

  const handleDownload = (invoiceNumber: string) => {
    const link = document.createElement("a");
    link.href = `${getBackendBaseUrl()}invoices/${invoiceNumber}.pdf`;
    link.download = `${invoiceNumber}.pdf`;
    link.target = "_blank";
    link.click();
  };

  const handleSubscribe = (plan: Plan) => {
    if (!plan?.prices?.[billingCycle]) {
      toast.error("This subscription option is unavailable.");
      return;
    }

    if (!user?.email) {
      toast.error("Add an email address before subscribing.");
      return;
    }

    try {
      payWithPaystack({
        email: user.email,
        amount: plan.prices[billingCycle] * 100,

        onSuccess: async (response: any) => {
          const toastId = toast.loading("Verifying payment, updating your plan...");
          try {
            await api.post("/billing/verify", { reference: response.reference });
            toast.dismiss(toastId);
            toast.success("Payment successful! Your plan is now active.");
            await refreshUser();
            await fetchInvoices();
          } catch (err) {
            toast.dismiss(toastId);
            toast.error("Verification failed. Please contact support.");
          }
        },

        onClose: () => {
          toast.info("Payment window closed.");
        },
      });
    } catch {
      toast.error("Unable to start payment. Please try again.");
    }
  };

  const plansWithCurrent = PLANS.map((plan) => ({
    ...plan,
    current: plan.id === (user?.subscriptionPlan || "basic"),
  }));

  return (
    <section className="max-w-6xl space-y-14">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Manage your plan and billing history here.
        </p>

        {/* Billing Toggle */}
        <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white dark:border-white/10 dark:bg-zinc-950 p-1 text-sm">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`rounded-lg px-3 py-1.5 transition ${
              billingCycle === "monthly"
                ? "bg-[#5b09c4] text-white"
                : "text-gray-500 hover:text-black dark:hover:text-white"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle("yearly")}
            className={`rounded-lg px-3 py-1.5 transition ${
              billingCycle === "yearly"
                ? "bg-[#5b09c4] text-white"
                : "text-gray-500 hover:text-black dark:hover:text-white"
            }`}
          >
            Yearly
          </button>
        </div>
      </div>

      {/* Plans */}
      <div className="grid gap-6 md:grid-cols-3">
        {plansWithCurrent.map((plan) => {
          const price = plan.prices[billingCycle];

          return (
            <div
              key={plan.id}
              className={`rounded-2xl border p-7 transition ${
                plan.featured
                  ? "border-[#5b09c4] bg-[#5b09c4]/10 dark:bg-[#5b09c4]/20"
                  : "bg-white dark:bg-zinc-900 border-gray-200 dark:border-white/10"
              }`}
            >
              {/* Title */}
              <div className="space-y-1">
                <h3 className="font-helvetica text-lg font-semibold">
                  {plan.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{plan.subtitle}</p>
              </div>

              {/* Price */}
              <div className="mt-6">
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-semibold">
                    {formatCurrency(price)}
                  </span>
                </div>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
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
                <span className="text-xs font-medium text-[#5b09c4] dark:text-purple-400 block mt-2">
                  {plan.id === "personal" && "Save 10% with yearly billing"}
                  {plan.id === "teams" && "Save 15% with yearly billing"}
                </span>
              )}

              {/* CTA */}
              <div className="mt-6">
                {plan.current ? (
                  <button
                    disabled
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-gray-100 px-4 py-3 text-sm font-medium text-gray-600 dark:bg-zinc-800 dark:text-gray-400 dark:border-white/10"
                  >
                    <Check size={16} />
                    Current plan
                  </button>
                ) : (
                  <button
                    onClick={() => handleSubscribe(plan)}
                    className={`w-full rounded-xl px-4 py-3 text-sm font-medium transition ${
                      plan.featured
                        ? "bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
                        : "border border-gray-200 bg-white hover:bg-gray-50 dark:border-white/10 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
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
                    className="flex items-center gap-3 text-gray-700 dark:text-gray-300"
                  >
                    <Check className="h-4 w-4 text-gray-500 dark:text-gray-400" />
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
          <span className="text-gray-400">{invoices.length}</span>
        </h3>

        <div className="rounded-xl border border-gray-200 bg-white dark:border-white/10 dark:bg-zinc-900">
          {loadingInvoices ? (
            <div className="px-5 py-4 text-sm text-gray-500 text-center">Loading invoices...</div>
          ) : invoices.length === 0 ? (
            <div className="px-5 py-4 text-sm text-gray-500 text-center">No payment receipts available.</div>
          ) : (
            invoices.map((invoice, index) => {
              const formattedDate = new Date(invoice.createdAt).toLocaleDateString("en-NG", {
                year: "numeric",
                month: "long",
                day: "numeric",
              });
              const invoiceLabel = `Receipt_${invoice.planId}_${invoice.billingCycle}_${invoice.invoiceNumber}`;
              return (
                <div
                  key={invoice.id}
                  onClick={() => setSelectedInvoice(invoice.invoiceNumber)}
                  className={`flex items-center gap-3 px-4 py-3 text-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 ${
                    index !== invoices.length - 1 ? "border-b border-gray-100 dark:border-white/10" : ""
                  }`}
                >
                  <div className="flex flex-1 items-center gap-3">
                    <span className="rounded bg-gray-100 dark:bg-white/10 px-2 py-1 text-xs font-medium text-gray-600 dark:text-gray-300">
                      PDF
                    </span>
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900 dark:text-white">{invoiceLabel}</span>
                      <span className="text-xs text-gray-400">{formattedDate}</span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(invoice.invoiceNumber);
                    }}
                    className="rounded-lg p-2 transition hover:bg-gray-200 dark:hover:bg-white/10"
                  >
                    <Download className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-[90%] max-w-3xl rounded-xl border border-gray-200 bg-white p-4 shadow-xl dark:border-white/10 dark:bg-zinc-900">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-medium text-gray-900 dark:text-white">Invoice Receipt {selectedInvoice}</h3>

              <button
                onClick={() => setSelectedInvoice(null)}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white"
              >
                Close
              </button>
            </div>

            {/* PDF Preview */}
            <iframe
              src={`${getBackendBaseUrl()}invoices/${selectedInvoice}.pdf`}
              className="h-[400px] w-full rounded-lg border border-gray-200 dark:border-white/10"
            />

            {/* Actions */}
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => setSelectedInvoice(null)}
                className="px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={() => handleDownload(selectedInvoice)}
                className="rounded-lg bg-black px-4 py-2 text-sm text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
              >
                Download
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
