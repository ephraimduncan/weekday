import type {
  CalendarEvent,
  EventColor,
  EventPermissions,
  UserEventRole,
} from "./types";

import { isSameDay } from "date-fns";
import { match } from "ts-pattern";

export function getEventColorClasses(color?: EventColor | string): string {
  const colorName = color || "blue";

  return match(colorName)
    .with(
      "blue",
      () =>
        "bg-blue-200/50 hover:bg-blue-200/40 text-blue-900/90 dark:bg-blue-400/25 dark:hover:bg-blue-400/20 dark:text-blue-200 shadow-blue-700/80",
    )
    .with(
      "cyan",
      () =>
        "bg-cyan-200/50 hover:bg-cyan-200/40 text-cyan-900/90 dark:bg-cyan-400/25 dark:hover:bg-cyan-400/20 dark:text-cyan-200 shadow-cyan-700/80",
    )
    .with(
      "emerald",
      () =>
        "bg-emerald-200/50 hover:bg-emerald-200/40 text-emerald-900/90 dark:bg-emerald-400/25 dark:hover:bg-emerald-400/20 dark:text-emerald-200 shadow-emerald-700/80",
    )
    .with(
      "gray",
      () =>
        "bg-gray-200/50 hover:bg-gray-200/40 text-gray-900/90 dark:bg-gray-400/25 dark:hover:bg-gray-400/20 dark:text-gray-200 shadow-gray-700/80",
    )
    .with(
      "green",
      () =>
        "bg-green-200/50 hover:bg-green-200/40 text-green-900/90 dark:bg-green-400/25 dark:hover:bg-green-400/20 dark:text-green-200 shadow-green-700/80",
    )
    .with(
      "indigo",
      () =>
        "bg-indigo-200/50 hover:bg-indigo-200/40 text-indigo-900/90 dark:bg-indigo-400/25 dark:hover:bg-indigo-400/20 dark:text-indigo-200 shadow-indigo-700/80",
    )
    .with(
      "orange",
      () =>
        "bg-orange-200/50 hover:bg-orange-200/40 text-orange-900/90 dark:bg-orange-400/25 dark:hover:bg-orange-400/20 dark:text-orange-200 shadow-orange-700/80",
    )
    .with(
      "red",
      () =>
        "bg-red-200/50 hover:bg-red-200/40 text-red-900/90 dark:bg-red-400/25 dark:hover:bg-red-400/20 dark:text-red-200 shadow-red-700/80",
    )
    .with(
      "rose",
      () =>
        "bg-rose-200/50 hover:bg-rose-200/40 text-rose-900/90 dark:bg-rose-400/25 dark:hover:bg-rose-400/20 dark:text-rose-200 shadow-rose-700/80",
    )
    .with(
      "violet",
      () =>
        "bg-violet-200/50 hover:bg-violet-200/40 text-violet-900/90 dark:bg-violet-400/25 dark:hover:bg-violet-400/20 dark:text-violet-200 shadow-violet-700/80",
    )
    .with(
      "yellow",
      () =>
        "bg-yellow-200/50 hover:bg-yellow-200/40 text-yellow-900/90 dark:bg-yellow-400/25 dark:hover:bg-yellow-400/20 dark:text-yellow-200 shadow-yellow-700/80",
    )
    .otherwise(
      () =>
        "bg-blue-200/50 hover:bg-blue-200/40 text-blue-900/90 dark:bg-blue-400/25 dark:hover:bg-blue-400/20 dark:text-blue-200 shadow-blue-700/80",
    );

  // return [
  //   `bg-${colorName}-200/50 hover:bg-${colorName}-200/40`,
  //   `text-${colorName}-900/90`,
  //   `dark:bg-${colorName}-400/25 dark:hover:bg-${colorName}-400/20`,
  //   `dark:text-${colorName}-200`,
  //   `shadow-${colorName}-700/80`,
  // ].join(" ");
}

export function getBorderRadiusClasses(
  isFirstDay: boolean,
  isLastDay: boolean,
): string {
  return match([isFirstDay, isLastDay])
    .with([true, true], () => "rounded")
    .with(
      [true, false],
      () =>
        "rounded-l rounded-r-none not-in-data-[slot=popover-content]:w-[calc(100%+5px)]",
    )
    .with(
      [false, true],
      () =>
        "rounded-r rounded-l-none not-in-data-[slot=popover-content]:w-[calc(100%+4px)] not-in-data-[slot=popover-content]:-translate-x-[4px]",
    )
    .otherwise(
      () =>
        "rounded-none not-in-data-[slot=popover-content]:w-[calc(100%+9px)] not-in-data-[slot=popover-content]:-translate-x-[4px]",
    );
}

export function isMultiDayEvent(event: CalendarEvent): boolean {
  const eventStart = new Date(event.start);
  const eventEnd = new Date(event.end);
  return event.allDay || eventStart.getDate() !== eventEnd.getDate();
}

export function getEventsForDay(
  events: CalendarEvent[],
  day: Date,
): CalendarEvent[] {
  return events
    .filter((event) => {
      const eventStart = new Date(event.start);
      return isSameDay(day, eventStart);
    })
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
}

export function sortEvents(events: CalendarEvent[]): CalendarEvent[] {
  return [...events].sort((a, b) => {
    const aIsMultiDay = isMultiDayEvent(a);
    const bIsMultiDay = isMultiDayEvent(b);

    if (aIsMultiDay && !bIsMultiDay) return -1;
    if (!aIsMultiDay && bIsMultiDay) return 1;

    return new Date(a.start).getTime() - new Date(b.start).getTime();
  });
}

export function getSpanningEventsForDay(
  events: CalendarEvent[],
  day: Date,
): CalendarEvent[] {
  return events.filter((event) => {
    if (!isMultiDayEvent(event)) return false;

    const eventStart = new Date(event.start);
    const eventEnd = new Date(event.end);

    return (
      !isSameDay(day, eventStart) &&
      (isSameDay(day, eventEnd) || (day > eventStart && day < eventEnd))
    );
  });
}

export function getAllEventsForDay(
  events: CalendarEvent[],
  day: Date,
): CalendarEvent[] {
  return events.filter((event) => {
    const eventStart = new Date(event.start);
    const eventEnd = new Date(event.end);
    return (
      isSameDay(day, eventStart) ||
      isSameDay(day, eventEnd) ||
      (day > eventStart && day < eventEnd)
    );
  });
}

export function getAgendaEventsForDay(
  events: CalendarEvent[],
  day: Date,
): CalendarEvent[] {
  return events
    .filter((event) => {
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);
      return (
        isSameDay(day, eventStart) ||
        isSameDay(day, eventEnd) ||
        (day > eventStart && day < eventEnd)
      );
    })
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
}

export function addHoursToDate(date: Date, hours: number): Date {
  const result = new Date(date);
  result.setHours(result.getHours() + hours);
  return result;
}

/**
 * Determines the user's role for a given event based on Google Calendar API data
 */
export function getUserEventRole(event: CalendarEvent): UserEventRole {
  // Check if user is the organizer
  if (event.organizer?.self === true) {
    return "organizer";
  }

  // Check if user is the creator
  if (event.creator?.self === true) {
    return "organizer";
  }

  // Check if user is in the attendees list
  if (event.attendees && Array.isArray(event.attendees)) {
    const userAttendee = event.attendees.find(attendee => attendee.self === true);
    if (userAttendee) {
      return "attendee";
    }
  }

  return "none";
}

/**
 * Determines event permissions based on user role and event data
 */
export function getEventPermissions(event: CalendarEvent): EventPermissions {
  const userRole = getUserEventRole(event);

  switch (userRole) {
    case "organizer":
      return {
        canEdit: true,
        canDelete: true,
        canInvite: true,
        canSeeGuests: true,
        canModify: true,
        userRole,
      };

    case "attendee":
      return {
        canEdit: false, // Attendees can only respond, not edit event details
        canDelete: false,
        canInvite: false,
        canSeeGuests: true, // Assuming guests can see other guests by default
        canModify: false,
        userRole,
      };

    case "none":
    default:
      return {
        canEdit: false,
        canDelete: false,
        canInvite: false,
        canSeeGuests: false,
        canModify: false,
        userRole: "none",
      };
  }
}

/**
 * Validates if the user has permission to perform a specific action on an event
 */
export function validateEventPermission(
  event: CalendarEvent,
  action: "edit" | "delete" | "invite" | "modify"
): boolean {
  const permissions = getEventPermissions(event);

  switch (action) {
    case "edit":
      return permissions.canEdit;
    case "delete":
      return permissions.canDelete;
    case "invite":
      return permissions.canInvite;
    case "modify":
      return permissions.canModify;
    default:
      return false;
  }
}

/**
 * Gets the user's current response status for an event (if they're an attendee)
 */
export function getUserResponseStatus(event: CalendarEvent): string | null {
  if (!event.attendees || !Array.isArray(event.attendees)) {
    return null;
  }

  const userAttendee = event.attendees.find(attendee => attendee.self === true);
  return userAttendee?.responseStatus || null;
}

/**
 * Checks if the current user can respond to an event invitation
 */
export function canRespondToEvent(event: CalendarEvent): boolean {
  const userRole = getUserEventRole(event);
  return userRole === "attendee";
}
