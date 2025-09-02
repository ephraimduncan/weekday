"use client";

import * as React from "react";

import {
  RiArrowDownSLine,
  RiArrowRightSLine,
  RiCheckLine,
} from "@remixicon/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useCalendarContext } from "@/components/event-calendar/calendar-context";
import { Checkbox } from "@/components/ui/checkbox";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";

interface AccountCalendarSectionProps {
  accountEmail: string;
  accountId: string;
  accountName: string;
  calendars: Calendar[];
  isActiveAccount: boolean;
}

interface Calendar {
  id: string;
  accessRole: string;
  summary: string;
  backgroundColor?: string;
  foregroundColor?: string;
  primary?: boolean;
}

export function AccountCalendarSection({
  accountEmail,
  accountId,
  accountName,
  calendars,
  isActiveAccount,
}: AccountCalendarSectionProps) {
  const router = useRouter();
  const utils = api.useUtils();
  const { isCalendarVisible, toggleCalendarVisibility } = useCalendarContext();
  const [isExpanded, setIsExpanded] = React.useState(true);

  const setDefaultAccount = api.account.updatePrimary.useMutation({
    onError: (error: any) => {
      toast.error("Failed to switch account: " + error.message);
    },
    onSuccess: () => {
      utils.account.fetchAll.invalidate();
      utils.account.retrievePrimary.invalidate();
      utils.calendar.getCalendars.invalidate();
      utils.calendar.getAllAccountsCalendars.invalidate();
      utils.calendar.getEvents.invalidate();
      router.refresh();
      toast.success("Account switched successfully");
    },
  });

  const handleCalendarClick = (calendarId: string) => {
    if (isActiveAccount) {
      toggleCalendarVisibility(calendarId);
    } else {
      setDefaultAccount.mutate({ accountId });
    }
  };

  if (calendars.length === 0) {
    return null;
  }

  return (
    <SidebarGroup className="-mt-2.5 px-1">
      <SidebarGroupLabel
        className="text-muted-foreground/65 group flex cursor-pointer items-center justify-between"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-x-2">
          {isExpanded ? (
            <RiArrowDownSLine className="h-3 w-3" />
          ) : (
            <RiArrowRightSLine className="h-3 w-3" />
          )}
          <span className="truncate">{accountEmail}</span>
          {isActiveAccount && <span className="text-primary text-xs">•</span>}
        </div>
        <span className="text-muted-foreground/50 group-hover:text-muted-foreground/75 text-xs font-normal transition-colors">
          {calendars.length}
        </span>
      </SidebarGroupLabel>

      {isExpanded && (
        <SidebarGroupContent>
          <SidebarMenu>
            {calendars.map((calendar) => {
              const isVisible = isCalendarVisible(calendar.id);

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
                          checked={isActiveAccount ? isVisible : false}
                          onCheckedChange={() =>
                            handleCalendarClick(calendar.id)
                          }
                        />
                        <RiCheckLine
                          size={16}
                          className={cn(
                            isActiveAccount
                              ? "peer-not-data-[state=checked]:invisible"
                              : "invisible",
                          )}
                          aria-hidden="true"
                        />
                        <label
                          className={cn(
                            isActiveAccount
                              ? "peer-not-data-[state=checked]:text-muted-foreground/65 cursor-pointer peer-not-data-[state=checked]:line-through after:absolute after:inset-0"
                              : "cursor-pointer after:absolute after:inset-0",
                            "hover:text-foreground transition-colors",
                          )}
                          onClick={(e) => {
                            e.preventDefault();
                            handleCalendarClick(calendar.id);
                          }}
                          htmlFor={calendar.id}
                        >
                          {calendar.summary}
                        </label>
                      </span>
                      <span
                        className="size-1.5 shrink-0 rounded-full"
                        style={{
                          backgroundColor:
                            calendar.backgroundColor || "#3174ad",
                        }}
                      />
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      )}
    </SidebarGroup>
  );
}
