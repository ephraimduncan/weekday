"use client";

import * as React from "react";

import type { Session } from "@weekday/auth";

import Link from "next/link";

import { AccountCalendarSection } from "@/components/account-calendar-section";
import { NavUser } from "@/components/nav-user";
import SidebarCalendar from "@/components/sidebar-calendar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
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
  const { data: allAccountsCalendars } =
    api.calendar.getAllAccountsCalendars.useQuery(undefined, {
      gcTime: 1000 * 60 * 60 * 24,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 30,
    });

  const { data: defaultAccount } = api.account.getDefault.useQuery(undefined, {
    gcTime: 1000 * 60 * 60 * 24,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

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

        {allAccountsCalendars && allAccountsCalendars.length > 0 && (
          <div className="mt-3">
            <SidebarGroup className="border-t px-1 pt-4">
              <SidebarGroupLabel className="text-muted-foreground/65 mb-2 uppercase">
                Calendars
              </SidebarGroupLabel>
            </SidebarGroup>

            {allAccountsCalendars.map((accountData) => (
              <AccountCalendarSection
                key={accountData.accountId}
                accountEmail={accountData.accountEmail}
                accountId={accountData.accountId}
                accountName={accountData.accountName}
                calendars={accountData.calendars}
                isActiveAccount={
                  accountData.accountId === defaultAccount?.account?.id
                }
              />
            ))}
          </div>
        )}
      </SidebarContent>
      <SidebarFooter>
        <NavUser session={session} />
      </SidebarFooter>
    </Sidebar>
  );
}
