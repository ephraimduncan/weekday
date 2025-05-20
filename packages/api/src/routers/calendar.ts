import { v7 as uuidv7 } from "uuid";
import { z } from "zod";

import {
  GOOGLE_CALENDAR_LIST_API_URL,
  GOOGLE_FREEBUSY_API_URL,
  type GoogleEvent,
  calculateFreeSlotsFromBusy,
  createHeaders,
  createRequestOptions,
  executeRequest,
  getGoogleAccount,
  mergeAndSortBusyIntervals,
  prepareEventData,
  processEventData,
} from "@weekday/lib";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import {
  CalendarListResponseSchema,
  GoogleFreeBusyResponseSchema,
  ProcessedCalendarEventSchema,
  ProcessedCalendarListEntrySchema,
  TimeSlotSchema,
} from "./schema";

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
      const account = await getGoogleAccount(ctx.db, ctx.session.user.id);

      if (!account.accessToken) throw new Error("No access token found");

      const headers = createHeaders(account.accessToken);
      headers.append("Content-Type", "application/json");

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

      const queryParams = new URLSearchParams();
      if (input.createMeetLink) {
        queryParams.append("conferenceDataVersion", "1");
      }

      if (input.event.attendees && input.event.attendees.length > 0) {
        queryParams.append("sendUpdates", "all");
      }

      const calendarApiBaseUrl = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(input.calendarId)}/events`;
      const finalUrl = queryParams.toString()
        ? `${calendarApiBaseUrl}?${queryParams.toString()}`
        : calendarApiBaseUrl;

      const options = createRequestOptions(
        headers,
        "POST",
        JSON.stringify(finalEventPayload)
      );

      try {
        const response = await executeRequest(
          finalUrl,
          options,
          account,
          ctx.session.user.id
        );

        const item = await response.json();
        return processEventData(item, input.calendarId);
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
      const account = await getGoogleAccount(ctx.db, ctx.session.user.id);

      if (!account.accessToken) throw new Error("No access token found");

      const headers = createHeaders(account.accessToken);

      let eventToReturn: any;
      try {
        const getUrl = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(input.calendarId)}/events/${encodeURIComponent(input.eventId)}`;
        const getOptions = createRequestOptions(headers);
        const response = await executeRequest(
          getUrl,
          getOptions,
          account,
          ctx.session.user.id
        );
        const item = await response.json();
        if (response.status === 404) {
          throw new Error("Event not found, cannot delete.");
        }
        if (!response.ok) {
          const errorData = item as { error?: { message?: string } };
          const errorMessage =
            errorData.error?.message ||
            `Failed to fetch event before deletion (status: ${response.status})`;
          throw new Error(errorMessage);
        }
        eventToReturn = processEventData(item, input.calendarId);
      } catch (error) {
        console.error("Error fetching event before deletion in tRPC:", error);
        if (error instanceof Error) {
          throw error;
        }
        throw new Error(
          "Failed to fetch event details before attempting deletion."
        );
      }

      const deleteUrl = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(input.calendarId)}/events/${encodeURIComponent(input.eventId)}`;
      const deleteOptions = createRequestOptions(headers, "DELETE");

      try {
        const deleteResponse = await executeRequest(
          deleteUrl,
          deleteOptions,
          account,
          ctx.session.user.id
        );
        if (!deleteResponse.ok && deleteResponse.status !== 204) {
          let googleErrorMessage = "Failed to delete the event.";
          try {
            const errorBody = await deleteResponse.json();
            googleErrorMessage =
              errorBody?.error?.message || googleErrorMessage;
          } catch (e) {
            /* Ignore parsing error */
          }
          throw new Error(googleErrorMessage);
        }

        return eventToReturn;
      } catch (error) {
        console.error("Error deleting event in tRPC:", error);
        if (error instanceof Error) {
          throw error;
        }
        throw new Error(
          "Failed to delete the event after fetching its details."
        );
      }
    }),

  getCalendars: protectedProcedure
    .output(z.array(ProcessedCalendarListEntrySchema))
    .query(async ({ ctx }) => {
      const account = await getGoogleAccount(ctx.db, ctx.session.user.id);

      if (!account.accessToken) throw new Error("No access token found");

      const headers = createHeaders(account.accessToken);
      const options = createRequestOptions(headers);

      try {
        const response = await executeRequest(
          GOOGLE_CALENDAR_LIST_API_URL,
          options,
          account,
          ctx.session.user.id
        );

        const data = await response.json();
        const parsedData = CalendarListResponseSchema.parse(data);

        const processedItems = parsedData.items.map((item) => {
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

        // Sort calendars - primary calendar first, then alphabetically
        processedItems.sort((a, b) => {
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
        console.error("Error fetching or parsing calendar list:", error);
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
      const account = await getGoogleAccount(ctx.db, ctx.session.user.id);

      if (!account.accessToken) throw new Error("No access token found");

      const headers = createHeaders(account.accessToken);
      const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(input.calendarId)}/events/${encodeURIComponent(input.eventId)}`;
      const options = createRequestOptions(headers);

      try {
        const response = await executeRequest(
          url,
          options,
          account,
          ctx.session.user.id
        );

        const item = await response.json();
        return processEventData(item, input.calendarId);
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
      const account = await getGoogleAccount(ctx.db, ctx.session.user.id);

      if (!account.accessToken) throw new Error("No access token found");

      const headers = createHeaders(account.accessToken);
      const options = createRequestOptions(headers);

      try {
        const calListResponse = await executeRequest(
          GOOGLE_CALENDAR_LIST_API_URL,
          options,
          account,
          ctx.session.user.id
        );

        const calListData = await calListResponse.json();
        const parsedCalList = CalendarListResponseSchema.parse(calListData);

        let calendarsToFetch = parsedCalList.items.map((item) => ({
          id: item.id,
          backgroundColor: item.backgroundColor,
        }));

        if (input?.calendarIds?.length) {
          calendarsToFetch = calendarsToFetch.filter((c) =>
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

        const fetchPromises = calendarsToFetch.map(async (calendar) => {
          const params = new URLSearchParams({
            maxResults: input?.maxResults?.toString() ?? "2500",
            orderBy: "startTime",
            singleEvents: "true",
            timeMax: timeMaxISO,
            timeMin: timeMinISO,
          });

          const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendar.id)}/events?${params.toString()}`;

          try {
            const response = await executeRequest(
              url,
              options,
              account,
              ctx.session.user.id
            );

            const evData = await response.json();
            const items = (evData.items ?? []) as GoogleEvent[];

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
      const account = await getGoogleAccount(ctx.db, ctx.session.user.id);
      if (!account.accessToken) {
        throw new Error("No access token found for Google Account.");
      }

      const headers = createHeaders(account.accessToken);
      headers.append("Content-Type", "application/json");

      const requestBody = {
        items: input.calendarIds.map((id) => ({ id })),
        timeMax: input.timeMax,
        timeMin: input.timeMin,
        timeZone: input.timeZone,
      };

      const options = createRequestOptions(
        headers,
        "POST",
        JSON.stringify(requestBody)
      );

      try {
        const response = await executeRequest(
          GOOGLE_FREEBUSY_API_URL,
          options,
          account,
          ctx.session.user.id
        );
        const freeBusyDataRaw = await response.json();
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
          start: z.date().optional(),
          title: z.string().optional(),
        }),
        eventId: z.string(),
      })
    )
    .output(ProcessedCalendarEventSchema)
    .mutation(async ({ ctx, input }) => {
      const account = await getGoogleAccount(ctx.db, ctx.session.user.id);

      if (!account.accessToken) throw new Error("No access token found");

      const headers = createHeaders(account.accessToken);
      headers.append("Content-Type", "application/json");

      // First fetch the current event to update
      const getUrl = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(input.calendarId)}/events/${encodeURIComponent(input.eventId)}`;
      const getOptions = createRequestOptions(headers);

      try {
        // Get the current event
        const getResponse = await executeRequest(
          getUrl,
          getOptions,
          account,
          ctx.session.user.id
        );

        const currentEvent = await getResponse.json();

        // Prepare event data using our helper function
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

        // Update the event
        const updateUrl = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(input.calendarId)}/events/${encodeURIComponent(input.eventId)}`;
        const updateOptions = createRequestOptions(
          headers,
          "PUT",
          JSON.stringify(eventData)
        );

        const updateResponse = await executeRequest(
          updateUrl,
          updateOptions,
          account,
          ctx.session.user.id
        );

        const item = await updateResponse.json();
        return processEventData(item, input.calendarId);
      } catch (error) {
        console.error("Error updating event:", error);
        throw error;
      }
    }),
});
