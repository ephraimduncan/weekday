import { type DrizzleClient, account } from "@weekday/db";
import { type Event as GoogleCalendarEvent } from "@weekday/google-calendar";
import { and, eq } from "drizzle-orm";
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
  organizer: z
    .object({
      id: z.string().optional(),
      displayName: z.string().optional(),
      email: z.string().optional(),
      self: z.boolean().optional(),
    })
    .optional(),
  creator: z
    .object({
      id: z.string().optional(),
      displayName: z.string().optional(),
      email: z.string().optional(),
      self: z.boolean().optional(),
    })
    .optional(),
  attendees: z
    .array(
      z.object({
        id: z.string().optional(),
        displayName: z.string().optional(),
        email: z.string().optional(),
        organizer: z.boolean().optional(),
        self: z.boolean().optional(),
        resource: z.boolean().optional(),
        optional: z.boolean().optional(),
        responseStatus: z
          .enum(["needsAction", "declined", "tentative", "accepted"])
          .optional(),
        comment: z.string().optional(),
        additionalGuests: z.number().optional(),
      }),
    )
    .optional(),
});

export type Account = {
  id: string;
  accessToken: string | null;
  refreshToken: string | null;
};

export async function getGoogleAccount(
  db: DrizzleClient,
  userId: string,
): Promise<Account> {
  const accountRecord = await db
    .select({
      id: account.id,
      accessToken: account.accessToken,
      refreshToken: account.refreshToken,
    })
    .from(account)
    .where(and(eq(account.providerId, "google"), eq(account.userId, userId)))
    .limit(1)
    .then((results) => results[0]);

  if (!accountRecord?.accessToken) {
    throw new Error("No access token found");
  }

  return accountRecord;
}

export function processEventData(
  item: GoogleCalendarEvent,
  calendarId: string,
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
      "Event is missing required start/end time or id information",
    );
  }

  let eventColor: string | undefined = undefined;
  if (eventItem.colorId && GOOGLE_CALENDAR_COLORS[eventItem.colorId]) {
    eventColor = GOOGLE_CALENDAR_COLORS[eventItem.colorId]?.color;
  }

  // Extract organizer information
  const organizer = eventItem.organizer
    ? {
        id: eventItem.organizer.id,
        displayName: eventItem.organizer.displayName,
        email: eventItem.organizer.email,
        self: eventItem.organizer.self,
      }
    : undefined;

  const creator = eventItem.creator
    ? {
        id: eventItem.creator.id,
        displayName: eventItem.creator.displayName,
        email: eventItem.creator.email,
        self: eventItem.creator.self,
      }
    : undefined;

  const attendees = eventItem.attendees
    ? eventItem.attendees.map((attendee: any) => ({
        id: attendee.id,
        displayName: attendee.displayName,
        email: attendee.email,
        organizer: attendee.organizer,
        self: attendee.self,
        resource: attendee.resource,
        optional: attendee.optional,
        responseStatus: attendee.responseStatus,
        comment: attendee.comment,
        additionalGuests: attendee.additionalGuests,
      }))
    : undefined;

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
    organizer,
    creator,
    attendees,
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
  currentEvent?: GoogleCalendarEvent,
  timeZone?: string,
): Record<string, any> {
  const eventData: Record<string, any> = { ...currentEvent };

  if (event.title !== undefined) {
    eventData.summary = event.title;
  }
  if (event.description !== undefined) {
    eventData.description = event.description;
  }
  if (event.location !== undefined) {
    eventData.location = event.location;
  }

  const isAllDay = event.allDay ?? !!(currentEvent as any)?.start?.date;
  const originalStartTz = (currentEvent as any)?.start?.timeZone;
  const originalEndTz = (currentEvent as any)?.end?.timeZone;
  const defaultTimeZone = timeZone || originalStartTz || "UTC";

  if (isAllDay && event.start) {
    const startDate = event.start.toISOString().split("T")[0];
    eventData.start = { date: startDate };
  } else if (event.start) {
    eventData.start = {
      dateTime: event.start.toISOString(),
      timeZone: defaultTimeZone,
    };
  }

  if (isAllDay && event.end) {
    const endDate = event.end.toISOString().split("T")[0];
    eventData.end = { date: endDate };
  } else if (event.end) {
    eventData.end = {
      dateTime: event.end.toISOString(),
      timeZone: originalEndTz || defaultTimeZone,
    };
  }

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

export function mergeAndSortBusyIntervals(
  rawIntervals: Array<{ end: string; start: string }>,
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
      if (currentInterval.end.getTime() > lastMergedInterval.end.getTime()) {
        lastMergedInterval.end = currentInterval.end;
      }
    } else {
      mergedIntervals.push({ ...currentInterval });
    }
  }
  return mergedIntervals;
}

export function calculateFreeSlotsFromBusy(
  busyIntervals: Array<{ end: Date; start: Date }>,
  queryStartTime: Date,
  queryEndTime: Date,
): Array<{ end: Date; start: Date }> {
  const freeSlots: Array<{ end: Date; start: Date }> = [];
  let currentFreeStart = queryStartTime;

  for (const busyPeriod of busyIntervals) {
    if (currentFreeStart < busyPeriod.start) {
      const slotEnd = new Date(
        Math.min(busyPeriod.start.getTime(), queryEndTime.getTime()),
      );
      if (currentFreeStart < slotEnd) {
        freeSlots.push({ end: slotEnd, start: currentFreeStart });
      }
    }
    currentFreeStart = new Date(
      Math.max(currentFreeStart.getTime(), busyPeriod.end.getTime()),
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

export function convertRecurrenceToRRule(
  recurrenceType: "none" | "daily" | "weekly" | "monthly" | "yearly",
  startDate: Date,
): string[] | undefined {
  if (recurrenceType === "none") {
    return undefined;
  }

  const frequency = recurrenceType.toUpperCase();
  return [`RRULE:FREQ=${frequency}`];
}
