// import { UserProvider } from "@/context/UserProvider";
// import { UISettingsProvider } from "@/context/UISettingsProvider";
// import LayoutShell from "./components/LayoutShell";
// // import LayoutShell from "@/components/LayoutShell";

// export default function AppLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <UserProvider>
//       <UISettingsProvider>
//         <LayoutShell>{children}</LayoutShell>
//       </UISettingsProvider>
//     </UserProvider>
//   );
// }

"use client";

import Script from "next/script";
import { UserProvider } from "@/context/UserProvider";
import { UISettingsProvider } from "@/context/UISettingsProvider";
import LayoutShell from "./components/LayoutShell";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* ✅ Load Paystack script properly */}
      <Script src="https://js.paystack.co/v1/inline.js" strategy="lazyOnload" />

      <UserProvider>
        <UISettingsProvider>
          <LayoutShell>{children}</LayoutShell>
        </UISettingsProvider>
      </UserProvider>
    </>
  );
}
