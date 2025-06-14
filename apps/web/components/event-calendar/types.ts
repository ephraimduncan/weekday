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
  // Google Calendar permission fields
  organizer?: {
    id?: string;
    displayName?: string;
    email?: string;
    self?: boolean;
  };
  creator?: {
    id?: string;
    displayName?: string;
    email?: string;
    self?: boolean;
  };
  attendees?: Array<{
    id?: string;
    displayName?: string;
    email?: string;
    organizer?: boolean;
    self?: boolean;
    resource?: boolean;
    optional?: boolean;
    responseStatus?: "needsAction" | "declined" | "tentative" | "accepted";
    comment?: string;
    additionalGuests?: number;
  }>;
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

// Permission-related types
export type UserEventRole = "organizer" | "attendee" | "none";

export interface EventPermissions {
  canEdit: boolean;
  canDelete: boolean;
  canInvite: boolean;
  canSeeGuests: boolean;
  canModify: boolean;
  userRole: UserEventRole;
}
