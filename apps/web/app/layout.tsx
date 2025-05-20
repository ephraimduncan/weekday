import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";

import { CalendarProvider } from "@/components/event-calendar/calendar-context";
import { Toaster } from "@/components/ui/sonner";
import { ChatProvider } from "@/providers/chat-provider";
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
      <body
        className={`${fontSans.variable} ${fontMono.variable} bg-sidebar flex h-full flex-col font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
          enableSystem
        >
          <ChatProvider defaultOpen={chatDefaultOpen}>
            <TRPCReactProvider>
              <CalendarProvider>{children}</CalendarProvider>
              <Toaster />
            </TRPCReactProvider>
          </ChatProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
