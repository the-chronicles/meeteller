
// // https://zeznkiiwenfdnykaprsa.supabase.co/auth/v1/callback
// // xhttp://localhost:8080/api/oauth/google/callback

// "use client";

// import { useEffect } from "react";
// import { supabase } from "@/lib/supabase/browser";
// import { useRouter } from "next/navigation";

// export default function AuthCallback() {
//   const router = useRouter();

//   useEffect(() => {
//     const handleAuth = async () => {
//       const url = new URL(window.location.href);
//       const code = url.searchParams.get("code");

//       if (!code) {
//         router.replace("/login");
//         return;
//       }

//       const { error } = await supabase.auth.exchangeCodeForSession(code);

//       if (error) {
//         console.error("Auth exchange failed:", error.message);
//         router.replace("/login");
//         return;
//       }

//       // ✅ Session is now persisted
//       router.replace("/dashboard");
//     };

//     handleAuth();
//   }, [router]);

//   return <p className="mt-20 text-center">Signing you in…</p>;
// }



"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase/browser";
import { useRouter } from "next/navigation";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const syncSession = async () => {
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        router.replace("/login");
        return;
      }

      // ✅ MUST match middleware-protected route
      router.replace("/dashboard");
      router.refresh();
    };

    syncSession();
  }, [router]);

  return <p className="mt-20 text-center">Signing you in…</p>;
}
