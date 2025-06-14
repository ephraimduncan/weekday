"use client";

import * as React from "react";

import type { Session } from "@weekday/auth";

import { RiCheckLine } from "@remixicon/react";
import Link from "next/link";

import { useCalendarContext } from "@/components/event-calendar/calendar-context";
import { NavUser } from "@/components/nav-user";
import { AccountSwitcher } from "@/components/account-switcher";
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
import { Separator } from "@/components/ui/separator";
import { api } from "@/trpc/react";

import { LogoMarkDark, LogoMarkLight } from "./logo";

export function AppSidebar({
  session,
  ...props
}: React.ComponentProps<typeof Sidebar> & { session: Session }) {
  const { isCalendarVisible, toggleCalendarVisibility } = useCalendarContext();
  const { data: allCalendars } = api.calendar.getAllCalendars.useQuery();
  const { data: accounts } = api.account.listAccounts.useQuery();

  // Group calendars by account
  const calendarsByAccount = React.useMemo(() => {
    if (!allCalendars) return {};
    
    return allCalendars.reduce((acc, calendar) => {
      const accountEmail = calendar.accountEmail;
      if (!acc[accountEmail]) {
        acc[accountEmail] = [];
      }
      acc[accountEmail].push(calendar);
      return acc;
    }, {} as Record<string, typeof allCalendars>);
  }, [allCalendars]);

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
            Accounts
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="px-1 py-2">
              <AccountSwitcher 
                currentAccount={accounts?.[0]} 
                onAccountSwitch={(accountId) => {
                  // Handle account switch if needed
                  console.log('Switched to account:', accountId);
                }}
              />
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-3 border-t px-1 pt-4">
          <SidebarGroupLabel className="text-muted-foreground/65 uppercase">
            Calendars
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {Object.entries(calendarsByAccount).map(([accountEmail, calendars]) => (
                <div key={accountEmail} className="mb-4">
                  <div className="px-2 py-1 text-xs font-medium text-muted-foreground/75 uppercase">
                    {accountEmail}
                  </div>
                  {calendars.map((calendar) => (
                    <SidebarMenuItem key={`${calendar.accountId}-${calendar.id}`}>
                      <SidebarMenuButton
                        asChild
                        className="has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative justify-between rounded-sm has-focus-visible:ring-[3px] [&>svg]:size-auto"
                      >
                        <span>
                          <span className="flex items-center justify-between gap-3 font-medium">
                            <Checkbox
                              id={`${calendar.accountId}-${calendar.id}`}
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
                              htmlFor={`${calendar.accountId}-${calendar.id}`}
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
                  ))}
                  {Object.keys(calendarsByAccount).length > 1 && (
                    <Separator className="my-2" />
                  )}
                </div>
              ))}
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
