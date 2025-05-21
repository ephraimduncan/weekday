import type { Metadata } from "next";

import { addMonths, endOfMonth, startOfMonth, subMonths } from "date-fns";
import { redirect } from "next/navigation";

import { AppSidebar } from "@/components/app-sidebar";
import { ResizablePanelsClient } from "@/components/resizable-panels-client";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { auth } from "@/server/auth";
import { api, HydrateClient } from "@/trpc/server";

export const metadata: Metadata = {
  description: "The open source Google Calendar alternative",
  title: "Weekday Calendar",
};

export default async function Page() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const today = new Date();
  const timeMin = startOfMonth(subMonths(today, 3)).toISOString();
  const timeMax = endOfMonth(addMonths(today, 3)).toISOString();
  const nextStartDate = startOfMonth(addMonths(today, 3));
  const nextEndDate = endOfMonth(addMonths(today, 6));

  await Promise.all([
    api.calendar.getCalendars.prefetch(),
    api.calendar.getEvents.prefetch({
      timeMax,
      timeMin,
    }),
    api.calendar.getEvents.prefetch({
      timeMax: nextEndDate.toISOString(),
      timeMin: nextStartDate.toISOString(),
    }),
  ]);

  return (
    <HydrateClient>
      <SidebarProvider>
        <AppSidebar session={session} />
        <SidebarInset className="flex-1 bg-transparent">
          <ResizablePanelsClient />
        </SidebarInset>
      </SidebarProvider>
    </HydrateClient>
  );
}
