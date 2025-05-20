import { ProcessedCalendarEventSchema } from "@weekday/api";
import { authInstance } from "@weekday/auth";
import { type PrismaClient } from "@weekday/db";
import { z } from "zod";

import { GOOGLE_CALENDAR_COLORS } from "./constants";

export type Account = {
  id: string;
  accessToken: string | null;
  refreshToken: string | null;
};

export type GoogleCalendarEntry = {
  id: string;
  [key: string]: any;
  accessRole?: string;
  backgroundColor?: string;
  foregroundColor?: string;
  primary?: boolean;
  summary?: string;
};

export type GoogleEvent = {
  id: string;
  [key: string]: any;
  colorId?: string;
  description?: string;
  end?: { date?: string; dateTime?: string };
  location?: string;
  start?: { date?: string; dateTime?: string };
  summary?: string;
};

// Helper functions
export async function getGoogleAccount(
  db: PrismaClient,
  userId: string
): Promise<Account> {
  const account = await db.account.findFirst({
    select: {
      id: true,
      accessToken: true,
      refreshToken: true,
    },
    where: {
      providerId: "google",
      userId: userId,
    },
  });

  if (!account?.accessToken) {
    throw new Error("No access token found");
  }

  return account;
}

export function createHeaders(accessToken: string): Headers {
  const headers = new Headers();
  headers.append("Authorization", `Bearer ${accessToken}`);
  headers.append("Accept", "application/json");
  return headers;
}

export function createRequestOptions(
  headers: Headers,
  method: string = "GET",
  body?: string
): RequestInit {
  const options: RequestInit = {
    cache: "no-cache",
    headers,
    method,
    mode: "cors",
  };

  if (body) {
    options.body = body;
  }

  return options;
}

export async function refreshTokenIfNeeded(
  response: Response,
  account: Account,
  userId: string,
  headers: Headers
): Promise<{ accessToken: string | null; success: boolean }> {
  if (response.status !== 401 || !account.refreshToken) {
    return { accessToken: account.accessToken, success: false };
  }

  console.log("Access token expired, refreshing via Better Auth...");

  const refreshedAccount = await authInstance.api.refreshToken({
    body: {
      accountId: account.id,
      providerId: "google",
      userId: userId,
    },
  });

  if (!refreshedAccount?.accessToken) {
    return { accessToken: account.accessToken, success: false };
  }

  headers.set("Authorization", `Bearer ${refreshedAccount.accessToken}`);
  return { accessToken: refreshedAccount.accessToken, success: true };
}

export async function executeRequest(
  url: string,
  options: RequestInit,
  account: Account,
  userId: string
): Promise<Response> {
  let response = await fetch(url, options);

  if (response.status === 401 && account.refreshToken && account.accessToken) {
    const { accessToken, success } = await refreshTokenIfNeeded(
      response,
      account,
      userId,
      options.headers as Headers
    );

    if (success && accessToken) {
      // Update Authorization header with new token
      const headers = options.headers as Headers;
      headers.set("Authorization", `Bearer ${accessToken}`);
      response = await fetch(url, options);
    }
  }

  if (!response.ok) {
    const errorText = await response.text();
    console.error(
      `HTTP error: ${response.status} - ${response.statusText}`,
      errorText
    );
    throw new Error(
      `HTTP error! status: ${response.status} - ${response.statusText}`
    );
  }

  return response;
}

export function processEventData(
  item: GoogleEvent,
  calendarId: string
): z.infer<typeof ProcessedCalendarEventSchema> {
  const isAllDay = !!item.start?.date;
  const startStr = (item.start?.dateTime ?? item.start?.date) as
    | string
    | undefined;
  const endStr = (item.end?.dateTime ?? item.end?.date) as string | undefined;

  if (!startStr || !endStr) {
    throw new Error("Event is missing required start/end time information");
  }

  let eventColor = undefined;
  const colorId = item.colorId as string | undefined;
  if (colorId && GOOGLE_CALENDAR_COLORS[colorId]) {
    eventColor = GOOGLE_CALENDAR_COLORS[colorId].color;
  }

  return {
    id: item.id,
    allDay: isAllDay,
    calendarId: calendarId,
    color: eventColor || "blue",
    description: item.description ?? undefined,
    end: new Date(endStr),
    location: item.location ?? undefined,
    start: new Date(startStr),
    title: item.summary ?? "(No title)",
  };
}

export function prepareEventData(
  event: {
    allDay?: boolean;
    color?: string;
    description?: string;
    end?: Date;
    location?: string;
    start?: Date;
    title?: string;
  },
  currentEvent?: GoogleEvent
): Record<string, any> {
  const eventData: Record<string, any> = { ...currentEvent };

  // Update fields that were provided
  if (event.title !== undefined) {
    eventData.summary = event.title;
  }
  if (event.description !== undefined) {
    eventData.description = event.description;
  }
  if (event.location !== undefined) {
    eventData.location = event.location;
  }

  // Handle date updates
  const isAllDay = event.allDay ?? !!currentEvent?.start?.date;

  if (isAllDay && event.start) {
    const startDate = event.start.toISOString().split("T")[0];
    eventData.start = { date: startDate };
  } else if (event.start) {
    eventData.start = { dateTime: event.start.toISOString() };
  }

  if (isAllDay && event.end) {
    const endDate = event.end.toISOString().split("T")[0];
    eventData.end = { date: endDate };
  } else if (event.end) {
    eventData.end = { dateTime: event.end.toISOString() };
  }

  // Set color if provided
  if (event.color) {
    for (const [colorId, colorInfo] of Object.entries(GOOGLE_CALENDAR_COLORS)) {
      if (colorInfo.color === event.color) {
        eventData.colorId = colorId;
        break;
      }
    }
  }

  return eventData;
}

// Schemas for Google FreeBusy API response

// Helper function to merge and sort busy intervals
export function mergeAndSortBusyIntervals(
  rawIntervals: Array<{ end: string; start: string }>
): Array<{ end: Date; start: Date }> {
  if (!rawIntervals || rawIntervals.length === 0) {
    return [];
  }

  const intervals = rawIntervals.map((p) => ({
    end: new Date(p.end),
    start: new Date(p.start),
  }));

  intervals.sort((a, b) => a.start.getTime() - b.start.getTime());

  const mergedIntervals: Array<{ end: Date; start: Date }> = [];
  if (intervals.length === 0) return mergedIntervals;

  mergedIntervals.push({ ...intervals[0]! });

  for (let i = 1; i < intervals.length; i++) {
    const currentInterval = intervals[i]!;
    const lastMergedInterval = mergedIntervals[mergedIntervals.length - 1]!;

    if (currentInterval.start.getTime() <= lastMergedInterval.end.getTime()) {
      // Overlapping or adjacent interval, merge them
      if (currentInterval.end.getTime() > lastMergedInterval.end.getTime()) {
        lastMergedInterval.end = currentInterval.end;
      }
    } else {
      // Non-overlapping interval, add it to the list
      mergedIntervals.push({ ...currentInterval });
    }
  }
  return mergedIntervals;
}

// Helper function to calculate free slots from merged busy intervals
export function calculateFreeSlotsFromBusy(
  busyIntervals: Array<{ end: Date; start: Date }>,
  queryStartTime: Date,
  queryEndTime: Date
): Array<{ end: Date; start: Date }> {
  const freeSlots: Array<{ end: Date; start: Date }> = [];
  let currentFreeStart = queryStartTime;

  for (const busyPeriod of busyIntervals) {
    if (currentFreeStart < busyPeriod.start) {
      const slotEnd = new Date(
        Math.min(busyPeriod.start.getTime(), queryEndTime.getTime())
      );
      if (currentFreeStart < slotEnd) {
        freeSlots.push({ end: slotEnd, start: currentFreeStart });
      }
    }
    currentFreeStart = new Date(
      Math.max(currentFreeStart.getTime(), busyPeriod.end.getTime())
    );
    if (currentFreeStart >= queryEndTime) {
      break;
    }
  }

  if (currentFreeStart < queryEndTime) {
    freeSlots.push({ end: queryEndTime, start: currentFreeStart });
  }

  return freeSlots;
}
