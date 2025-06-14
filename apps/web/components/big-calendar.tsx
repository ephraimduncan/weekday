"use client";

import { useMemo } from "react";

import { addMonths, endOfMonth, startOfMonth, subMonths } from "date-fns";
import { v7 as uuidv7 } from "uuid";

import { type CalendarEvent, EventCalendar } from "@/components/event-calendar";
import { useCalendarContext } from "@/components/event-calendar/calendar-context";
import { type RouterInputs, type RouterOutputs, api } from "@/trpc/react";

type CreateEventMutationContext = {
  optimisticEvent: ProcessedEventType;
  previousEvents: GetEventsQueryOutput;
  queryKey: { timeMax: string; timeMin: string };
};
type DeleteEventMutationContext = {
  deletedEventId: string;
  previousEvents: GetEventsQueryOutput;
  queryKey: { timeMax: string; timeMin: string };
};

type GetEventsQueryOutput = RouterOutputs["calendar"]["getEvents"] | undefined;
type ProcessedEventType = RouterOutputs["calendar"]["getEvents"][number];
type UpdateEventMutationContext = {
  previousEvents: GetEventsQueryOutput;
  queryKey: { timeMax: string; timeMin: string };
};

export function BigCalendar() {
  const { currentDate, isCalendarVisible } = useCalendarContext();
  const utils = api.useUtils();

  const { timeMax, timeMin } = useMemo(() => {
    const start = startOfMonth(subMonths(currentDate, 3));
    const end = endOfMonth(addMonths(currentDate, 3));
    return {
      timeMax: end.toISOString(),
      timeMin: start.toISOString(),
    };
  }, [currentDate]);

  const { data: events } = api.calendar.getEvents.useQuery(
    {
      timeMax,
      timeMin,
    },
    {
      gcTime: 1000 * 60 * 60 * 24,
      staleTime: Infinity,
      placeholderData: (prev) => prev,
    },
  );

  // Prefetch next chunk of data when we're within 1 month of the boundary
  const prefetchThreshold = 30; // days
  const oneDayMs = 24 * 60 * 60 * 1000;
  const prefetchThresholdMs = prefetchThreshold * oneDayMs;

  // Check if we're approaching the future boundary and prefetch if needed
  const timeToEndBoundary = new Date(timeMax).getTime() - currentDate.getTime();
  if (timeToEndBoundary <= prefetchThresholdMs) {
    const nextPrefetchEndDate = endOfMonth(addMonths(new Date(timeMax), 3));
    const nextPrefetchStartDate = startOfMonth(new Date(timeMax));

    // Prefetch next chunk
    void utils.calendar.getEvents.prefetch({
      timeMax: nextPrefetchEndDate.toISOString(),
      timeMin: nextPrefetchStartDate.toISOString(),
    });
  }

  // Check if we're approaching the past boundary and prefetch if needed
  const timeToStartBoundary =
    currentDate.getTime() - new Date(timeMin).getTime();
  if (timeToStartBoundary <= prefetchThresholdMs) {
    const nextPrefetchStartDate = startOfMonth(subMonths(new Date(timeMin), 3));
    const nextPrefetchEndDate = endOfMonth(new Date(timeMin));

    // Prefetch previous chunk
    void utils.calendar.getEvents.prefetch({
      timeMax: nextPrefetchEndDate.toISOString(),
      timeMin: nextPrefetchStartDate.toISOString(),
    });
  }

  // Filter events based on calendar visibility setting
  const visibleEvents = useMemo(() => {
    return events?.filter((event) => isCalendarVisible(event.calendarId));
  }, [events, isCalendarVisible]);

  const { isPending: isCreatingEvent, mutate: createEvent } =
    api.calendar.createEvent.useMutation({
      onError: (
        err,
        newEventData,
        context: CreateEventMutationContext | undefined,
      ) => {
        if (context?.previousEvents && context?.queryKey) {
          utils.calendar.getEvents.setData(
            context.queryKey,
            context.previousEvents,
          );
        }
        console.error(
          "Error creating event, rolled back optimistic update:",
          err,
        );
      },
      onMutate: async (
        newEventData: RouterInputs["calendar"]["createEvent"],
      ): Promise<CreateEventMutationContext> => {
        // Use the current timeMin and timeMax for this operation
        const queryKey = { timeMax, timeMin };

        await utils.calendar.getEvents.cancel(queryKey);
        const previousEvents = utils.calendar.getEvents.getData(queryKey);

        const optimisticEvent: ProcessedEventType = {
          id: uuidv7(),
          allDay: newEventData.event.allDay ?? false,
          calendarId: newEventData.calendarId,
          color: newEventData.event.color ?? "#3174ad",
          description: newEventData.event.description,
          end: newEventData.event.end,
          location: newEventData.event.location,
          start: newEventData.event.start,
          title: newEventData.event.title,
        };

        utils.calendar.getEvents.setData(
          queryKey,
          (oldEvents) =>
            (oldEvents
              ? [...oldEvents, optimisticEvent]
              : [optimisticEvent]) as GetEventsQueryOutput,
        );
        return { optimisticEvent, previousEvents, queryKey };
      },
      onSettled: (
        data,
        error,
        variables,
        context: CreateEventMutationContext | undefined,
      ) => {
        if (context?.queryKey) {
          utils.calendar.getEvents.invalidate(context.queryKey);
        } else {
          utils.calendar.getEvents.invalidate();
        }
        utils.calendar.getFreeSlots.invalidate();
      },
      onSuccess: (
        data,
        variables,
        context: CreateEventMutationContext | undefined,
      ) => {
        if (context?.optimisticEvent && context?.queryKey) {
          utils.calendar.getEvents.setData(
            context.queryKey,
            (oldEvents) =>
              oldEvents?.map((event) =>
                event.id === context.optimisticEvent.id ? data : event,
              ) as GetEventsQueryOutput,
          );
        } else {
          utils.calendar.getEvents.invalidate();
        }
      },
    });

  const { isPending: isUpdatingEvent, mutate: updateEvent } =
    api.calendar.updateEvent.useMutation({
      onError: (
        err,
        updatedEventData,
        context: UpdateEventMutationContext | undefined,
      ) => {
        if (context?.previousEvents && context?.queryKey) {
          utils.calendar.getEvents.setData(
            context.queryKey,
            context.previousEvents,
          );
        }
        console.error(
          "Error updating event, rolled back optimistic update:",
          err,
        );
      },
      onMutate: async (
        updatedEventData: RouterInputs["calendar"]["updateEvent"],
      ): Promise<UpdateEventMutationContext> => {
        // Use the current timeMin and timeMax for this operation
        const queryKey = { timeMax, timeMin };

        await utils.calendar.getEvents.cancel(queryKey);
        const previousEvents = utils.calendar.getEvents.getData(queryKey);

        utils.calendar.getEvents.setData(
          queryKey,
          (oldEvents) =>
            oldEvents?.map((event) =>
              event.id === updatedEventData.eventId
                ? ({
                    ...event,
                    allDay: updatedEventData.event.allDay ?? event.allDay,
                    color: updatedEventData.event.color ?? event.color,
                    description:
                      updatedEventData.event.description ?? event.description,
                    end: updatedEventData.event.end ?? event.end,
                    location: updatedEventData.event.location ?? event.location,
                    start: updatedEventData.event.start ?? event.start,
                    title: updatedEventData.event.title ?? event.title,
                  } as ProcessedEventType)
                : event,
            ) as GetEventsQueryOutput,
        );
        return { previousEvents, queryKey };
      },
      onSettled: (
        data,
        error,
        variables,
        context: UpdateEventMutationContext | undefined,
      ) => {
        if (context?.queryKey) {
          utils.calendar.getEvents.invalidate(context.queryKey);
        } else {
          utils.calendar.getEvents.invalidate();
        }
        utils.calendar.getFreeSlots.invalidate();
      },
      onSuccess: (
        data,
        variables,
        context: UpdateEventMutationContext | undefined,
      ) => {
        if (context?.queryKey) {
          utils.calendar.getEvents.setData(
            context.queryKey,
            (oldEvents) =>
              oldEvents?.map((event) =>
                event.id === variables.eventId ? data : event,
              ) as GetEventsQueryOutput,
          );
        }
      },
    });

  const { isPending: isDeletingEvent, mutate: deleteEvent } =
    api.calendar.deleteEvent.useMutation({
      onError: (
        err,
        deletedEventData,
        context: DeleteEventMutationContext | undefined,
      ) => {
        if (context?.previousEvents && context?.queryKey) {
          utils.calendar.getEvents.setData(
            context.queryKey,
            context.previousEvents,
          );
        }
        console.error(
          "Error deleting event, rolled back optimistic update:",
          err,
        );
      },
      onMutate: async (
        deletedEventData: RouterInputs["calendar"]["deleteEvent"],
      ): Promise<DeleteEventMutationContext> => {
        // Use the current timeMin and timeMax for this operation
        const queryKey = { timeMax, timeMin };

        await utils.calendar.getEvents.cancel(queryKey);
        const previousEvents = utils.calendar.getEvents.getData(queryKey);

        utils.calendar.getEvents.setData(
          queryKey,
          (oldEvents) =>
            oldEvents?.filter(
              (event) => event.id !== deletedEventData.eventId,
            ) as GetEventsQueryOutput,
        );
        return {
          deletedEventId: deletedEventData.eventId,
          previousEvents,
          queryKey,
        };
      },
      onSettled: (
        data,
        error,
        variables,
        context: DeleteEventMutationContext | undefined,
      ) => {
        if (context?.queryKey) {
          utils.calendar.getEvents.invalidate(context.queryKey);
        } else {
          utils.calendar.getEvents.invalidate();
        }
        utils.calendar.getFreeSlots.invalidate();
      },
    });

  const { mutate: updateAttendeeResponse } =
    api.calendar.updateAttendeeResponse.useMutation({
      onError: (err) => {
        console.error("Error updating attendee response:", err);
      },
      onSettled: () => {
        utils.calendar.getEvents.invalidate({ timeMax, timeMin });
      },
      onSuccess: (data) => {
        const queryKey = { timeMax, timeMin };
        utils.calendar.getEvents.setData(
          queryKey,
          (oldEvents) =>
            oldEvents?.map((event) =>
              event.id === data.id ? data : event,
            ) as GetEventsQueryOutput,
        );
      },
    });

  const handleEventAdd = (event: CalendarEvent) => {
    if (!event.title || !event.start || !event.end) {
      console.error("Event title, start, and end are required.");
      return;
    }

    const startDate =
      typeof event.start === "string" ? new Date(event.start) : event.start;
    const endDate =
      typeof event.end === "string" ? new Date(event.end) : event.end;

    createEvent({
      calendarId: event.calendarId ?? "primary",
      event: {
        allDay: event.allDay,
        color: event.color,
        description: event.description,
        end: endDate,
        location: event.location,
        start: startDate,
        title: String(event.title),
      },
    });
  };

  const handleEventUpdate = (updatedEvent: CalendarEvent) => {
    if (!updatedEvent.id) {
      console.error("Event ID is required for updates.");
      return;
    }
    const startDate = updatedEvent.start
      ? typeof updatedEvent.start === "string"
        ? new Date(updatedEvent.start)
        : updatedEvent.start
      : undefined;
    const endDate = updatedEvent.end
      ? typeof updatedEvent.end === "string"
        ? new Date(updatedEvent.end)
        : updatedEvent.end
      : undefined;

    updateEvent({
      calendarId: updatedEvent.calendarId ?? "primary",
      event: {
        allDay: updatedEvent.allDay,
        color: updatedEvent.color,
        description: updatedEvent.description,
        end: endDate,
        location: updatedEvent.location,
        start: startDate,
        title: updatedEvent.title ? String(updatedEvent.title) : undefined,
      },
      eventId: updatedEvent.id,
    });
  };

  const handleEventDelete = (eventId: string) => {
    deleteEvent({
      calendarId: "primary",
      eventId,
    });
  };

  const handleAttendeeResponse = (
    eventId: string,
    response: "accepted" | "declined" | "tentative",
  ) => {
    const event = visibleEvents?.find((e) => e.id === eventId);
    const calendarId = event?.calendarId || "primary";

    updateAttendeeResponse({
      calendarId,
      eventId,
      responseStatus: response,
    });
  };

  return (
    <EventCalendar
      onEventAdd={handleEventAdd}
      onEventDelete={handleEventDelete}
      onEventUpdate={handleEventUpdate}
      onResponseUpdate={handleAttendeeResponse}
      events={visibleEvents}
      isCreatingEvent={isCreatingEvent}
      isDeletingEvent={isDeletingEvent}
      isUpdatingEvent={isUpdatingEvent}
    />
  );
}
