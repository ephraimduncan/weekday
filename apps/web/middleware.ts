import type { Session } from "@weekday/auth";

import { betterFetch } from "@better-fetch/fetch";
import { type NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/calendar/:path*", "/login", "/signup"],
  runtime: "nodejs",
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { data: session } = await betterFetch<Session>(
    "/api/auth/get-session",
    {
      baseURL: request.nextUrl.origin,
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    },
  );

  const authRoutes = ["/login", "/signup"];
  if (authRoutes.includes(pathname) && session) {
    return NextResponse.redirect(new URL("/calendar", request.url));
  }

  if (pathname.startsWith("/calendar") && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}
