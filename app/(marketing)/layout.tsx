"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { usePathname } from "next/navigation";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideFooterRoutes = [
    "/login",
    "/signup",
    "/pricing",
    "/faqs",
    "/how-it-works",
  ];
  const shouldHideFooter = hideFooterRoutes.some(
    (route) => pathname === route || pathname === `${route}/`,
  );

  return (
    <>
      <Navbar />
      <main>{children}</main>
      {!shouldHideFooter && <Footer />}
    </>
  );
}
