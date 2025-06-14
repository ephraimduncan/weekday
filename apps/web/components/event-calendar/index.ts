"use client";

// Type exports
export type {
  CalendarEvent,
  CalendarView,
  EventColor,
  RecurrenceType,
} from "./types";
// Component exports
export { CalendarDndProvider, useCalendarDnd } from "./calendar-dnd-context";
// Constants and utility exports
export * from "./constants";
export { DraggableEvent } from "./draggable-event";
export { DroppableCell } from "./droppable-cell";
export { EventCalendar } from "./event-calendar";
export { EventDialog } from "./event-dialog";
export { EventItem } from "./event-item";
export { EventsPopup } from "./events-popup";
// Hook exports
export * from "./hooks"; // This should now cover use-current-time-indicator and use-dynamic-week-cell-height

export * from "./hooks/use-event-visibility"; // This one seems to be separate

export * from "./utils";
// View exports
export { AgendaView } from "./views/agenda-view";
export { DayView } from "./views/day-view";
export { MonthView } from "./views/month-view";
export { WeekView } from "./views/week-view";
