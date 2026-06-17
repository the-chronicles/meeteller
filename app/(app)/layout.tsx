"use client";

import { useContext, useEffect } from "react";

import { useRouter } from "next/navigation";

import Script from "next/script";

// import { UserProvider } from "@/context/UserProvider";
import { UISettingsProvider } from "@/context/UISettingsProvider";
import { AuthContext } from "@/context/auth-context";

import LayoutShell from "./components/LayoutShell";
import { useAuth } from "@/hooks/useAuth";
import AppLoader from "@/components/ui/AppLoader";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const auth = useAuth();

  const router = useRouter();

  useEffect(() => {
    if (!auth?.loading && !auth?.user) {
      router.replace("/login");
    }
  }, [auth, router]);

  if (auth?.loading) {
    return <AppLoader />;
  }

  if (!auth?.user) {
    return null;
  }

  return (
    <>
      <Script src="https://js.paystack.co/v1/inline.js" strategy="lazyOnload" />

      {/* <UserProvider> */}
      <UISettingsProvider>
        <LayoutShell>{children}</LayoutShell>
      </UISettingsProvider>
      {/* </UserProvider> */}
    </>
  );
}
