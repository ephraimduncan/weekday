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

export function AppSidebar({
  session,
  ...props
}: React.ComponentProps<typeof Sidebar> & { session: Session }) {
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
          <Link className="inline-flex" href="/">
            <span className="sr-only">Logo</span>
            <svg fill="currentColor" height="48" viewBox="0 0 40 48" width="32">
              <clipPath id="a">
                <path d="m0 0h40v48h-40z" />
              </clipPath>
              <g clipPath="url(#a)">
                <path d="m25.0887 5.05386-3.933-1.05386-3.3145 12.3696-2.9923-11.16736-3.9331 1.05386 3.233 12.0655-8.05262-8.0526-2.87919 2.8792 8.83271 8.8328-10.99975-2.9474-1.05385625 3.933 12.01860625 3.2204c-.1376-.5935-.2104-1.2119-.2104-1.8473 0-4.4976 3.646-8.1436 8.1437-8.1436 4.4976 0 8.1436 3.646 8.1436 8.1436 0 .6313-.0719 1.2459-.2078 1.8359l10.9227 2.9267 1.0538-3.933-12.0664-3.2332 11.0005-2.9476-1.0539-3.933-12.0659 3.233 8.0526-8.0526-2.8792-2.87916-8.7102 8.71026z" />
                <path d="m27.8723 26.2214c-.3372 1.4256-1.0491 2.7063-2.0259 3.7324l7.913 7.9131 2.8792-2.8792z" />
                <path d="m25.7665 30.0366c-.9886 1.0097-2.2379 1.7632-3.6389 2.1515l2.8794 10.746 3.933-1.0539z" />
                <path d="m21.9807 32.2274c-.65.1671-1.3313.2559-2.0334.2559-.7522 0-1.4806-.102-2.1721-.2929l-2.882 10.7558 3.933 1.0538z" />
                <path d="m17.6361 32.1507c-1.3796-.4076-2.6067-1.1707-3.5751-2.1833l-7.9325 7.9325 2.87919 2.8792z" />
                <path d="m13.9956 29.8973c-.9518-1.019-1.6451-2.2826-1.9751-3.6862l-10.95836 2.9363 1.05385 3.933z" />
              </g>
            </svg>
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
                      className="has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative justify-between rounded-md has-focus-visible:ring-[3px] [&>svg]:size-auto"
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
        <NavUser user={session.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
