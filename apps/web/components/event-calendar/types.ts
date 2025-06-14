export interface CalendarEvent {
  id: string;
  end: Date;
  start: Date;
  title: string;
  allDay?: boolean;
  calendarId?: string;
  color?: EventColor | string;
  description?: string;
  label?: string;
  location?: string;
  recurrence?: RecurrenceType;
}

export type CalendarView = "agenda" | "day" | "month" | "week";

export type EventColor =
  | "blue"
  | "cyan"
  | "emerald"
  | "gray"
  | "green"
  | "indigo"
  | "orange"
  | "red"
  | "rose"
  | "violet"
  | "yellow";

export type RecurrenceType = "daily" | "monthly" | "none" | "weekly" | "yearly";
