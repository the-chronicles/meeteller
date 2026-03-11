import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // ✅ NEVER block auth-related routes
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/auth")
  ) {
    return NextResponse.next();
  }

  

  const res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => req.cookies.get(name)?.value,
        set: (name, value, options) =>
          res.cookies.set({ name, value, ...options }),
        remove: (name, options) =>
          res.cookies.set({ name, value: "", ...options }),
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  console.log("MIDDLEWARE SESSION:", session);

  if (!session && pathname.startsWith("/app")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  

  return res;
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
