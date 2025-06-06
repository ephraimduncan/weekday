import { authInstance } from "@weekday/auth";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await authInstance.api.getSession({
    headers: await headers(),
  });

  const authRoutes = ["/login", "/signup"];
  if (authRoutes.includes(pathname) && session) {
    console.log("Redirecting to calendar");

    return NextResponse.redirect(new URL("/calendar", request.url));
  }

  if (pathname.startsWith("/calendar") && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/calendar/:path*", "/login", "/signup"],
  runtime: "nodejs",
};
