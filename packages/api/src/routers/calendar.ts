import { v7 as uuidv7 } from "uuid";
import { z } from "zod";

import {
  RefreshableGoogleCalendar,
  type Event as GoogleCalendarEvent,
} from "@weekday/google-calendar";
import {
  calculateFreeSlotsFromBusy,
  convertRecurrenceToRRule,
  getGoogleAccount,
  mergeAndSortBusyIntervals,
  prepareEventData,
  ProcessedCalendarEventSchema,
  processEventData,
} from "@weekday/lib";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import {
  GoogleFreeBusyResponseSchema,
  ProcessedCalendarListEntrySchema,
  TimeSlotSchema,
} from "./schema";

// TODO: db: any -> PrismaClient
async function createGoogleCalendarClient(db: any, userId: string) {
  const account = await getGoogleAccount(db, userId);
  if (!account.accessToken) throw new Error("No access token found");

  return new RefreshableGoogleCalendar({
    apiKey: account.accessToken,
    db,
    userId,
  });
}

export const calendarRouter = createTRPCRouter({
  createEvent: protectedProcedure
    .input(
      z.object({
        calendarId: z.string(),
        createMeetLink: z.boolean().optional().default(false),
        event: z.object({
          allDay: z.boolean().optional().default(false),
          attendees: z
            .array(z.object({ email: z.string().email() }))
            .optional(),
          color: z.string().optional(),
          description: z.string().optional(),
          end: z.date(),
          location: z.string().optional(),
          recurrence: z
            .enum(["none", "daily", "weekly", "monthly", "yearly"])
            .optional(),
          reminders: z
            .object({
              overrides: z
                .array(
                  z.object({
                    method: z.enum(["email", "popup"]),
                    minutes: z.number().int().positive(),
                  })
                )
                .optional(),
              useDefault: z.boolean().optional(),
            })
            .optional(),
          start: z.date(),
          title: z.string(),
        }),
      })
    )
    .output(ProcessedCalendarEventSchema)
    .mutation(async ({ ctx, input }) => {
      const client = await createGoogleCalendarClient(
        ctx.db,
        ctx.session.user.id
      );

      const baseEventData = prepareEventData({
        allDay: input.event.allDay,
        color: input.event.color,
        description: input.event.description,
        end: input.event.end,
        location: input.event.location,
        start: input.event.start,
        title: input.event.title,
      });

      const finalEventPayload: any = { ...baseEventData };

      if (input.event.attendees && input.event.attendees.length > 0) {
        finalEventPayload.attendees = input.event.attendees;
      }

      if (input.event.reminders) {
        finalEventPayload.reminders = input.event.reminders;
      }

      if (input.createMeetLink) {
        finalEventPayload.conferenceData = {
          createRequest: { requestId: uuidv7() },
        };
      }

      if (input.event.recurrence && input.event.recurrence !== "none") {
        const recurrenceRules = convertRecurrenceToRRule(
          input.event.recurrence,
          input.event.start
        );
        if (recurrenceRules) {
          finalEventPayload.recurrence = recurrenceRules;
        }
      }

      const createParams: any = {
        ...finalEventPayload,
      };

      if (input.createMeetLink) {
        createParams.conferenceDataVersion = 1;
      }

      if (input.event.attendees && input.event.attendees.length > 0) {
        createParams.sendUpdates = "all";
      }

      try {
        const createdEvent = await client.calendars.events.create(
          input.calendarId,
          createParams
        );
        return processEventData(createdEvent, input.calendarId);
      } catch (error) {
        console.error("Error creating event:", error);
        throw error;
      }
    }),

  deleteEvent: protectedProcedure
    .input(
      z.object({
        calendarId: z.string(),
        eventId: z.string(),
      })
    )
    .output(ProcessedCalendarEventSchema)
    .mutation(async ({ ctx, input }) => {
      const client = await createGoogleCalendarClient(
        ctx.db,
        ctx.session.user.id
      );

      let eventToReturn: any;
      try {
        const event = await client.calendars.events.retrieve(input.eventId, {
          calendarId: input.calendarId,
        });
        eventToReturn = processEventData(event, input.calendarId);
      } catch (error) {
        console.error("Error fetching event before deletion:", error);
        throw new Error("Event not found, cannot delete.");
      }

      try {
        await client.calendars.events.delete(input.eventId, {
          calendarId: input.calendarId,
        });
        return eventToReturn;
      } catch (error) {
        console.error("Error deleting event:", error);
        throw error;
      }
    }),

  getCalendars: protectedProcedure
    .output(z.array(ProcessedCalendarListEntrySchema))
    .query(async ({ ctx }) => {
      const client = await createGoogleCalendarClient(
        ctx.db,
        ctx.session.user.id
      );

      try {
        const response = await client.users.me.calendarList.list();

        const processedItems = (response.items || []).map((item: any) => {
          const isEmailSummary = z
            .string()
            .email()
            .safeParse(item.summary).success;
          const isUserPrimaryCalendar =
            isEmailSummary && item.summary === ctx.session.user.email;
          const displaySummary = isUserPrimaryCalendar
            ? (ctx.session.user.name ?? item.summary ?? "")
            : (item.summary ?? "");

          return {
            id: item.id,
            accessRole: item.accessRole,
            backgroundColor: item.backgroundColor,
            foregroundColor: item.foregroundColor,
            primary: item.primary,
            summary: displaySummary,
          };
        });

        processedItems.sort((a: any, b: any) => {
          if (a.primary && !b.primary) {
            return -1;
          }
          if (!a.primary && b.primary) {
            return 1;
          }
          return a.summary.localeCompare(b.summary);
        });

        return processedItems;
      } catch (error) {
        console.error("Error fetching calendar list:", error);
        throw error;
      }
    }),

  getEvent: protectedProcedure
    .input(
      z.object({
        calendarId: z.string(),
        eventId: z.string(),
      })
    )
    .output(ProcessedCalendarEventSchema)
    .query(async ({ ctx, input }) => {
      const client = await createGoogleCalendarClient(
        ctx.db,
        ctx.session.user.id
      );

      try {
        const event = await client.calendars.events.retrieve(input.eventId, {
          calendarId: input.calendarId,
        });
        return processEventData(event, input.calendarId);
      } catch (error) {
        console.error("Error fetching event:", error);
        throw error;
      }
    }),

  getEvents: protectedProcedure
    .input(
      z
        .object({
          calendarIds: z.array(z.string()).optional(),
          includeAllDay: z.boolean().optional().default(true),
          maxResults: z.number().int().positive().optional(),
          timeMax: z.string().optional(),
          timeMin: z.string().optional(),
        })
        .optional()
    )
    .output(z.array(ProcessedCalendarEventSchema))
    .query(async ({ ctx, input }) => {
      const client = await createGoogleCalendarClient(
        ctx.db,
        ctx.session.user.id
      );

      try {
        const calListResponse = await client.users.me.calendarList.list();

        let calendarsToFetch = (calListResponse.items || []).map(
          (item: any) => ({
            id: item.id,
            backgroundColor: item.backgroundColor,
          })
        );

        if (input?.calendarIds?.length) {
          calendarsToFetch = calendarsToFetch.filter((c: any) =>
            input.calendarIds!.includes(c.id)
          );
        }

        const now = new Date();
        const defaultTimeMin = new Date(now.getFullYear(), now.getMonth(), 1);
        const defaultTimeMax = new Date(
          now.getFullYear(),
          now.getMonth() + 1,
          0,
          23,
          59,
          59
        );

        const timeMinISO = input?.timeMin ?? defaultTimeMin.toISOString();
        const timeMaxISO = input?.timeMax ?? defaultTimeMax.toISOString();

        const timeMinDate = new Date(timeMinISO);
        const timeMaxDate = new Date(timeMaxISO);

        const fetchPromises = calendarsToFetch.map(async (calendar: any) => {
          try {
            const response = await client.calendars.events.list(calendar.id, {
              maxResults: input?.maxResults ?? 2500,
              orderBy: "startTime",
              singleEvents: true,
              timeMax: timeMaxISO,
              timeMin: timeMinISO,
            });

            const items = (response.items ?? []) as any[];

            const validEvents = items
              .filter((item) => {
                const startStr = item.start?.dateTime ?? item.start?.date;
                const endStr = item.end?.dateTime ?? item.end?.date;
                return !!startStr && !!endStr;
              })
              .map((item) => processEventData(item, calendar.id));

            return validEvents.filter((event) => {
              const eventStart = new Date(event.start);
              const eventEnd = new Date(event.end);

              if (!event.allDay) {
                return eventStart < timeMaxDate && eventEnd > timeMinDate;
              } else if (input?.includeAllDay !== false) {
                return eventStart <= timeMaxDate && eventEnd >= timeMinDate;
              }

              return false;
            });
          } catch (fetchError) {
            console.error(
              `Error fetching events for calendar ${calendar.id}:`,
              fetchError
            );
            return [];
          }
        });

        const results = await Promise.all(fetchPromises);
        const flatResults = results.flat();

        return flatResults;
      } catch (error) {
        console.error("Error fetching calendar events:", error);
        throw error;
      }
    }),

  getFreeSlots: protectedProcedure
    .input(
      z.object({
        calendarIds: z.array(z.string()).min(1).optional().default(["primary"]),
        timeMax: z.string().datetime({
          message: "Invalid timeMax format. Expected ISO 8601 datetime string.",
        }),
        timeMin: z.string().datetime({
          message: "Invalid timeMin format. Expected ISO 8601 datetime string.",
        }),
        timeZone: z.string().optional().default("UTC"),
      })
    )
    .output(z.array(TimeSlotSchema))
    .query(async ({ ctx, input }) => {
      const client = await createGoogleCalendarClient(
        ctx.db,
        ctx.session.user.id
      );

      const requestBody = {
        items: input.calendarIds.map((id) => ({ id })),
        timeMax: input.timeMax,
        timeMin: input.timeMin,
        timeZone: input.timeZone,
      };

      try {
        const freeBusyDataRaw =
          await client.freeBusy.checkAvailability(requestBody);
        const freeBusyData =
          GoogleFreeBusyResponseSchema.parse(freeBusyDataRaw);

        const allBusyPeriodsRaw: Array<{ end: string; start: string }> = [];
        for (const calId in freeBusyData.calendars) {
          const calendarInfo = freeBusyData.calendars[calId];
          if (calendarInfo?.errors && calendarInfo.errors.length > 0) {
            console.warn(
              `Errors encountered for calendar ${calId}:`,
              calendarInfo.errors
            );
          }

          if (calendarInfo?.busy) {
            allBusyPeriodsRaw.push(...calendarInfo.busy);
          }
        }

        const mergedBusyIntervals =
          mergeAndSortBusyIntervals(allBusyPeriodsRaw);

        const queryStartTime = new Date(input.timeMin);
        const queryEndTime = new Date(input.timeMax);

        if (queryStartTime >= queryEndTime) {
          console.warn(
            "timeMin is not before timeMax, returning no free slots."
          );
          return [];
        }

        const freeSlots = calculateFreeSlotsFromBusy(
          mergedBusyIntervals,
          queryStartTime,
          queryEndTime
        );

        return freeSlots;
      } catch (error) {
        console.error("Error fetching or processing free/busy data:", error);
        throw error;
      }
    }),

  updateEvent: protectedProcedure
    .input(
      z.object({
        calendarId: z.string(),
        event: z.object({
          allDay: z.boolean().optional(),
          color: z.string().optional(),
          description: z.string().optional(),
          end: z.date().optional(),
          location: z.string().optional(),
          recurrence: z
            .enum(["none", "daily", "weekly", "monthly", "yearly"])
            .optional(),
          start: z.date().optional(),
          title: z.string().optional(),
        }),
        eventId: z.string(),
      })
    )
    .output(ProcessedCalendarEventSchema)
    .mutation(async ({ ctx, input }) => {
      const client = await createGoogleCalendarClient(
        ctx.db,
        ctx.session.user.id
      );

      try {
        const currentEvent = await client.calendars.events.retrieve(
          input.eventId,
          {
            calendarId: input.calendarId,
          }
        );

        console.log("currentEvent trpc route: calendar", currentEvent);

        const eventData = prepareEventData(
          {
            allDay: input.event.allDay,
            color: input.event.color,
            description: input.event.description,
            end: input.event.end,
            location: input.event.location,
            start: input.event.start,
            title: input.event.title,
          },
          currentEvent
        );

        if (input.event.recurrence !== undefined) {
          if (input.event.recurrence === "none") {
            eventData.recurrence = null;
          } else {
            const recurrenceRules = convertRecurrenceToRRule(
              input.event.recurrence,
              input.event.start ||
                new Date(
                  (currentEvent as any).start?.dateTime ||
                    (currentEvent as any).start?.date!
                )
            );
            if (recurrenceRules) {
              eventData.recurrence = recurrenceRules;
            }
          }
        }

        const updatedEvent = await client.calendars.events.update(
          input.eventId,
          {
            calendarId: input.calendarId,
            ...eventData,
          }
        );

        return processEventData(updatedEvent, input.calendarId);
      } catch (error) {
        console.error("Error updating event:", error);
        throw error;
      }
    }),
});
