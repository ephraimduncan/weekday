import { z } from "zod";

export const CalendarListEntrySchema = z.object({
  id: z.string(),
  accessRole: z.enum(["freeBusyReader", "reader", "writer", "owner"]),
  backgroundColor: z.string().optional(),
  colorId: z.string().optional(),
  conferenceProperties: z
    .object({
      allowedConferenceSolutionTypes: z.array(z.string()).optional(),
    })
    .optional(),
  defaultReminders: z
    .array(
      z.object({
        method: z.string(),
        minutes: z.number().int(),
      }),
    )
    .optional(),
  deleted: z.boolean().optional(),
  description: z.string().optional(),
  etag: z.string().optional(),
  foregroundColor: z.string().optional(),
  hidden: z.boolean().optional(),
  kind: z.string().optional(), // Keep this to match Google's structure
  location: z.string().optional(),
  notificationSettings: z
    .object({
      notifications: z.array(
        z.object({
          method: z.string(),
          type: z.string(),
        }),
      ),
    })
    .optional(),
  primary: z.boolean().optional(),
  selected: z.boolean().optional(),
  summary: z.string(),
  summaryOverride: z.string().optional(),
  timeZone: z.string().optional(),
});

export const ProcessedCalendarListEntrySchema = z.object({
  id: z.string(),
  accessRole: z.enum(["freeBusyReader", "reader", "writer", "owner"]),
  backgroundColor: z.string().optional(),
  foregroundColor: z.string().optional(),
  primary: z.boolean().optional(),
  summary: z.string(),
});

export const CalendarListResponseSchema = z.object({
  etag: z.string().optional(),
  items: z.array(CalendarListEntrySchema),
  kind: z.string().optional(),
  nextPageToken: z.string().optional().nullable(),
  nextSyncToken: z.string().optional().nullable(),
});

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

export const TimeSlotSchema = z.object({
  end: z.date(),
  start: z.date(),
});

export const GoogleTimePeriodSchema = z.object({
  end: z.string().datetime(),
  start: z.string().datetime(),
});

export const GoogleFreeBusyCalendarSchema = z.object({
  busy: z.array(GoogleTimePeriodSchema),
  errors: z
    .array(z.object({ domain: z.string(), reason: z.string() }))
    .optional(),
});

export const GoogleFreeBusyResponseSchema = z.object({
  calendars: z.record(z.string(), GoogleFreeBusyCalendarSchema),
  kind: z.literal("calendar#freeBusy"),
  timeMax: z.string().datetime(),
  timeMin: z.string().datetime(),
});
