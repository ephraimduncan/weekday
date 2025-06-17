"use client";

import * as React from "react";

import type { Session } from "@weekday/auth";

import { RiCheckLine } from "@remixicon/react";
import Link from "next/link";

import { useCalendarContext } from "@/components/event-calendar/calendar-context";
import { NavUser } from "@/components/nav-user";
import SidebarCalendar from "@/components/sidebar-calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { api } from "@/trpc/react";

import { LogoMarkDark, LogoMarkLight } from "./logo";

// todo: move to shared types
interface Account {
  id: string;
  accountId: string;
  createdAt: Date;
  provider: string;
  scopes: string[];
  updatedAt: Date;
}

export function AppSidebar({
  accounts,
  session,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  accounts: Account[];
  session: Session;
}) {
  const { isCalendarVisible, toggleCalendarVisibility } = useCalendarContext();
  const { data: calendars } = api.calendar.getCalendars.useQuery();

  return (
    <Sidebar
      variant="inset"
      {...props}
      className="dark scheme-only-dark max-lg:p-3 lg:pe-1"
    >
      <SidebarHeader>
        <div className="flex items-center justify-between gap-2">
          <Link className="inline-flex" href="/calendar">
            <LogoMarkDark className="h-8 w-8 dark:hidden" aria-hidden={true} />
            <LogoMarkLight
              className="hidden h-8 w-8 dark:block"
              aria-hidden={true}
            />
          </Link>
          <SidebarTrigger className="text-muted-foreground/80 hover:text-foreground/80 hover:bg-transparent!" />
        </div>
      </SidebarHeader>
      <SidebarContent className="mt-3 gap-0 border-t pt-3">
        <SidebarGroup className="px-1">
          <SidebarCalendar />
        </SidebarGroup>
        <SidebarGroup className="mt-3 border-t px-1 pt-4">
          <SidebarGroupLabel className="text-muted-foreground/65 uppercase">
            Calendars
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {calendars?.map((calendar, index) => {
                return (
                  <SidebarMenuItem key={calendar.id}>
                    <SidebarMenuButton
                      asChild
                      className="has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative justify-between rounded-sm has-focus-visible:ring-[3px] [&>svg]:size-auto"
                    >
                      <span>
                        <span className="flex items-center justify-between gap-3 font-medium">
                          <Checkbox
                            id={calendar.id}
                            className="peer sr-only"
                            checked={isCalendarVisible(calendar.id)}
                            onCheckedChange={() =>
                              toggleCalendarVisibility(calendar.id)
                            }
                          />
                          <RiCheckLine
                            size={16}
                            className="peer-not-data-[state=checked]:invisible"
                            aria-hidden="true"
                          />
                          <label
                            className="peer-not-data-[state=checked]:text-muted-foreground/65 peer-not-data-[state=checked]:line-through after:absolute after:inset-0"
                            htmlFor={calendar.id}
                          >
                            {calendar.summary ?? ""}
                          </label>
                        </span>
                        <span
                          className="size-1.5 rounded-full"
                          style={{
                            backgroundColor: calendar.backgroundColor,
                          }}
                        ></span>
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser session={session} />
      </SidebarFooter>
    </Sidebar>
  );
}
