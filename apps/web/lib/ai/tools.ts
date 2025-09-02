import { getCurrentUserAccount } from "@weekday/api/src/utils/accounts";
import { auth } from "@weekday/auth";
import { ProcessedCalendarEventSchema } from "@weekday/lib";
import { api } from "@weekday/web/trpc/server";
import { tool } from "ai";
import { headers } from "next/headers";
import { z } from "zod/v3";

type ProcessedCalendarEvent = z.infer<typeof ProcessedCalendarEventSchema>;

async function getActiveAccountId(): Promise<string | undefined> {
  try {
    const session = await auth();
    if (!session?.user) return undefined;

    const requestHeaders = await headers();
    const activeAccount = await getCurrentUserAccount(
      session.user,
      requestHeaders,
    );
    return activeAccount.id;
  } catch (error) {
    console.error("Error getting active account:", error);
    return undefined;
  }
}

export const getEvents = tool({
  description:
    "Retrieve calendar events within a date and optionally time range",
  inputSchema: z.object({
    end: z
      .string()
      .describe(
        "End date in ISO 8601 format (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss). Time will be added if not provided. Ensure proper date format.",
      ),
    endTime: z
      .string()
      .optional()
      .describe(
        "Optional end time in ISO 8601 format (THH:mm:ss). If not provided, defaults to end of the day.",
      ),
    includeAllDay: z
      .boolean()
      .optional()
      .default(true)
      .describe(
        "Whether to include all-day events in the results. Defaults to true (all-day events are included).",
      ),
    start: z
      .string()
      .describe(
        "Start date in ISO 8601 format (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss). Time will be added if not provided. Ensure proper date format.",
      ),
    startTime: z
      .string()
      .optional()
      .describe(
        "Optional start time in ISO 8601 format (THH:mm:ss). If not provided, defaults to start of the day.",
      ),
  }),
  execute: async ({ end, endTime, includeAllDay, start, startTime }) => {
    try {
      const activeAccountId = await getActiveAccountId();

      // Parse and normalize dates to ensure proper ISO 8601 format
      let fullStart: string;
      let fullEnd: string;

      // Handle start date/time
      if (start.includes("T")) {
        // Already has time, ensure it's valid ISO
        fullStart = new Date(start).toISOString();
      } else {
        // Date only, add time
        const startDateTime = startTime 
          ? `${start}T${startTime.replace(/^T/, '')}` 
          : `${start}T00:00:00`;
        fullStart = new Date(startDateTime).toISOString();
      }

      // Handle end date/time
      if (end.includes("T")) {
        // Already has time, ensure it's valid ISO
        fullEnd = new Date(end).toISOString();
      } else {
        // Date only, add time
        const endDateTime = endTime 
          ? `${end}T${endTime.replace(/^T/, '')}` 
          : `${end}T23:59:59`;
        fullEnd = new Date(endDateTime).toISOString();
      }

      // Validate the dates
      if (isNaN(Date.parse(fullStart)) || isNaN(Date.parse(fullEnd))) {
        return { 
          error: "Invalid date format provided", 
          events: [] 
        };
      }

      const events = await api.calendar.getEvents({
        accountId: activeAccountId,
        includeAllDay: includeAllDay,
        timeMax: fullEnd,
        timeMin: fullStart,
      });

      return {
        events: events.map((event: ProcessedCalendarEvent) => ({
          id: event.id,
          allDay: event.allDay,
          calendarId: event.calendarId,
          color: event.color,
          description: event.description,
          end: event.end,
          location: event.location,
          start: event.start,
          title: event.title,
        })),
      };
    } catch (error) {
      console.error("Error fetching events:", error);
      return { error: "Failed to fetch calendar events", events: [] };
    }
  },
});

export const getEvent = tool({
  description:
    "Retrieves a specific calendar event by its ID from the user's Google Calendar.",
  inputSchema: z.object({
    calendarId: z
      .string()
      .default("primary")
      .describe(
        "The calendar ID where the event is located. Defaults to 'primary'.",
      ),
    eventId: z
      .string()
      .describe("The unique identifier of the event to retrieve."),
  }),
  execute: async ({ calendarId, eventId }) => {
    try {
      const activeAccountId = await getActiveAccountId();

      const event = await api.calendar.getEvent({
        accountId: activeAccountId,
        calendarId,
        eventId,
      });

      return {
        event: {
          id: event.id,
          allDay: event.allDay,
          calendarId: event.calendarId,
          color: event.color,
          description: event.description,
          end: event.end,
          location: event.location,
          start: event.start,
          title: event.title,
        },
      };
    } catch (error) {
      console.error("Error fetching event:", error);
      return { error: "Failed to fetch the calendar event.", event: null };
    }
  },
});

export const getNextUpcomingEvent = tool({
  description:
    "Retrieves the very next upcoming event from all calendars from the current time. Tells you if the event is ongoing, starting soon, or upcoming.",
  inputSchema: z.object({}),
  execute: async () => {
    try {
      const activeAccountId = await getActiveAccountId();

      const now = new Date();
      const timeMin = now.toISOString();

      const timeMaxDate = new Date(now);
      timeMaxDate.setDate(now.getDate() + 7);
      const timeMax = timeMaxDate.toISOString();

      const eventsResponse = await api.calendar.getEvents({
        accountId: activeAccountId,
        includeAllDay: false,
        maxResults: 10,
        timeMax,
        timeMin,
      });

      if (!eventsResponse || eventsResponse.length === 0) {
        return {
          message: "No upcoming non-all-day events found in the next 7 days.",
        };
      }

      const sortedEvents = eventsResponse.sort((a, b) => {
        const startA = new Date(a.start).getTime();
        const startB = new Date(b.start).getTime();
        return startA - startB;
      });

      const nextEvent = sortedEvents[0];
      if (!nextEvent) {
        return {
          message: "No upcoming non-all-day events found in the next 7 days.",
        };
      }

      const eventStart = new Date(nextEvent.start);
      const eventEnd = new Date(nextEvent.end);
      let status = "upcoming";
      const minutesToStart =
        (eventStart.getTime() - now.getTime()) / (1000 * 60);

      if (now >= eventStart && now <= eventEnd) {
        status = "ongoing";
      } else if (minutesToStart > 0 && minutesToStart <= 30) {
        status = "starting_soon";
      }

      return {
        event: {
          id: nextEvent.id,
          allDay: nextEvent.allDay,
          calendarId: nextEvent.calendarId,
          color: nextEvent.color,
          description: nextEvent.description,
          end: nextEvent.end.toISOString(),
          location: nextEvent.location,
          start: nextEvent.start.toISOString(),
          title: nextEvent.title,
        },
        minutesToStart:
          minutesToStart > 0 ? Math.round(minutesToStart) : undefined,
        status,
      };
    } catch (error) {
      console.error("Error fetching next upcoming event:", error);
      return { error: "Failed to fetch the next upcoming event." };
    }
  },
});

const createEventSchema = z.object({
  attendees: z
    .array(
      z.object({
        email: z
          .string()
          .describe("The email address of a person to invite to the event."),
      }),
    )
    .optional()
    .describe(
      "A list of attendees to invite. Extract email addresses if provided.",
    ),
  createMeetLink: z
    .boolean()
    .optional()
    .default(false)
    .describe(
      "Set to true if the user explicitly requests a Google Meet link or implies a virtual meeting without providing a specific link.",
    ),
  description: z
    .string()
    .optional()
    .describe(
      "A more detailed description or notes for the event, if provided by the user.",
    ),
  endTime: z
    .string()
    .datetime({
      message:
        "Invalid ISO 8601 datetime format for endTime. Ensure the date and time are correctly inferred and formatted.",
    })
    .describe(
      "The end date and time of the event in ISO 8601 format (e.g., '2024-07-15T10:00:00-07:00'). The LLM must infer this. If the user specifies a start time and duration (e.g., 'for 1 hour'), calculate endTime. If only startTime is given, assume a default duration (e.g., 60 minutes).",
    ),
  location: z
    .string()
    .optional()
    .describe(
      "The physical location (e.g., 'Conference Room A', '123 Main St') or virtual meeting link for the event.",
    ),
  recurrence: z
    .enum(["none", "daily", "weekly", "monthly", "yearly"])
    .optional()
    .default("none")
    .describe(
      "The recurrence pattern for the event. 'none' for single events, 'daily' for daily recurring, 'weekly' for weekly recurring, 'monthly' for monthly recurring, 'yearly' for yearly recurring.",
    ),
  reminders: z
    .array(
      z.object({
        method: z
          .enum(["email", "popup"])
          .describe("The method of reminder: 'email' or 'popup'."),
        minutes: z
          .number()
          .int()
          .positive({ message: "Reminder minutes must be a positive integer." })
          .describe(
            "Number of minutes before the event start time for the reminder.",
          ),
      }),
    )
    .optional()
    .describe(
      "Custom reminders for the event, if specified by the user (e.g., 'remind me 10 minutes before').",
    ),
  startTime: z
    .string()
    .datetime({
      message:
        "Invalid ISO 8601 datetime format for startTime. Ensure the date and time are correctly inferred and formatted.",
    })
    .describe(
      "The start date and time of the event in ISO 8601 format (e.g., '2024-07-15T09:00:00-07:00'). The LLM must accurately infer this from natural language, including the full date and time.",
    ),
  summary: z
    .string()
    .describe(
      "The title or name of the event. This should be extracted directly from the user's description of the event's purpose.",
    ),
  timeZone: z
    .string()
    .optional()
    .describe(
      "The IANA time zone for the event's start and end times (e.g., 'America/Los_Angeles'). If the user doesn't specify, attempt to use the user's primary calendar timezone or a sensible default like UTC, and inform the user if a default is assumed.",
    ),
});

const updateEventSchema = z.object({
  attendeesToAdd: z
    .array(
      z.object({
        email: z
          .string()
          .describe("List of new attendees (by email) to add to the event."),
      }),
    )
    .optional()
    .describe("List of new attendees (by email) to add to the event."),
  attendeesToRemove: z
    .array(
      z.object({
        email: z
          .string()
          .describe(
            "List of existing attendees (by email) to remove from the event.",
          ),
      }),
    )
    .optional()
    .describe(
      "List of existing attendees (by email) to remove from the event.",
    ),
  description: z
    .string()
    .optional()
    .describe(
      "The new description for the event. If provided, this will replace the existing description.",
    ),
  eventId: z
    .string()
    .describe(
      "The unique ID of the event to update. This is mandatory. If the user's request is ambiguous, prompt them to first identify the specific event or use the 'Find Events' tool.",
    ),
  location: z
    .string()
    .optional()
    .describe(
      "The new location for the event. If provided, this will replace the existing location.",
    ),
  newEndTime: z
    .string()
    .datetime({ message: "Invalid ISO 8601 datetime format for newEndTime." })
    .optional()
    .describe(
      "The new end date and time in ISO 8601 format. If only newStartTime is provided, the agent should attempt to maintain the event's original duration when calculating this.",
    ),
  newStartTime: z
    .string()
    .datetime({ message: "Invalid ISO 8601 datetime format for newStartTime." })
    .optional()
    .describe(
      "The new start date and time in ISO 8601 format. If provided, newEndTime should also be considered or calculated based on original duration.",
    ),
  originalEndTime: z
    .string()
    .datetime({
      message: "Invalid ISO 8601 datetime format for originalEndTime.",
    })
    .optional()
    .describe(
      "The original end date and time of the event in ISO 8601 format. This is used for calculating the duration when only newStartTime is provided.",
    ),
  originalStartTime: z
    .string()
    .datetime({
      message: "Invalid ISO 8601 datetime format for originalStartTime.",
    })
    .optional()
    .describe(
      "The original start date and time of the event in ISO 8601 format. This is used for calculating the duration when only newStartTime is provided.",
    ),
  sendUpdates: z
    .enum(["all", "externalOnly", "none"])
    .optional()
    .default("all")
    .describe(
      "Specifies who should receive update notifications regarding the changes. Defaults to 'all'.",
    ),
  summary: z
    .string()
    .optional()
    .describe(
      "The new title for the event. If provided, this will replace the existing summary.",
    ),
  timeZone: z
    .string()
    .optional()
    .describe(
      "The IANA time zone for the new start and end times (e.g., 'America/Los_Angeles'). Applies if newStartTime or newEndTime are being set.",
    ),
});

export const updateEvent = tool({
  description:
    "Updates an existing event in the user's Google Calendar. Use this to change event details like title, time, location, attendees, or description. This tool requires an event identifier (eventId). If the user refers to an event ambiguously (e.g., 'my meeting tomorrow at 10'), the eventId might need to be found using the 'Find Events' tool first before this update tool can be used.",
  inputSchema: updateEventSchema,
  execute: async ({
    attendeesToAdd,
    attendeesToRemove,
    description,
    eventId,
    location,
    newEndTime,
    newStartTime,
    originalEndTime,
    originalStartTime,
    sendUpdates,
    summary,
    timeZone,
  }: z.infer<typeof updateEventSchema>) => {
    try {
      const activeAccountId = await getActiveAccountId();

      // Note: This tool assumes the caller has already fetched the event details
      // using the getEvent tool and is providing the necessary information for updates

      const updatePayload: any = {
        accountId: activeAccountId,
        calendarId: "primary",
        event: {},
        eventId,
      };

      // Update title if provided
      if (summary !== undefined) {
        updatePayload.event.title = summary;
      }

      // Update description if provided
      if (description !== undefined) {
        updatePayload.event.description = description;
      }

      // Update location if provided
      if (location !== undefined) {
        updatePayload.event.location = location;
      }

      // Handle time changes
      if (newStartTime) {
        updatePayload.event.start = new Date(newStartTime);

        // If end time is not provided but we have original times, maintain the original duration
        if (!newEndTime && originalStartTime && originalEndTime) {
          const originalDuration =
            new Date(originalEndTime).getTime() -
            new Date(originalStartTime).getTime();
          const newEndTimeDate = new Date(
            new Date(newStartTime).getTime() + originalDuration,
          );
          updatePayload.event.end = newEndTimeDate;
        }
      }

      if (newEndTime) {
        updatePayload.event.end = new Date(newEndTime);
      }

      // Handle attendees (this would actually happen in the backend with the full event object)
      // We're just preparing the update request here

      // Add timezone if provided
      if (timeZone) {
        updatePayload.timeZone = timeZone;
      }

      // Update the event using the trpc procedure
      const updatedEvent = await api.calendar.updateEvent(updatePayload);

      return {
        event: {
          id: updatedEvent.id,
          allDay: updatedEvent.allDay,
          calendarId: updatedEvent.calendarId,
          description: updatedEvent.description,
          end: updatedEvent.end.toISOString(),
          location: updatedEvent.location,
          start: updatedEvent.start.toISOString(),
          title: updatedEvent.title,
        },
        message: "Event updated successfully.",
      };
    } catch (error) {
      console.error("Error updating event with tool:", error);
      const errorMessage =
        typeof error === "object" && error !== null && "message" in error
          ? String((error as { message: string }).message)
          : "Failed to update calendar event due to an unexpected error.";
      return { error: errorMessage };
    }
  },
});

export const deleteEvent = tool({
  description:
    "Deletes an existing event from the user's Google Calendar. Use this when a user wants to remove or cancel a meeting, appointment, or other calendar entry. This tool requires an event identifier (eventId). If the user refers to an event ambiguously (e.g., 'delete my meeting tomorrow at 10'), the eventId might need to be found using the 'Find Events' tool first.",
  inputSchema: z.object({
    calendarId: z
      .string()
      .default("primary")
      .describe(
        "The calendar ID where the event is located. Defaults to 'primary'.",
      ),
    eventId: z
      .string()
      .describe("The unique identifier of the event to delete."),
  }),
  execute: async ({ calendarId, eventId }) => {
    try {
      const activeAccountId = await getActiveAccountId();

      const deletedEventDetails = await api.calendar.deleteEvent({
        accountId: activeAccountId,
        calendarId,
        eventId,
      });

      return {
        deletedEvent: {
          id: deletedEventDetails.id,
          allDay: deletedEventDetails.allDay,
          end: deletedEventDetails.end.toISOString(),
          start: deletedEventDetails.start.toISOString(),
          title: deletedEventDetails.title,
        },
        message: "Event deleted successfully.",
        success: true,
      };
    } catch (error) {
      console.error("Error deleting event with tool:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : typeof error === "object" && error !== null && "message" in error
            ? String((error as { message: string }).message)
            : "Failed to delete calendar event due to an unexpected error.";

      // Include eventId in the error response for context, if deletion failed
      return { error: errorMessage, eventId, success: false };
    }
  },
});

export const createEvent = tool({
  description:
    "Creates a new event in the user's Google Calendar. Use this to schedule meetings, appointments, or other calendar entries based on user-provided details like title, date, time, attendees, and location.",
  inputSchema: createEventSchema,
  execute: async ({
    attendees,
    createMeetLink,
    description,
    endTime,
    location,
    recurrence,
    reminders,
    startTime,
    summary,
    timeZone,
  }: z.infer<typeof createEventSchema>) => {
    try {
      const activeAccountId = await getActiveAccountId();

      const parsedStartTime = new Date(startTime);
      const parsedEndTime = new Date(endTime);

      let remindersPayload:
        | { overrides: typeof reminders; useDefault: boolean }
        | undefined;
      if (reminders && reminders.length > 0) {
        remindersPayload = {
          overrides: reminders,
          useDefault: false,
        };
      }

      const createdEvent = await api.calendar.createEvent({
        accountId: activeAccountId,
        calendarId: "primary",
        createMeetLink: createMeetLink ?? false,
        event: {
          attendees,
          description,
          end: parsedEndTime,
          location,
          recurrence,
          reminders: remindersPayload as any,
          start: parsedStartTime,
          title: summary,
        },
        timeZone,
      });

      return {
        event: {
          id: createdEvent.id,
          allDay: createdEvent.allDay,
          calendarId: createdEvent.calendarId,
          description: createdEvent.description,
          end: createdEvent.end.toISOString(),
          location: createdEvent.location,
          start: createdEvent.start.toISOString(),
          title: createdEvent.title,
          // htmlLink: createdEvent.htmlLink, // Removed as ProcessedCalendarEventSchema likely lacks htmlLink
        },
        message: "Event created successfully.",
      };
    } catch (error) {
      console.error("Error creating event with tool:", error);
      const errorMessage =
        typeof error === "object" && error !== null && "message" in error
          ? String((error as { message: string }).message)
          : "Failed to create calendar event due to an unexpected error.";
      return { error: errorMessage };
    }
  },
});

export const createRecurringEvent = tool({
  description:
    "Creates a new recurring event in the user's Google Calendar. Use this specifically when a user wants to create repeating events like daily meetings, weekly standup, monthly reviews, etc. This tool handles recurring patterns including daily, weekly, monthly, or yearly recurrence.",
  inputSchema: createEventSchema.omit({ recurrence: true }).extend({
    recurrence: z
      .enum(["daily", "weekly", "monthly", "yearly"])
      .describe(
        "The recurrence pattern for the event. Required field - must be one of: 'daily', 'weekly', 'monthly', or 'yearly'.",
      ),
  }),
  execute: async ({
    attendees,
    createMeetLink,
    description,
    endTime,
    location,
    recurrence,
    reminders,
    startTime,
    summary,
    timeZone,
  }: z.infer<typeof createEventSchema> & {
    recurrence: "daily" | "monthly" | "weekly" | "yearly";
  }) => {
    try {
      const activeAccountId = await getActiveAccountId();

      const parsedStartTime = new Date(startTime);
      const parsedEndTime = new Date(endTime);

      let remindersPayload:
        | { overrides: typeof reminders; useDefault: boolean }
        | undefined;
      if (reminders && reminders.length > 0) {
        remindersPayload = {
          overrides: reminders,
          useDefault: false,
        };
      }

      const createdEvent = await api.calendar.createEvent({
        accountId: activeAccountId,
        calendarId: "primary",
        createMeetLink: createMeetLink ?? false,
        event: {
          attendees,
          description,
          end: parsedEndTime,
          location,
          recurrence,
          reminders: remindersPayload as any,
          start: parsedStartTime,
          title: summary,
        },
        timeZone,
      });

      return {
        event: {
          id: createdEvent.id,
          allDay: createdEvent.allDay,
          calendarId: createdEvent.calendarId,
          description: createdEvent.description,
          end: createdEvent.end.toISOString(),
          location: createdEvent.location,
          recurrence,
          start: createdEvent.start.toISOString(),
          title: createdEvent.title,
        },
        message: `Recurring event created successfully. This event will repeat ${recurrence}.`,
      };
    } catch (error) {
      console.error("Error creating recurring event with tool:", error);
      const errorMessage =
        typeof error === "object" && error !== null && "message" in error
          ? String((error as { message: string }).message)
          : "Failed to create recurring calendar event due to an unexpected error.";
      return { error: errorMessage };
    }
  },
});

export const getFreeSlotsSchema = z.object({
  calendarIds: z
    .array(
      z
        .string()
        .describe(
          "A calendar ID, typically 'primary' for the user or an email address for another person.",
        ),
    )
    .min(1, { message: "At least one calendar ID must be provided." })
    .describe(
      "A list of calendar IDs to check for free/busy information. For the current user, 'primary' is common. For others, use their email address.",
    ),
  timeMax: z
    .string()
    .datetime({ message: "Invalid ISO 8601 datetime format for timeMax." })
    .describe(
      "The end of the date/time range for the free/busy query, in ISO 8601 format. Must be accurately inferred (e.g., 'tomorrow morning' implies end of business hours or noon).",
    ),
  timeMin: z
    .string()
    .datetime({ message: "Invalid ISO 8601 datetime format for timeMin." })
    .describe(
      "The start of the date/time range for the free/busy query, in ISO 8601 format. Must be accurately inferred from the user's request (e.g., 'tomorrow morning' implies start of business hours).",
    ),
  timeZone: z
    .string()
    .optional()
    .describe(
      "The IANA time zone (e.g., 'America/New_York') for interpreting timeMin and timeMax if they lack offsets, and for the response. If not specified, agent should use user's primary calendar timezone or UTC and clarify if necessary.",
    ),
});

export const getFreeSlots = tool({
  description:
    "Queries the free/busy status for a list of specified calendars within a given time range. Use this to determine when users are available or busy, which is essential for finding suitable meeting times or answering questions about availability.",
  inputSchema: getFreeSlotsSchema,
  execute: async ({
    calendarIds,
    timeMax,
    timeMin,
    timeZone,
  }: z.infer<typeof getFreeSlotsSchema>) => {
    try {
      const activeAccountId = await getActiveAccountId();

      const freeBusyInfo = await api.calendar.getFreeSlots({
        accountId: activeAccountId,
        calendarIds,
        timeMax,
        timeMin,
        timeZone,
      });

      return { freeBusyData: freeBusyInfo };
    } catch (error) {
      console.error("Error querying free/busy times:", error);
      const errorMessage =
        typeof error === "object" && error !== null && "message" in error
          ? String((error as { message: string }).message)
          : "Failed to query free/busy information due to an unexpected error.";
      return { error: errorMessage, freeBusyData: null };
    }
  },
});
