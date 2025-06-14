export interface CalendarEvent {
  id: string;
  end: Date;
  start: Date;
  title: string;
  allDay?: boolean;
  attendees?: Array<{
    id?: string;
    additionalGuests?: number;
    comment?: string;
    displayName?: string;
    email?: string;
    optional?: boolean;
    organizer?: boolean;
    resource?: boolean;
    responseStatus?: "accepted" | "declined" | "needsAction" | "tentative";
    self?: boolean;
  }>;
  calendarId?: string;
  color?: EventColor | string;
  creator?: {
    id?: string;
    displayName?: string;
    email?: string;
    self?: boolean;
  };
  description?: string;
  label?: string;
  location?: string;
  organizer?: {
    id?: string;
    displayName?: string;
    email?: string;
    self?: boolean;
  };
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

export interface EventPermissions {
  canDelete: boolean;
  canEdit: boolean;
  canInvite: boolean;
  canModify: boolean;
  canSeeGuests: boolean;
  userRole: UserEventRole;
}

export type RecurrenceType = "daily" | "monthly" | "none" | "weekly" | "yearly";
export type UserEventRole = "attendee" | "none" | "organizer";
