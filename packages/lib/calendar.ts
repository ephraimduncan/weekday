import { type PrismaClient } from "@weekday/db";
import { type Event as GoogleCalendarEvent } from "@weekday/google-calendar";
import { z } from "zod";

import { GOOGLE_CALENDAR_COLORS } from "./constants";

export const ProcessedCalendarEventSchema = z.object({
  id: z.string(),
  allDay: z.boolean(),
  calendarId: z.string(),
  color: z.string(),
  description: z.string().optional(),
  end: z.date(),
  location: z.string().optional(),
  start: z.date(),
  title: z.string(),
});

export type Account = {
  id: string;
  accessToken: string | null;
  refreshToken: string | null;
};

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

export function processEventData(
  item: GoogleCalendarEvent,
  calendarId: string
): z.infer<typeof ProcessedCalendarEventSchema> {
  const eventItem = item as any;

  const isAllDay = !!eventItem?.start?.date;
  const startStr = (eventItem?.start?.dateTime ?? eventItem?.start?.date) as
    | string
    | undefined;
  const endStr = (eventItem?.end?.dateTime ?? eventItem?.end?.date) as
    | string
    | undefined;

  if (!startStr || !endStr || !eventItem.id) {
    throw new Error(
      "Event is missing required start/end time or id information"
    );
  }

  let eventColor = undefined;
  if (eventItem.colorId && GOOGLE_CALENDAR_COLORS[eventItem.colorId]) {
    eventColor = GOOGLE_CALENDAR_COLORS[eventItem.colorId]?.color;
  }

  return {
    id: eventItem.id,
    allDay: isAllDay,
    calendarId: calendarId,
    color: eventColor || "blue",
    description: eventItem.description ?? undefined,
    end: new Date(endStr),
    location: eventItem.location ?? undefined,
    start: new Date(startStr),
    title: eventItem.summary ?? "(No title)",
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
  currentEvent?: GoogleCalendarEvent
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
  const isAllDay = event.allDay ?? !!(currentEvent as any)?.start?.date;

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
