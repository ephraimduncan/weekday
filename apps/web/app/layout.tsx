import { Analytics } from "@vercel/analytics/next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import Script from "next/script";

import { CalendarProvider } from "@/components/event-calendar/calendar-context";
import { Toaster } from "@/components/ui/sonner";
import { ChatProvider } from "@/providers/chat-provider";
import { JotaiProvider } from "@/providers/jotai-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { TRPCReactProvider } from "@/trpc/react";

import "./globals.css";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const chatCookie = (await cookies()).get("chat:state")?.value;
  const chatDefaultOpen = chatCookie === "true";

  return (
    <html className="h-full" lang="en" suppressHydrationWarning>
      <head>
        <link href="/favicon.svg" rel="icon" />
      </head>
      <body
        className={`${fontSans.variable} ${fontMono.variable} flex h-full flex-col font-sans antialiased`}
      >
        <Script
          data-website-id="e38b6ee0-5973-4bc6-8de4-78ab3e09d532"
          src="https://analytics.duncan.land/script.js"
          defer
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
          enableSystem
        >
          <JotaiProvider>
            <ChatProvider defaultOpen={chatDefaultOpen}>
              <TRPCReactProvider>
                <CalendarProvider>
                  {children}
                  <Analytics />
                </CalendarProvider>
                <Toaster />
              </TRPCReactProvider>
            </ChatProvider>
          </JotaiProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
