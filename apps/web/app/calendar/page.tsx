import type { Metadata } from "next";

import { auth } from "@weekday/auth";
import { HydrateClient } from "@weekday/web/trpc/server";

import { AppSidebar } from "@/components/app-sidebar";
import { ResizablePanelsClient } from "@/components/resizable-panels-client";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export const metadata: Metadata = {
  description: "The open source Google Calendar alternative",
  title: "Weekday Calendar",
};

export default async function Page() {
  const session = await auth();

  return (
    <HydrateClient>
      <SidebarProvider>
        <AppSidebar session={session!} />
        <SidebarInset className="flex-1 bg-transparent">
          <ResizablePanelsClient />
        </SidebarInset>
      </SidebarProvider>
    </HydrateClient>
  );
}
