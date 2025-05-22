// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIPromise } from "../../core/api-promise";
import { APIResource } from "../../core/resource";
import { buildHeaders } from "../../internal/headers";
import { type RequestOptions } from "../../internal/request-options";
import { path } from "../../internal/utils/path";
import * as ACLAPI from "./acl";

export class Events extends APIResource {
  /**
   * Creates an event.
   */
  create(
    calendarID: string,
    params: EventCreateParams,
    options?: RequestOptions
  ): APIPromise<Event> {
    const {
      conferenceDataVersion,
      maxAttendees,
      sendNotifications,
      sendUpdates,
      supportsAttachments,
      ...body
    } = params;
    return this._client.post(path`/calendars/${calendarID}/events`, {
      query: {
        conferenceDataVersion,
        maxAttendees,
        sendNotifications,
        sendUpdates,
        supportsAttachments,
      },
      body,
      ...options,
    });
  }

  /**
   * Returns an event based on its Google Calendar ID. To retrieve an event using its
   * iCalendar ID, call the events.list method using the iCalUID parameter.
   */
  retrieve(
    eventID: string,
    params: EventRetrieveParams,
    options?: RequestOptions
  ): APIPromise<Event> {
    const { calendarId, ...query } = params;
    return this._client.get(path`/calendars/${calendarId}/events/${eventID}`, {
      query,
      ...options,
    });
  }

  /**
   * Updates an event.
   */
  update(
    eventID: string,
    params: EventUpdateParams,
    options?: RequestOptions
  ): APIPromise<Event> {
    const {
      calendarId,
      alwaysIncludeEmail,
      conferenceDataVersion,
      maxAttendees,
      sendNotifications,
      sendUpdates,
      supportsAttachments,
      ...body
    } = params;
    return this._client.put(path`/calendars/${calendarId}/events/${eventID}`, {
      query: {
        alwaysIncludeEmail,
        conferenceDataVersion,
        maxAttendees,
        sendNotifications,
        sendUpdates,
        supportsAttachments,
      },
      body,
      ...options,
    });
  }

  /**
   * Returns events on the specified calendar.
   */
  list(
    calendarID: string,
    query: EventListParams | null | undefined = {},
    options?: RequestOptions
  ): APIPromise<Events> {
    return this._client.get(path`/calendars/${calendarID}/events`, {
      query,
      ...options,
    });
  }

  /**
   * Deletes an event.
   */
  delete(
    eventID: string,
    params: EventDeleteParams,
    options?: RequestOptions
  ): APIPromise<void> {
    const { calendarId, sendNotifications, sendUpdates } = params;
    return this._client.delete(
      path`/calendars/${calendarId}/events/${eventID}`,
      {
        query: { sendNotifications, sendUpdates },
        ...options,
        headers: buildHeaders([{ Accept: "*/*" }, options?.headers]),
      }
    );
  }

  /**
   * Imports an event. This operation is used to add a private copy of an existing
   * event to a calendar. Only events with an eventType of default may be imported.
   * Deprecated behavior: If a non-default event is imported, its type will be
   * changed to default and any event-type-specific properties it may have will be
   * dropped.
   */
  import(
    calendarID: string,
    params: EventImportParams,
    options?: RequestOptions
  ): APIPromise<Event> {
    const { conferenceDataVersion, supportsAttachments, ...body } = params;
    return this._client.post(path`/calendars/${calendarID}/events/import`, {
      query: { conferenceDataVersion, supportsAttachments },
      body,
      ...options,
    });
  }

  /**
   * Returns instances of the specified recurring event.
   */
  listInstances(
    eventID: string,
    params: EventListInstancesParams,
    options?: RequestOptions
  ): APIPromise<Events> {
    const { calendarId, ...query } = params;
    return this._client.get(
      path`/calendars/${calendarId}/events/${eventID}/instances`,
      {
        query,
        ...options,
      }
    );
  }

  /**
   * Moves an event to another calendar, i.e. changes an event's organizer. Note that
   * only default events can be moved; birthday, focusTime, fromGmail, outOfOffice
   * and workingLocation events cannot be moved.
   */
  move(
    eventID: string,
    params: EventMoveParams,
    options?: RequestOptions
  ): APIPromise<Event> {
    const { calendarId, destination, sendNotifications, sendUpdates } = params;
    return this._client.post(
      path`/calendars/${calendarId}/events/${eventID}/move`,
      {
        query: { destination, sendNotifications, sendUpdates },
        ...options,
      }
    );
  }

  /**
   * Creates an event based on a simple text string.
   */
  quickAdd(
    calendarID: string,
    params: EventQuickAddParams,
    options?: RequestOptions
  ): APIPromise<Event> {
    const { text, sendNotifications, sendUpdates } = params;
    return this._client.post(path`/calendars/${calendarID}/events/quickAdd`, {
      query: { text, sendNotifications, sendUpdates },
      ...options,
    });
  }

  /**
   * Updates an event. This method supports patch semantics.
   */
  updatePartial(
    eventID: string,
    params: EventUpdatePartialParams,
    options?: RequestOptions
  ): APIPromise<Event> {
    const {
      calendarId,
      alwaysIncludeEmail,
      conferenceDataVersion,
      maxAttendees,
      sendNotifications,
      sendUpdates,
      supportsAttachments,
      ...body
    } = params;
    return this._client.patch(
      path`/calendars/${calendarId}/events/${eventID}`,
      {
        query: {
          alwaysIncludeEmail,
          conferenceDataVersion,
          maxAttendees,
          sendNotifications,
          sendUpdates,
          supportsAttachments,
        },
        body,
        ...options,
      }
    );
  }

  /**
   * Watch for changes to Events resources.
   */
  watch(
    calendarID: string,
    params: EventWatchParams,
    options?: RequestOptions
  ): APIPromise<ACLAPI.Channel> {
    const {
      alwaysIncludeEmail,
      eventTypes,
      iCalUID,
      maxAttendees,
      maxResults,
      orderBy,
      pageToken,
      privateExtendedProperty,
      q,
      sharedExtendedProperty,
      showDeleted,
      showHiddenInvitations,
      singleEvents,
      syncToken,
      timeMax,
      timeMin,
      timeZone,
      updatedMin,
      ...body
    } = params;
    return this._client.post(path`/calendars/${calendarID}/events/watch`, {
      query: {
        alwaysIncludeEmail,
        eventTypes,
        iCalUID,
        maxAttendees,
        maxResults,
        orderBy,
        pageToken,
        privateExtendedProperty,
        q,
        sharedExtendedProperty,
        showDeleted,
        showHiddenInvitations,
        singleEvents,
        syncToken,
        timeMax,
        timeMin,
        timeZone,
        updatedMin,
      },
      body,
      ...options,
    });
  }
}

export interface Event {
  /**
   * Opaque identifier of the event. When creating new single or recurring events,
   * you can specify their IDs. Provided IDs must follow these rules:
   *
   * - characters allowed in the ID are those used in base32hex encoding, i.e.
   *   lowercase letters a-v and digits 0-9, see section 3.1.2 in RFC2938
   * - the length of the ID must be between 5 and 1024 characters
   * - the ID must be unique per calendar Due to the globally distributed nature of
   *   the system, we cannot guarantee that ID collisions will be detected at event
   *   creation time. To minimize the risk of collisions we recommend using an
   *   established UUID algorithm such as one described in RFC4122. If you do not
   *   specify an ID, it will be automatically generated by the server. Note that the
   *   icalUID and the id are not identical and only one of them should be supplied
   *   at event creation time. One difference in their semantics is that in recurring
   *   events, all occurrences of one event have different ids while they all share
   *   the same icalUIDs.
   */
  id?: string;

  /**
   * Whether anyone can invite themselves to the event (deprecated). Optional. The
   * default is False.
   */
  anyoneCanAddSelf?: boolean;

  /**
   * File attachments for the event. In order to modify attachments the
   * supportsAttachments request parameter should be set to true. There can be at
   * most 25 attachments per event,
   */
  attachments?: Array<unknown>;

  /**
   * The attendees of the event. See the Events with attendees guide for more
   * information on scheduling events with other calendar users. Service accounts
   * need to use domain-wide delegation of authority to populate the attendee list.
   */
  attendees?: Array<unknown>;

  /**
   * Whether attendees may have been omitted from the event's representation. When
   * retrieving an event, this may be due to a restriction specified by the
   * maxAttendee query parameter. When updating an event, this can be used to only
   * update the participant's response. Optional. The default is False.
   */
  attendeesOmitted?: boolean;

  /**
   * Birthday or special event data. Used if eventType is "birthday". Immutable.
   */
  birthdayProperties?: unknown;

  /**
   * The color of the event. This is an ID referring to an entry in the event section
   * of the colors definition (see the colors endpoint). Optional.
   */
  colorId?: string;

  /**
   * The conference-related information, such as details of a Google Meet conference.
   * To create new conference details use the createRequest field. To persist your
   * changes, remember to set the conferenceDataVersion request parameter to 1 for
   * all event modification requests.
   */
  conferenceData?: unknown;

  /**
   * Creation time of the event (as a RFC3339 timestamp). Read-only.
   */
  created?: string;

  /**
   * The creator of the event. Read-only.
   */
  creator?: Event.Creator;

  /**
   * Description of the event. Can contain HTML. Optional.
   */
  description?: string;

  /**
   * The (exclusive) end time of the event. For a recurring event, this is the end
   * time of the first instance.
   */
  end?: unknown;

  /**
   * Whether the end time is actually unspecified. An end time is still provided for
   * compatibility reasons, even if this attribute is set to True. The default is
   * False.
   */
  endTimeUnspecified?: boolean;

  /**
   * ETag of the resource.
   */
  etag?: string;

  /**
   * Specific type of the event. This cannot be modified after the event is created.
   * Possible values are:
   *
   * - "birthday" - A special all-day event with an annual recurrence.
   * - "default" - A regular event or not further specified.
   * - "focusTime" - A focus-time event.
   * - "fromGmail" - An event from Gmail. This type of event cannot be created.
   * - "outOfOffice" - An out-of-office event.
   * - "workingLocation" - A working location event.
   */
  eventType?: string;

  /**
   * Extended properties of the event.
   */
  extendedProperties?: Event.ExtendedProperties;

  /**
   * Focus Time event data. Used if eventType is focusTime.
   */
  focusTimeProperties?: unknown;

  /**
   * A gadget that extends this event. Gadgets are deprecated; this structure is
   * instead only used for returning birthday calendar metadata.
   */
  gadget?: Event.Gadget;

  /**
   * Whether attendees other than the organizer can invite others to the event.
   * Optional. The default is True.
   */
  guestsCanInviteOthers?: boolean;

  /**
   * Whether attendees other than the organizer can modify the event. Optional. The
   * default is False.
   */
  guestsCanModify?: boolean;

  /**
   * Whether attendees other than the organizer can see who the event's attendees
   * are. Optional. The default is True.
   */
  guestsCanSeeOtherGuests?: boolean;

  /**
   * An absolute link to the Google Hangout associated with this event. Read-only.
   */
  hangoutLink?: string;

  /**
   * An absolute link to this event in the Google Calendar Web UI. Read-only.
   */
  htmlLink?: string;

  /**
   * Event unique identifier as defined in RFC5545. It is used to uniquely identify
   * events accross calendaring systems and must be supplied when importing events
   * via the import method. Note that the iCalUID and the id are not identical and
   * only one of them should be supplied at event creation time. One difference in
   * their semantics is that in recurring events, all occurrences of one event have
   * different ids while they all share the same iCalUIDs. To retrieve an event using
   * its iCalUID, call the events.list method using the iCalUID parameter. To
   * retrieve an event using its id, call the events.get method.
   */
  iCalUID?: string;

  /**
   * Type of the resource ("calendar#event").
   */
  kind?: string;

  /**
   * Geographic location of the event as free-form text. Optional.
   */
  location?: string;

  /**
   * Whether this is a locked event copy where no changes can be made to the main
   * event fields "summary", "description", "location", "start", "end" or
   * "recurrence". The default is False. Read-Only.
   */
  locked?: boolean;

  /**
   * The organizer of the event. If the organizer is also an attendee, this is
   * indicated with a separate entry in attendees with the organizer field set to
   * True. To change the organizer, use the move operation. Read-only, except when
   * importing an event.
   */
  organizer?: Event.Organizer;

  /**
   * For an instance of a recurring event, this is the time at which this event would
   * start according to the recurrence data in the recurring event identified by
   * recurringEventId. It uniquely identifies the instance within the recurring event
   * series even if the instance was moved to a different time. Immutable.
   */
  originalStartTime?: unknown;

  /**
   * Out of office event data. Used if eventType is outOfOffice.
   */
  outOfOfficeProperties?: unknown;

  /**
   * If set to True, Event propagation is disabled. Note that it is not the same
   * thing as Private event properties. Optional. Immutable. The default is False.
   */
  privateCopy?: boolean;

  /**
   * List of RRULE, EXRULE, RDATE and EXDATE lines for a recurring event, as
   * specified in RFC5545. Note that DTSTART and DTEND lines are not allowed in this
   * field; event start and end times are specified in the start and end fields. This
   * field is omitted for single events or instances of recurring events.
   */
  recurrence?: Array<string>;

  /**
   * For an instance of a recurring event, this is the id of the recurring event to
   * which this instance belongs. Immutable.
   */
  recurringEventId?: string;

  /**
   * Information about the event's reminders for the authenticated user. Note that
   * changing reminders does not also change the updated property of the enclosing
   * event.
   */
  reminders?: Event.Reminders;

  /**
   * Sequence number as per iCalendar.
   */
  sequence?: number;

  /**
   * Source from which the event was created. For example, a web page, an email
   * message or any document identifiable by an URL with HTTP or HTTPS scheme. Can
   * only be seen or modified by the creator of the event.
   */
  source?: Event.Source;

  /**
   * The (inclusive) start time of the event. For a recurring event, this is the
   * start time of the first instance.
   */
  start?: unknown;

  /**
   * Status of the event. Optional. Possible values are:
   *
   * - "confirmed" - The event is confirmed. This is the default status.
   * - "tentative" - The event is tentatively confirmed.
   * - "cancelled" - The event is cancelled (deleted). The list method returns
   *   cancelled events only on incremental sync (when syncToken or updatedMin are
   *   specified) or if the showDeleted flag is set to true. The get method always
   *   returns them. A cancelled status represents two different states depending on
   *   the event type:
   * - Cancelled exceptions of an uncancelled recurring event indicate that this
   *   instance should no longer be presented to the user. Clients should store these
   *   events for the lifetime of the parent recurring event. Cancelled exceptions
   *   are only guaranteed to have values for the id, recurringEventId and
   *   originalStartTime fields populated. The other fields might be empty.
   * - All other cancelled events represent deleted events. Clients should remove
   *   their locally synced copies. Such cancelled events will eventually disappear,
   *   so do not rely on them being available indefinitely. Deleted events are only
   *   guaranteed to have the id field populated. On the organizer's calendar,
   *   cancelled events continue to expose event details (summary, location, etc.) so
   *   that they can be restored (undeleted). Similarly, the events to which the user
   *   was invited and that they manually removed continue to provide details.
   *   However, incremental sync requests with showDeleted set to false will not
   *   return these details. If an event changes its organizer (for example via the
   *   move operation) and the original organizer is not on the attendee list, it
   *   will leave behind a cancelled event where only the id field is guaranteed to
   *   be populated.
   */
  status?: string;

  /**
   * Title of the event.
   */
  summary?: string;

  /**
   * Whether the event blocks time on the calendar. Optional. Possible values are:
   *
   * - "opaque" - Default value. The event does block time on the calendar. This is
   *   equivalent to setting Show me as to Busy in the Calendar UI.
   * - "transparent" - The event does not block time on the calendar. This is
   *   equivalent to setting Show me as to Available in the Calendar UI.
   */
  transparency?: string;

  /**
   * Last modification time of the main event data (as a RFC3339 timestamp). Updating
   * event reminders will not cause this to change. Read-only.
   */
  updated?: string;

  /**
   * Visibility of the event. Optional. Possible values are:
   *
   * - "default" - Uses the default visibility for events on the calendar. This is
   *   the default value.
   * - "public" - The event is public and event details are visible to all readers of
   *   the calendar.
   * - "private" - The event is private and only event attendees may view event
   *   details.
   * - "confidential" - The event is private. This value is provided for
   *   compatibility reasons.
   */
  visibility?: string;

  /**
   * Working location event data.
   */
  workingLocationProperties?: unknown;
}

export namespace Event {
  /**
   * The creator of the event. Read-only.
   */
  export interface Creator {
    /**
     * The creator's Profile ID, if available.
     */
    id?: string;

    /**
     * The creator's name, if available.
     */
    displayName?: string;

    /**
     * The creator's email address, if available.
     */
    email?: string;

    /**
     * Whether the creator corresponds to the calendar on which this copy of the event
     * appears. Read-only. The default is False.
     */
    self?: boolean;
  }

  /**
   * Extended properties of the event.
   */
  export interface ExtendedProperties {
    /**
     * Properties that are private to the copy of the event that appears on this
     * calendar.
     */
    private?: unknown;

    /**
     * Properties that are shared between copies of the event on other attendees'
     * calendars.
     */
    shared?: unknown;
  }

  /**
   * A gadget that extends this event. Gadgets are deprecated; this structure is
   * instead only used for returning birthday calendar metadata.
   */
  export interface Gadget {
    /**
     * The gadget's display mode. Deprecated. Possible values are:
     *
     * - "icon" - The gadget displays next to the event's title in the calendar view.
     * - "chip" - The gadget displays when the event is clicked.
     */
    display?: string;

    /**
     * The gadget's height in pixels. The height must be an integer greater than 0.
     * Optional. Deprecated.
     */
    height?: number;

    /**
     * The gadget's icon URL. The URL scheme must be HTTPS. Deprecated.
     */
    iconLink?: string;

    /**
     * The gadget's URL. The URL scheme must be HTTPS. Deprecated.
     */
    link?: string;

    /**
     * Preferences.
     */
    preferences?: unknown;

    /**
     * The gadget's title. Deprecated.
     */
    title?: string;

    /**
     * The gadget's type. Deprecated.
     */
    type?: string;

    /**
     * The gadget's width in pixels. The width must be an integer greater than 0.
     * Optional. Deprecated.
     */
    width?: number;
  }

  /**
   * The organizer of the event. If the organizer is also an attendee, this is
   * indicated with a separate entry in attendees with the organizer field set to
   * True. To change the organizer, use the move operation. Read-only, except when
   * importing an event.
   */
  export interface Organizer {
    /**
     * The organizer's Profile ID, if available.
     */
    id?: string;

    /**
     * The organizer's name, if available.
     */
    displayName?: string;

    /**
     * The organizer's email address, if available. It must be a valid email address as
     * per RFC5322.
     */
    email?: string;

    /**
     * Whether the organizer corresponds to the calendar on which this copy of the
     * event appears. Read-only. The default is False.
     */
    self?: boolean;
  }

  /**
   * Information about the event's reminders for the authenticated user. Note that
   * changing reminders does not also change the updated property of the enclosing
   * event.
   */
  export interface Reminders {
    /**
     * If the event doesn't use the default reminders, this lists the reminders
     * specific to the event, or, if not set, indicates that no reminders are set for
     * this event. The maximum number of override reminders is 5.
     */
    overrides?: Array<unknown>;

    /**
     * Whether the default reminders of the calendar apply to the event.
     */
    useDefault?: boolean;
  }

  /**
   * Source from which the event was created. For example, a web page, an email
   * message or any document identifiable by an URL with HTTP or HTTPS scheme. Can
   * only be seen or modified by the creator of the event.
   */
  export interface Source {
    /**
     * Title of the source; for example a title of a web page or an email subject.
     */
    title?: string;

    /**
     * URL of the source pointing to a resource. The URL scheme must be HTTP or HTTPS.
     */
    url?: string;
  }
}

export interface Events {
  /**
   * The user's access role for this calendar. Read-only. Possible values are:
   *
   * - "none" - The user has no access.
   * - "freeBusyReader" - The user has read access to free/busy information.
   * - "reader" - The user has read access to the calendar. Private events will
   *   appear to users with reader access, but event details will be hidden.
   * - "writer" - The user has read and write access to the calendar. Private events
   *   will appear to users with writer access, and event details will be visible.
   * - "owner" - The user has ownership of the calendar. This role has all of the
   *   permissions of the writer role with the additional ability to see and
   *   manipulate ACLs.
   */
  accessRole?: string;

  /**
   * The default reminders on the calendar for the authenticated user. These
   * reminders apply to all events on this calendar that do not explicitly override
   * them (i.e. do not have reminders.useDefault set to True).
   */
  defaultReminders?: Array<unknown>;

  /**
   * Description of the calendar. Read-only.
   */
  description?: string;

  /**
   * ETag of the collection.
   */
  etag?: string;

  /**
   * List of events on the calendar.
   */
  items?: Array<unknown>;

  /**
   * Type of the collection ("calendar#events").
   */
  kind?: string;

  /**
   * Token used to access the next page of this result. Omitted if no further results
   * are available, in which case nextSyncToken is provided.
   */
  nextPageToken?: string;

  /**
   * Token used at a later point in time to retrieve only the entries that have
   * changed since this result was returned. Omitted if further results are
   * available, in which case nextPageToken is provided.
   */
  nextSyncToken?: string;

  /**
   * Title of the calendar. Read-only.
   */
  summary?: string;

  /**
   * The time zone of the calendar. Read-only.
   */
  timeZone?: string;

  /**
   * Last modification time of the calendar (as a RFC3339 timestamp). Read-only.
   */
  updated?: string;
}

export interface EventCreateParams {
  /**
   * Query param: Version number of conference data supported by the API client.
   * Version 0 assumes no conference data support and ignores conference data in the
   * event's body. Version 1 enables support for copying of ConferenceData as well as
   * for creating new conferences using the createRequest field of conferenceData.
   * The default is 0.
   */
  conferenceDataVersion?: number;

  /**
   * Query param: The maximum number of attendees to include in the response. If
   * there are more than the specified number of attendees, only the participant is
   * returned. Optional.
   */
  maxAttendees?: number;

  /**
   * Query param: Deprecated. Please use sendUpdates instead.
   *
   * Whether to send notifications about the creation of the new event. Note that
   * some emails might still be sent even if you set the value to false. The default
   * is false.
   */
  sendNotifications?: boolean;

  /**
   * Query param: Whether to send notifications about the creation of the new event.
   * Note that some emails might still be sent. The default is false.
   */
  sendUpdates?: string;

  /**
   * Query param: Whether API client performing operation supports event attachments.
   * Optional. The default is False.
   */
  supportsAttachments?: boolean;

  /**
   * Body param: Opaque identifier of the event. When creating new single or
   * recurring events, you can specify their IDs. Provided IDs must follow these
   * rules:
   *
   * - characters allowed in the ID are those used in base32hex encoding, i.e.
   *   lowercase letters a-v and digits 0-9, see section 3.1.2 in RFC2938
   * - the length of the ID must be between 5 and 1024 characters
   * - the ID must be unique per calendar Due to the globally distributed nature of
   *   the system, we cannot guarantee that ID collisions will be detected at event
   *   creation time. To minimize the risk of collisions we recommend using an
   *   established UUID algorithm such as one described in RFC4122. If you do not
   *   specify an ID, it will be automatically generated by the server. Note that the
   *   icalUID and the id are not identical and only one of them should be supplied
   *   at event creation time. One difference in their semantics is that in recurring
   *   events, all occurrences of one event have different ids while they all share
   *   the same icalUIDs.
   */
  id?: string;

  /**
   * Body param: Whether anyone can invite themselves to the event (deprecated).
   * Optional. The default is False.
   */
  anyoneCanAddSelf?: boolean;

  /**
   * Body param: File attachments for the event. In order to modify attachments the
   * supportsAttachments request parameter should be set to true. There can be at
   * most 25 attachments per event,
   */
  attachments?: Array<unknown>;

  /**
   * Body param: The attendees of the event. See the Events with attendees guide for
   * more information on scheduling events with other calendar users. Service
   * accounts need to use domain-wide delegation of authority to populate the
   * attendee list.
   */
  attendees?: Array<unknown>;

  /**
   * Body param: Whether attendees may have been omitted from the event's
   * representation. When retrieving an event, this may be due to a restriction
   * specified by the maxAttendee query parameter. When updating an event, this can
   * be used to only update the participant's response. Optional. The default is
   * False.
   */
  attendeesOmitted?: boolean;

  /**
   * Body param: Birthday or special event data. Used if eventType is "birthday".
   * Immutable.
   */
  birthdayProperties?: unknown;

  /**
   * Body param: The color of the event. This is an ID referring to an entry in the
   * event section of the colors definition (see the colors endpoint). Optional.
   */
  colorId?: string;

  /**
   * Body param: The conference-related information, such as details of a Google Meet
   * conference. To create new conference details use the createRequest field. To
   * persist your changes, remember to set the conferenceDataVersion request
   * parameter to 1 for all event modification requests.
   */
  conferenceData?: unknown;

  /**
   * Body param: Creation time of the event (as a RFC3339 timestamp). Read-only.
   */
  created?: string;

  /**
   * Body param: The creator of the event. Read-only.
   */
  creator?: EventCreateParams.Creator;

  /**
   * Body param: Description of the event. Can contain HTML. Optional.
   */
  description?: string;

  /**
   * Body param: The (exclusive) end time of the event. For a recurring event, this
   * is the end time of the first instance.
   */
  end?: unknown;

  /**
   * Body param: Whether the end time is actually unspecified. An end time is still
   * provided for compatibility reasons, even if this attribute is set to True. The
   * default is False.
   */
  endTimeUnspecified?: boolean;

  /**
   * Body param: ETag of the resource.
   */
  etag?: string;

  /**
   * Body param: Specific type of the event. This cannot be modified after the event
   * is created. Possible values are:
   *
   * - "birthday" - A special all-day event with an annual recurrence.
   * - "default" - A regular event or not further specified.
   * - "focusTime" - A focus-time event.
   * - "fromGmail" - An event from Gmail. This type of event cannot be created.
   * - "outOfOffice" - An out-of-office event.
   * - "workingLocation" - A working location event.
   */
  eventType?: string;

  /**
   * Body param: Extended properties of the event.
   */
  extendedProperties?: EventCreateParams.ExtendedProperties;

  /**
   * Body param: Focus Time event data. Used if eventType is focusTime.
   */
  focusTimeProperties?: unknown;

  /**
   * Body param: A gadget that extends this event. Gadgets are deprecated; this
   * structure is instead only used for returning birthday calendar metadata.
   */
  gadget?: EventCreateParams.Gadget;

  /**
   * Body param: Whether attendees other than the organizer can invite others to the
   * event. Optional. The default is True.
   */
  guestsCanInviteOthers?: boolean;

  /**
   * Body param: Whether attendees other than the organizer can modify the event.
   * Optional. The default is False.
   */
  guestsCanModify?: boolean;

  /**
   * Body param: Whether attendees other than the organizer can see who the event's
   * attendees are. Optional. The default is True.
   */
  guestsCanSeeOtherGuests?: boolean;

  /**
   * Body param: An absolute link to the Google Hangout associated with this event.
   * Read-only.
   */
  hangoutLink?: string;

  /**
   * Body param: An absolute link to this event in the Google Calendar Web UI.
   * Read-only.
   */
  htmlLink?: string;

  /**
   * Body param: Event unique identifier as defined in RFC5545. It is used to
   * uniquely identify events accross calendaring systems and must be supplied when
   * importing events via the import method. Note that the iCalUID and the id are not
   * identical and only one of them should be supplied at event creation time. One
   * difference in their semantics is that in recurring events, all occurrences of
   * one event have different ids while they all share the same iCalUIDs. To retrieve
   * an event using its iCalUID, call the events.list method using the iCalUID
   * parameter. To retrieve an event using its id, call the events.get method.
   */
  iCalUID?: string;

  /**
   * Body param: Type of the resource ("calendar#event").
   */
  kind?: string;

  /**
   * Body param: Geographic location of the event as free-form text. Optional.
   */
  location?: string;

  /**
   * Body param: Whether this is a locked event copy where no changes can be made to
   * the main event fields "summary", "description", "location", "start", "end" or
   * "recurrence". The default is False. Read-Only.
   */
  locked?: boolean;

  /**
   * Body param: The organizer of the event. If the organizer is also an attendee,
   * this is indicated with a separate entry in attendees with the organizer field
   * set to True. To change the organizer, use the move operation. Read-only, except
   * when importing an event.
   */
  organizer?: EventCreateParams.Organizer;

  /**
   * Body param: For an instance of a recurring event, this is the time at which this
   * event would start according to the recurrence data in the recurring event
   * identified by recurringEventId. It uniquely identifies the instance within the
   * recurring event series even if the instance was moved to a different time.
   * Immutable.
   */
  originalStartTime?: unknown;

  /**
   * Body param: Out of office event data. Used if eventType is outOfOffice.
   */
  outOfOfficeProperties?: unknown;

  /**
   * Body param: If set to True, Event propagation is disabled. Note that it is not
   * the same thing as Private event properties. Optional. Immutable. The default is
   * False.
   */
  privateCopy?: boolean;

  /**
   * Body param: List of RRULE, EXRULE, RDATE and EXDATE lines for a recurring event,
   * as specified in RFC5545. Note that DTSTART and DTEND lines are not allowed in
   * this field; event start and end times are specified in the start and end fields.
   * This field is omitted for single events or instances of recurring events.
   */
  recurrence?: Array<string>;

  /**
   * Body param: For an instance of a recurring event, this is the id of the
   * recurring event to which this instance belongs. Immutable.
   */
  recurringEventId?: string;

  /**
   * Body param: Information about the event's reminders for the authenticated user.
   * Note that changing reminders does not also change the updated property of the
   * enclosing event.
   */
  reminders?: EventCreateParams.Reminders;

  /**
   * Body param: Sequence number as per iCalendar.
   */
  sequence?: number;

  /**
   * Body param: Source from which the event was created. For example, a web page, an
   * email message or any document identifiable by an URL with HTTP or HTTPS scheme.
   * Can only be seen or modified by the creator of the event.
   */
  source?: EventCreateParams.Source;

  /**
   * Body param: The (inclusive) start time of the event. For a recurring event, this
   * is the start time of the first instance.
   */
  start?: unknown;

  /**
   * Body param: Status of the event. Optional. Possible values are:
   *
   * - "confirmed" - The event is confirmed. This is the default status.
   * - "tentative" - The event is tentatively confirmed.
   * - "cancelled" - The event is cancelled (deleted). The list method returns
   *   cancelled events only on incremental sync (when syncToken or updatedMin are
   *   specified) or if the showDeleted flag is set to true. The get method always
   *   returns them. A cancelled status represents two different states depending on
   *   the event type:
   * - Cancelled exceptions of an uncancelled recurring event indicate that this
   *   instance should no longer be presented to the user. Clients should store these
   *   events for the lifetime of the parent recurring event. Cancelled exceptions
   *   are only guaranteed to have values for the id, recurringEventId and
   *   originalStartTime fields populated. The other fields might be empty.
   * - All other cancelled events represent deleted events. Clients should remove
   *   their locally synced copies. Such cancelled events will eventually disappear,
   *   so do not rely on them being available indefinitely. Deleted events are only
   *   guaranteed to have the id field populated. On the organizer's calendar,
   *   cancelled events continue to expose event details (summary, location, etc.) so
   *   that they can be restored (undeleted). Similarly, the events to which the user
   *   was invited and that they manually removed continue to provide details.
   *   However, incremental sync requests with showDeleted set to false will not
   *   return these details. If an event changes its organizer (for example via the
   *   move operation) and the original organizer is not on the attendee list, it
   *   will leave behind a cancelled event where only the id field is guaranteed to
   *   be populated.
   */
  status?: string;

  /**
   * Body param: Title of the event.
   */
  summary?: string;

  /**
   * Body param: Whether the event blocks time on the calendar. Optional. Possible
   * values are:
   *
   * - "opaque" - Default value. The event does block time on the calendar. This is
   *   equivalent to setting Show me as to Busy in the Calendar UI.
   * - "transparent" - The event does not block time on the calendar. This is
   *   equivalent to setting Show me as to Available in the Calendar UI.
   */
  transparency?: string;

  /**
   * Body param: Last modification time of the main event data (as a RFC3339
   * timestamp). Updating event reminders will not cause this to change. Read-only.
   */
  updated?: string;

  /**
   * Body param: Visibility of the event. Optional. Possible values are:
   *
   * - "default" - Uses the default visibility for events on the calendar. This is
   *   the default value.
   * - "public" - The event is public and event details are visible to all readers of
   *   the calendar.
   * - "private" - The event is private and only event attendees may view event
   *   details.
   * - "confidential" - The event is private. This value is provided for
   *   compatibility reasons.
   */
  visibility?: string;

  /**
   * Body param: Working location event data.
   */
  workingLocationProperties?: unknown;
}

export namespace EventCreateParams {
  /**
   * The creator of the event. Read-only.
   */
  export interface Creator {
    /**
     * The creator's Profile ID, if available.
     */
    id?: string;

    /**
     * The creator's name, if available.
     */
    displayName?: string;

    /**
     * The creator's email address, if available.
     */
    email?: string;

    /**
     * Whether the creator corresponds to the calendar on which this copy of the event
     * appears. Read-only. The default is False.
     */
    self?: boolean;
  }

  /**
   * Extended properties of the event.
   */
  export interface ExtendedProperties {
    /**
     * Properties that are private to the copy of the event that appears on this
     * calendar.
     */
    private?: unknown;

    /**
     * Properties that are shared between copies of the event on other attendees'
     * calendars.
     */
    shared?: unknown;
  }

  /**
   * A gadget that extends this event. Gadgets are deprecated; this structure is
   * instead only used for returning birthday calendar metadata.
   */
  export interface Gadget {
    /**
     * The gadget's display mode. Deprecated. Possible values are:
     *
     * - "icon" - The gadget displays next to the event's title in the calendar view.
     * - "chip" - The gadget displays when the event is clicked.
     */
    display?: string;

    /**
     * The gadget's height in pixels. The height must be an integer greater than 0.
     * Optional. Deprecated.
     */
    height?: number;

    /**
     * The gadget's icon URL. The URL scheme must be HTTPS. Deprecated.
     */
    iconLink?: string;

    /**
     * The gadget's URL. The URL scheme must be HTTPS. Deprecated.
     */
    link?: string;

    /**
     * Preferences.
     */
    preferences?: unknown;

    /**
     * The gadget's title. Deprecated.
     */
    title?: string;

    /**
     * The gadget's type. Deprecated.
     */
    type?: string;

    /**
     * The gadget's width in pixels. The width must be an integer greater than 0.
     * Optional. Deprecated.
     */
    width?: number;
  }

  /**
   * The organizer of the event. If the organizer is also an attendee, this is
   * indicated with a separate entry in attendees with the organizer field set to
   * True. To change the organizer, use the move operation. Read-only, except when
   * importing an event.
   */
  export interface Organizer {
    /**
     * The organizer's Profile ID, if available.
     */
    id?: string;

    /**
     * The organizer's name, if available.
     */
    displayName?: string;

    /**
     * The organizer's email address, if available. It must be a valid email address as
     * per RFC5322.
     */
    email?: string;

    /**
     * Whether the organizer corresponds to the calendar on which this copy of the
     * event appears. Read-only. The default is False.
     */
    self?: boolean;
  }

  /**
   * Information about the event's reminders for the authenticated user. Note that
   * changing reminders does not also change the updated property of the enclosing
   * event.
   */
  export interface Reminders {
    /**
     * If the event doesn't use the default reminders, this lists the reminders
     * specific to the event, or, if not set, indicates that no reminders are set for
     * this event. The maximum number of override reminders is 5.
     */
    overrides?: Array<unknown>;

    /**
     * Whether the default reminders of the calendar apply to the event.
     */
    useDefault?: boolean;
  }

  /**
   * Source from which the event was created. For example, a web page, an email
   * message or any document identifiable by an URL with HTTP or HTTPS scheme. Can
   * only be seen or modified by the creator of the event.
   */
  export interface Source {
    /**
     * Title of the source; for example a title of a web page or an email subject.
     */
    title?: string;

    /**
     * URL of the source pointing to a resource. The URL scheme must be HTTP or HTTPS.
     */
    url?: string;
  }
}

export interface EventRetrieveParams {
  /**
   * Path param:
   */
  calendarId: string;

  /**
   * Query param: Deprecated and ignored. A value will always be returned in the
   * email field for the organizer, creator and attendees, even if no real email
   * address is available (i.e. a generated, non-working value will be provided).
   */
  alwaysIncludeEmail?: boolean;

  /**
   * Query param: The maximum number of attendees to include in the response. If
   * there are more than the specified number of attendees, only the participant is
   * returned. Optional.
   */
  maxAttendees?: number;

  /**
   * Query param: Time zone used in the response. Optional. The default is the time
   * zone of the calendar.
   */
  timeZone?: string;
}

export interface EventUpdateParams {
  /**
   * Path param:
   */
  calendarId: string;

  /**
   * Query param: Deprecated and ignored. A value will always be returned in the
   * email field for the organizer, creator and attendees, even if no real email
   * address is available (i.e. a generated, non-working value will be provided).
   */
  alwaysIncludeEmail?: boolean;

  /**
   * Query param: Version number of conference data supported by the API client.
   * Version 0 assumes no conference data support and ignores conference data in the
   * event's body. Version 1 enables support for copying of ConferenceData as well as
   * for creating new conferences using the createRequest field of conferenceData.
   * The default is 0.
   */
  conferenceDataVersion?: number;

  /**
   * Query param: The maximum number of attendees to include in the response. If
   * there are more than the specified number of attendees, only the participant is
   * returned. Optional.
   */
  maxAttendees?: number;

  /**
   * Query param: Deprecated. Please use sendUpdates instead.
   *
   * Whether to send notifications about the event update (for example, description
   * changes, etc.). Note that some emails might still be sent even if you set the
   * value to false. The default is false.
   */
  sendNotifications?: boolean;

  /**
   * Query param: Guests who should receive notifications about the event update (for
   * example, title changes, etc.).
   */
  sendUpdates?: string;

  /**
   * Query param: Whether API client performing operation supports event attachments.
   * Optional. The default is False.
   */
  supportsAttachments?: boolean;

  /**
   * Body param: Opaque identifier of the event. When creating new single or
   * recurring events, you can specify their IDs. Provided IDs must follow these
   * rules:
   *
   * - characters allowed in the ID are those used in base32hex encoding, i.e.
   *   lowercase letters a-v and digits 0-9, see section 3.1.2 in RFC2938
   * - the length of the ID must be between 5 and 1024 characters
   * - the ID must be unique per calendar Due to the globally distributed nature of
   *   the system, we cannot guarantee that ID collisions will be detected at event
   *   creation time. To minimize the risk of collisions we recommend using an
   *   established UUID algorithm such as one described in RFC4122. If you do not
   *   specify an ID, it will be automatically generated by the server. Note that the
   *   icalUID and the id are not identical and only one of them should be supplied
   *   at event creation time. One difference in their semantics is that in recurring
   *   events, all occurrences of one event have different ids while they all share
   *   the same icalUIDs.
   */
  id?: string;

  /**
   * Body param: Whether anyone can invite themselves to the event (deprecated).
   * Optional. The default is False.
   */
  anyoneCanAddSelf?: boolean;

  /**
   * Body param: File attachments for the event. In order to modify attachments the
   * supportsAttachments request parameter should be set to true. There can be at
   * most 25 attachments per event,
   */
  attachments?: Array<unknown>;

  /**
   * Body param: The attendees of the event. See the Events with attendees guide for
   * more information on scheduling events with other calendar users. Service
   * accounts need to use domain-wide delegation of authority to populate the
   * attendee list.
   */
  attendees?: Array<unknown>;

  /**
   * Body param: Whether attendees may have been omitted from the event's
   * representation. When retrieving an event, this may be due to a restriction
   * specified by the maxAttendee query parameter. When updating an event, this can
   * be used to only update the participant's response. Optional. The default is
   * False.
   */
  attendeesOmitted?: boolean;

  /**
   * Body param: Birthday or special event data. Used if eventType is "birthday".
   * Immutable.
   */
  birthdayProperties?: unknown;

  /**
   * Body param: The color of the event. This is an ID referring to an entry in the
   * event section of the colors definition (see the colors endpoint). Optional.
   */
  colorId?: string;

  /**
   * Body param: The conference-related information, such as details of a Google Meet
   * conference. To create new conference details use the createRequest field. To
   * persist your changes, remember to set the conferenceDataVersion request
   * parameter to 1 for all event modification requests.
   */
  conferenceData?: unknown;

  /**
   * Body param: Creation time of the event (as a RFC3339 timestamp). Read-only.
   */
  created?: string;

  /**
   * Body param: The creator of the event. Read-only.
   */
  creator?: EventUpdateParams.Creator;

  /**
   * Body param: Description of the event. Can contain HTML. Optional.
   */
  description?: string;

  /**
   * Body param: The (exclusive) end time of the event. For a recurring event, this
   * is the end time of the first instance.
   */
  end?: unknown;

  /**
   * Body param: Whether the end time is actually unspecified. An end time is still
   * provided for compatibility reasons, even if this attribute is set to True. The
   * default is False.
   */
  endTimeUnspecified?: boolean;

  /**
   * Body param: ETag of the resource.
   */
  etag?: string;

  /**
   * Body param: Specific type of the event. This cannot be modified after the event
   * is created. Possible values are:
   *
   * - "birthday" - A special all-day event with an annual recurrence.
   * - "default" - A regular event or not further specified.
   * - "focusTime" - A focus-time event.
   * - "fromGmail" - An event from Gmail. This type of event cannot be created.
   * - "outOfOffice" - An out-of-office event.
   * - "workingLocation" - A working location event.
   */
  eventType?: string;

  /**
   * Body param: Extended properties of the event.
   */
  extendedProperties?: EventUpdateParams.ExtendedProperties;

  /**
   * Body param: Focus Time event data. Used if eventType is focusTime.
   */
  focusTimeProperties?: unknown;

  /**
   * Body param: A gadget that extends this event. Gadgets are deprecated; this
   * structure is instead only used for returning birthday calendar metadata.
   */
  gadget?: EventUpdateParams.Gadget;

  /**
   * Body param: Whether attendees other than the organizer can invite others to the
   * event. Optional. The default is True.
   */
  guestsCanInviteOthers?: boolean;

  /**
   * Body param: Whether attendees other than the organizer can modify the event.
   * Optional. The default is False.
   */
  guestsCanModify?: boolean;

  /**
   * Body param: Whether attendees other than the organizer can see who the event's
   * attendees are. Optional. The default is True.
   */
  guestsCanSeeOtherGuests?: boolean;

  /**
   * Body param: An absolute link to the Google Hangout associated with this event.
   * Read-only.
   */
  hangoutLink?: string;

  /**
   * Body param: An absolute link to this event in the Google Calendar Web UI.
   * Read-only.
   */
  htmlLink?: string;

  /**
   * Body param: Event unique identifier as defined in RFC5545. It is used to
   * uniquely identify events accross calendaring systems and must be supplied when
   * importing events via the import method. Note that the iCalUID and the id are not
   * identical and only one of them should be supplied at event creation time. One
   * difference in their semantics is that in recurring events, all occurrences of
   * one event have different ids while they all share the same iCalUIDs. To retrieve
   * an event using its iCalUID, call the events.list method using the iCalUID
   * parameter. To retrieve an event using its id, call the events.get method.
   */
  iCalUID?: string;

  /**
   * Body param: Type of the resource ("calendar#event").
   */
  kind?: string;

  /**
   * Body param: Geographic location of the event as free-form text. Optional.
   */
  location?: string;

  /**
   * Body param: Whether this is a locked event copy where no changes can be made to
   * the main event fields "summary", "description", "location", "start", "end" or
   * "recurrence". The default is False. Read-Only.
   */
  locked?: boolean;

  /**
   * Body param: The organizer of the event. If the organizer is also an attendee,
   * this is indicated with a separate entry in attendees with the organizer field
   * set to True. To change the organizer, use the move operation. Read-only, except
   * when importing an event.
   */
  organizer?: EventUpdateParams.Organizer;

  /**
   * Body param: For an instance of a recurring event, this is the time at which this
   * event would start according to the recurrence data in the recurring event
   * identified by recurringEventId. It uniquely identifies the instance within the
   * recurring event series even if the instance was moved to a different time.
   * Immutable.
   */
  originalStartTime?: unknown;

  /**
   * Body param: Out of office event data. Used if eventType is outOfOffice.
   */
  outOfOfficeProperties?: unknown;

  /**
   * Body param: If set to True, Event propagation is disabled. Note that it is not
   * the same thing as Private event properties. Optional. Immutable. The default is
   * False.
   */
  privateCopy?: boolean;

  /**
   * Body param: List of RRULE, EXRULE, RDATE and EXDATE lines for a recurring event,
   * as specified in RFC5545. Note that DTSTART and DTEND lines are not allowed in
   * this field; event start and end times are specified in the start and end fields.
   * This field is omitted for single events or instances of recurring events.
   */
  recurrence?: Array<string>;

  /**
   * Body param: For an instance of a recurring event, this is the id of the
   * recurring event to which this instance belongs. Immutable.
   */
  recurringEventId?: string;

  /**
   * Body param: Information about the event's reminders for the authenticated user.
   * Note that changing reminders does not also change the updated property of the
   * enclosing event.
   */
  reminders?: EventUpdateParams.Reminders;

  /**
   * Body param: Sequence number as per iCalendar.
   */
  sequence?: number;

  /**
   * Body param: Source from which the event was created. For example, a web page, an
   * email message or any document identifiable by an URL with HTTP or HTTPS scheme.
   * Can only be seen or modified by the creator of the event.
   */
  source?: EventUpdateParams.Source;

  /**
   * Body param: The (inclusive) start time of the event. For a recurring event, this
   * is the start time of the first instance.
   */
  start?: unknown;

  /**
   * Body param: Status of the event. Optional. Possible values are:
   *
   * - "confirmed" - The event is confirmed. This is the default status.
   * - "tentative" - The event is tentatively confirmed.
   * - "cancelled" - The event is cancelled (deleted). The list method returns
   *   cancelled events only on incremental sync (when syncToken or updatedMin are
   *   specified) or if the showDeleted flag is set to true. The get method always
   *   returns them. A cancelled status represents two different states depending on
   *   the event type:
   * - Cancelled exceptions of an uncancelled recurring event indicate that this
   *   instance should no longer be presented to the user. Clients should store these
   *   events for the lifetime of the parent recurring event. Cancelled exceptions
   *   are only guaranteed to have values for the id, recurringEventId and
   *   originalStartTime fields populated. The other fields might be empty.
   * - All other cancelled events represent deleted events. Clients should remove
   *   their locally synced copies. Such cancelled events will eventually disappear,
   *   so do not rely on them being available indefinitely. Deleted events are only
   *   guaranteed to have the id field populated. On the organizer's calendar,
   *   cancelled events continue to expose event details (summary, location, etc.) so
   *   that they can be restored (undeleted). Similarly, the events to which the user
   *   was invited and that they manually removed continue to provide details.
   *   However, incremental sync requests with showDeleted set to false will not
   *   return these details. If an event changes its organizer (for example via the
   *   move operation) and the original organizer is not on the attendee list, it
   *   will leave behind a cancelled event where only the id field is guaranteed to
   *   be populated.
   */
  status?: string;

  /**
   * Body param: Title of the event.
   */
  summary?: string;

  /**
   * Body param: Whether the event blocks time on the calendar. Optional. Possible
   * values are:
   *
   * - "opaque" - Default value. The event does block time on the calendar. This is
   *   equivalent to setting Show me as to Busy in the Calendar UI.
   * - "transparent" - The event does not block time on the calendar. This is
   *   equivalent to setting Show me as to Available in the Calendar UI.
   */
  transparency?: string;

  /**
   * Body param: Last modification time of the main event data (as a RFC3339
   * timestamp). Updating event reminders will not cause this to change. Read-only.
   */
  updated?: string;

  /**
   * Body param: Visibility of the event. Optional. Possible values are:
   *
   * - "default" - Uses the default visibility for events on the calendar. This is
   *   the default value.
   * - "public" - The event is public and event details are visible to all readers of
   *   the calendar.
   * - "private" - The event is private and only event attendees may view event
   *   details.
   * - "confidential" - The event is private. This value is provided for
   *   compatibility reasons.
   */
  visibility?: string;

  /**
   * Body param: Working location event data.
   */
  workingLocationProperties?: unknown;
}

export namespace EventUpdateParams {
  /**
   * The creator of the event. Read-only.
   */
  export interface Creator {
    /**
     * The creator's Profile ID, if available.
     */
    id?: string;

    /**
     * The creator's name, if available.
     */
    displayName?: string;

    /**
     * The creator's email address, if available.
     */
    email?: string;

    /**
     * Whether the creator corresponds to the calendar on which this copy of the event
     * appears. Read-only. The default is False.
     */
    self?: boolean;
  }

  /**
   * Extended properties of the event.
   */
  export interface ExtendedProperties {
    /**
     * Properties that are private to the copy of the event that appears on this
     * calendar.
     */
    private?: unknown;

    /**
     * Properties that are shared between copies of the event on other attendees'
     * calendars.
     */
    shared?: unknown;
  }

  /**
   * A gadget that extends this event. Gadgets are deprecated; this structure is
   * instead only used for returning birthday calendar metadata.
   */
  export interface Gadget {
    /**
     * The gadget's display mode. Deprecated. Possible values are:
     *
     * - "icon" - The gadget displays next to the event's title in the calendar view.
     * - "chip" - The gadget displays when the event is clicked.
     */
    display?: string;

    /**
     * The gadget's height in pixels. The height must be an integer greater than 0.
     * Optional. Deprecated.
     */
    height?: number;

    /**
     * The gadget's icon URL. The URL scheme must be HTTPS. Deprecated.
     */
    iconLink?: string;

    /**
     * The gadget's URL. The URL scheme must be HTTPS. Deprecated.
     */
    link?: string;

    /**
     * Preferences.
     */
    preferences?: unknown;

    /**
     * The gadget's title. Deprecated.
     */
    title?: string;

    /**
     * The gadget's type. Deprecated.
     */
    type?: string;

    /**
     * The gadget's width in pixels. The width must be an integer greater than 0.
     * Optional. Deprecated.
     */
    width?: number;
  }

  /**
   * The organizer of the event. If the organizer is also an attendee, this is
   * indicated with a separate entry in attendees with the organizer field set to
   * True. To change the organizer, use the move operation. Read-only, except when
   * importing an event.
   */
  export interface Organizer {
    /**
     * The organizer's Profile ID, if available.
     */
    id?: string;

    /**
     * The organizer's name, if available.
     */
    displayName?: string;

    /**
     * The organizer's email address, if available. It must be a valid email address as
     * per RFC5322.
     */
    email?: string;

    /**
     * Whether the organizer corresponds to the calendar on which this copy of the
     * event appears. Read-only. The default is False.
     */
    self?: boolean;
  }

  /**
   * Information about the event's reminders for the authenticated user. Note that
   * changing reminders does not also change the updated property of the enclosing
   * event.
   */
  export interface Reminders {
    /**
     * If the event doesn't use the default reminders, this lists the reminders
     * specific to the event, or, if not set, indicates that no reminders are set for
     * this event. The maximum number of override reminders is 5.
     */
    overrides?: Array<unknown>;

    /**
     * Whether the default reminders of the calendar apply to the event.
     */
    useDefault?: boolean;
  }

  /**
   * Source from which the event was created. For example, a web page, an email
   * message or any document identifiable by an URL with HTTP or HTTPS scheme. Can
   * only be seen or modified by the creator of the event.
   */
  export interface Source {
    /**
     * Title of the source; for example a title of a web page or an email subject.
     */
    title?: string;

    /**
     * URL of the source pointing to a resource. The URL scheme must be HTTP or HTTPS.
     */
    url?: string;
  }
}

export interface EventListParams {
  /**
   * Deprecated and ignored.
   */
  alwaysIncludeEmail?: boolean;

  /**
   * Event types to return. Optional. This parameter can be repeated multiple times
   * to return events of different types. If unset, returns all event types.
   */
  eventTypes?: string;

  /**
   * Specifies an event ID in the iCalendar format to be provided in the response.
   * Optional. Use this if you want to search for an event by its iCalendar ID.
   */
  iCalUID?: string;

  /**
   * The maximum number of attendees to include in the response. If there are more
   * than the specified number of attendees, only the participant is returned.
   * Optional.
   */
  maxAttendees?: number;

  /**
   * Maximum number of events returned on one result page. The number of events in
   * the resulting page may be less than this value, or none at all, even if there
   * are more events matching the query. Incomplete pages can be detected by a
   * non-empty nextPageToken field in the response. By default the value is 250
   * events. The page size can never be larger than 2500 events. Optional.
   */
  maxResults?: number;

  /**
   * The order of the events returned in the result. Optional. The default is an
   * unspecified, stable order.
   */
  orderBy?: string;

  /**
   * Token specifying which result page to return. Optional.
   */
  pageToken?: string;

  /**
   * Extended properties constraint specified as propertyName=value. Matches only
   * private properties. This parameter might be repeated multiple times to return
   * events that match all given constraints.
   */
  privateExtendedProperty?: string;

  /**
   * Free text search terms to find events that match these terms in the following
   * fields:
   *
   * - summary
   * - description
   * - location
   * - attendee's displayName
   * - attendee's email
   * - organizer's displayName
   * - organizer's email
   * - workingLocationProperties.officeLocation.buildingId
   * - workingLocationProperties.officeLocation.deskId
   * - workingLocationProperties.officeLocation.label
   * - workingLocationProperties.customLocation.label These search terms also match
   *   predefined keywords against all display title translations of working
   *   location, out-of-office, and focus-time events. For example, searching for
   *   "Office" or "Bureau" returns working location events of type officeLocation,
   *   whereas searching for "Out of office" or "Abwesend" returns out-of-office
   *   events. Optional.
   */
  q?: string;

  /**
   * Extended properties constraint specified as propertyName=value. Matches only
   * shared properties. This parameter might be repeated multiple times to return
   * events that match all given constraints.
   */
  sharedExtendedProperty?: string;

  /**
   * Whether to include deleted events (with status equals "cancelled") in the
   * result. Cancelled instances of recurring events (but not the underlying
   * recurring event) will still be included if showDeleted and singleEvents are both
   * False. If showDeleted and singleEvents are both True, only single instances of
   * deleted events (but not the underlying recurring events) are returned. Optional.
   * The default is False.
   */
  showDeleted?: boolean;

  /**
   * Whether to include hidden invitations in the result. Optional. The default is
   * False.
   */
  showHiddenInvitations?: boolean;

  /**
   * Whether to expand recurring events into instances and only return single one-off
   * events and instances of recurring events, but not the underlying recurring
   * events themselves. Optional. The default is False.
   */
  singleEvents?: boolean;

  /**
   * Token obtained from the nextSyncToken field returned on the last page of results
   * from the previous list request. It makes the result of this list request contain
   * only entries that have changed since then. All events deleted since the previous
   * list request will always be in the result set and it is not allowed to set
   * showDeleted to False. There are several query parameters that cannot be
   * specified together with nextSyncToken to ensure consistency of the client state.
   *
   * These are:
   *
   * - iCalUID
   * - orderBy
   * - privateExtendedProperty
   * - q
   * - sharedExtendedProperty
   * - timeMin
   * - timeMax
   * - updatedMin All other query parameters should be the same as for the initial
   *   synchronization to avoid undefined behavior. If the syncToken expires, the
   *   server will respond with a 410 GONE response code and the client should clear
   *   its storage and perform a full synchronization without any syncToken. Learn
   *   more about incremental synchronization. Optional. The default is to return all
   *   entries.
   */
  syncToken?: string;

  /**
   * Upper bound (exclusive) for an event's start time to filter by. Optional. The
   * default is not to filter by start time. Must be an RFC3339 timestamp with
   * mandatory time zone offset, for example, 2011-06-03T10:00:00-07:00,
   * 2011-06-03T10:00:00Z. Milliseconds may be provided but are ignored. If timeMin
   * is set, timeMax must be greater than timeMin.
   */
  timeMax?: string;

  /**
   * Lower bound (exclusive) for an event's end time to filter by. Optional. The
   * default is not to filter by end time. Must be an RFC3339 timestamp with
   * mandatory time zone offset, for example, 2011-06-03T10:00:00-07:00,
   * 2011-06-03T10:00:00Z. Milliseconds may be provided but are ignored. If timeMax
   * is set, timeMin must be smaller than timeMax.
   */
  timeMin?: string;

  /**
   * Time zone used in the response. Optional. The default is the time zone of the
   * calendar.
   */
  timeZone?: string;

  /**
   * Lower bound for an event's last modification time (as a RFC3339 timestamp) to
   * filter by. When specified, entries deleted since this time will always be
   * included regardless of showDeleted. Optional. The default is not to filter by
   * last modification time.
   */
  updatedMin?: string;
}

export interface EventDeleteParams {
  /**
   * Path param:
   */
  calendarId: string;

  /**
   * Query param: Deprecated. Please use sendUpdates instead.
   *
   * Whether to send notifications about the deletion of the event. Note that some
   * emails might still be sent even if you set the value to false. The default is
   * false.
   */
  sendNotifications?: boolean;

  /**
   * Query param: Guests who should receive notifications about the deletion of the
   * event.
   */
  sendUpdates?: string;
}

export interface EventImportParams {
  /**
   * Query param: Version number of conference data supported by the API client.
   * Version 0 assumes no conference data support and ignores conference data in the
   * event's body. Version 1 enables support for copying of ConferenceData as well as
   * for creating new conferences using the createRequest field of conferenceData.
   * The default is 0.
   */
  conferenceDataVersion?: number;

  /**
   * Query param: Whether API client performing operation supports event attachments.
   * Optional. The default is False.
   */
  supportsAttachments?: boolean;

  /**
   * Body param: Opaque identifier of the event. When creating new single or
   * recurring events, you can specify their IDs. Provided IDs must follow these
   * rules:
   *
   * - characters allowed in the ID are those used in base32hex encoding, i.e.
   *   lowercase letters a-v and digits 0-9, see section 3.1.2 in RFC2938
   * - the length of the ID must be between 5 and 1024 characters
   * - the ID must be unique per calendar Due to the globally distributed nature of
   *   the system, we cannot guarantee that ID collisions will be detected at event
   *   creation time. To minimize the risk of collisions we recommend using an
   *   established UUID algorithm such as one described in RFC4122. If you do not
   *   specify an ID, it will be automatically generated by the server. Note that the
   *   icalUID and the id are not identical and only one of them should be supplied
   *   at event creation time. One difference in their semantics is that in recurring
   *   events, all occurrences of one event have different ids while they all share
   *   the same icalUIDs.
   */
  id?: string;

  /**
   * Body param: Whether anyone can invite themselves to the event (deprecated).
   * Optional. The default is False.
   */
  anyoneCanAddSelf?: boolean;

  /**
   * Body param: File attachments for the event. In order to modify attachments the
   * supportsAttachments request parameter should be set to true. There can be at
   * most 25 attachments per event,
   */
  attachments?: Array<unknown>;

  /**
   * Body param: The attendees of the event. See the Events with attendees guide for
   * more information on scheduling events with other calendar users. Service
   * accounts need to use domain-wide delegation of authority to populate the
   * attendee list.
   */
  attendees?: Array<unknown>;

  /**
   * Body param: Whether attendees may have been omitted from the event's
   * representation. When retrieving an event, this may be due to a restriction
   * specified by the maxAttendee query parameter. When updating an event, this can
   * be used to only update the participant's response. Optional. The default is
   * False.
   */
  attendeesOmitted?: boolean;

  /**
   * Body param: Birthday or special event data. Used if eventType is "birthday".
   * Immutable.
   */
  birthdayProperties?: unknown;

  /**
   * Body param: The color of the event. This is an ID referring to an entry in the
   * event section of the colors definition (see the colors endpoint). Optional.
   */
  colorId?: string;

  /**
   * Body param: The conference-related information, such as details of a Google Meet
   * conference. To create new conference details use the createRequest field. To
   * persist your changes, remember to set the conferenceDataVersion request
   * parameter to 1 for all event modification requests.
   */
  conferenceData?: unknown;

  /**
   * Body param: Creation time of the event (as a RFC3339 timestamp). Read-only.
   */
  created?: string;

  /**
   * Body param: The creator of the event. Read-only.
   */
  creator?: EventImportParams.Creator;

  /**
   * Body param: Description of the event. Can contain HTML. Optional.
   */
  description?: string;

  /**
   * Body param: The (exclusive) end time of the event. For a recurring event, this
   * is the end time of the first instance.
   */
  end?: unknown;

  /**
   * Body param: Whether the end time is actually unspecified. An end time is still
   * provided for compatibility reasons, even if this attribute is set to True. The
   * default is False.
   */
  endTimeUnspecified?: boolean;

  /**
   * Body param: ETag of the resource.
   */
  etag?: string;

  /**
   * Body param: Specific type of the event. This cannot be modified after the event
   * is created. Possible values are:
   *
   * - "birthday" - A special all-day event with an annual recurrence.
   * - "default" - A regular event or not further specified.
   * - "focusTime" - A focus-time event.
   * - "fromGmail" - An event from Gmail. This type of event cannot be created.
   * - "outOfOffice" - An out-of-office event.
   * - "workingLocation" - A working location event.
   */
  eventType?: string;

  /**
   * Body param: Extended properties of the event.
   */
  extendedProperties?: EventImportParams.ExtendedProperties;

  /**
   * Body param: Focus Time event data. Used if eventType is focusTime.
   */
  focusTimeProperties?: unknown;

  /**
   * Body param: A gadget that extends this event. Gadgets are deprecated; this
   * structure is instead only used for returning birthday calendar metadata.
   */
  gadget?: EventImportParams.Gadget;

  /**
   * Body param: Whether attendees other than the organizer can invite others to the
   * event. Optional. The default is True.
   */
  guestsCanInviteOthers?: boolean;

  /**
   * Body param: Whether attendees other than the organizer can modify the event.
   * Optional. The default is False.
   */
  guestsCanModify?: boolean;

  /**
   * Body param: Whether attendees other than the organizer can see who the event's
   * attendees are. Optional. The default is True.
   */
  guestsCanSeeOtherGuests?: boolean;

  /**
   * Body param: An absolute link to the Google Hangout associated with this event.
   * Read-only.
   */
  hangoutLink?: string;

  /**
   * Body param: An absolute link to this event in the Google Calendar Web UI.
   * Read-only.
   */
  htmlLink?: string;

  /**
   * Body param: Event unique identifier as defined in RFC5545. It is used to
   * uniquely identify events accross calendaring systems and must be supplied when
   * importing events via the import method. Note that the iCalUID and the id are not
   * identical and only one of them should be supplied at event creation time. One
   * difference in their semantics is that in recurring events, all occurrences of
   * one event have different ids while they all share the same iCalUIDs. To retrieve
   * an event using its iCalUID, call the events.list method using the iCalUID
   * parameter. To retrieve an event using its id, call the events.get method.
   */
  iCalUID?: string;

  /**
   * Body param: Type of the resource ("calendar#event").
   */
  kind?: string;

  /**
   * Body param: Geographic location of the event as free-form text. Optional.
   */
  location?: string;

  /**
   * Body param: Whether this is a locked event copy where no changes can be made to
   * the main event fields "summary", "description", "location", "start", "end" or
   * "recurrence". The default is False. Read-Only.
   */
  locked?: boolean;

  /**
   * Body param: The organizer of the event. If the organizer is also an attendee,
   * this is indicated with a separate entry in attendees with the organizer field
   * set to True. To change the organizer, use the move operation. Read-only, except
   * when importing an event.
   */
  organizer?: EventImportParams.Organizer;

  /**
   * Body param: For an instance of a recurring event, this is the time at which this
   * event would start according to the recurrence data in the recurring event
   * identified by recurringEventId. It uniquely identifies the instance within the
   * recurring event series even if the instance was moved to a different time.
   * Immutable.
   */
  originalStartTime?: unknown;

  /**
   * Body param: Out of office event data. Used if eventType is outOfOffice.
   */
  outOfOfficeProperties?: unknown;

  /**
   * Body param: If set to True, Event propagation is disabled. Note that it is not
   * the same thing as Private event properties. Optional. Immutable. The default is
   * False.
   */
  privateCopy?: boolean;

  /**
   * Body param: List of RRULE, EXRULE, RDATE and EXDATE lines for a recurring event,
   * as specified in RFC5545. Note that DTSTART and DTEND lines are not allowed in
   * this field; event start and end times are specified in the start and end fields.
   * This field is omitted for single events or instances of recurring events.
   */
  recurrence?: Array<string>;

  /**
   * Body param: For an instance of a recurring event, this is the id of the
   * recurring event to which this instance belongs. Immutable.
   */
  recurringEventId?: string;

  /**
   * Body param: Information about the event's reminders for the authenticated user.
   * Note that changing reminders does not also change the updated property of the
   * enclosing event.
   */
  reminders?: EventImportParams.Reminders;

  /**
   * Body param: Sequence number as per iCalendar.
   */
  sequence?: number;

  /**
   * Body param: Source from which the event was created. For example, a web page, an
   * email message or any document identifiable by an URL with HTTP or HTTPS scheme.
   * Can only be seen or modified by the creator of the event.
   */
  source?: EventImportParams.Source;

  /**
   * Body param: The (inclusive) start time of the event. For a recurring event, this
   * is the start time of the first instance.
   */
  start?: unknown;

  /**
   * Body param: Status of the event. Optional. Possible values are:
   *
   * - "confirmed" - The event is confirmed. This is the default status.
   * - "tentative" - The event is tentatively confirmed.
   * - "cancelled" - The event is cancelled (deleted). The list method returns
   *   cancelled events only on incremental sync (when syncToken or updatedMin are
   *   specified) or if the showDeleted flag is set to true. The get method always
   *   returns them. A cancelled status represents two different states depending on
   *   the event type:
   * - Cancelled exceptions of an uncancelled recurring event indicate that this
   *   instance should no longer be presented to the user. Clients should store these
   *   events for the lifetime of the parent recurring event. Cancelled exceptions
   *   are only guaranteed to have values for the id, recurringEventId and
   *   originalStartTime fields populated. The other fields might be empty.
   * - All other cancelled events represent deleted events. Clients should remove
   *   their locally synced copies. Such cancelled events will eventually disappear,
   *   so do not rely on them being available indefinitely. Deleted events are only
   *   guaranteed to have the id field populated. On the organizer's calendar,
   *   cancelled events continue to expose event details (summary, location, etc.) so
   *   that they can be restored (undeleted). Similarly, the events to which the user
   *   was invited and that they manually removed continue to provide details.
   *   However, incremental sync requests with showDeleted set to false will not
   *   return these details. If an event changes its organizer (for example via the
   *   move operation) and the original organizer is not on the attendee list, it
   *   will leave behind a cancelled event where only the id field is guaranteed to
   *   be populated.
   */
  status?: string;

  /**
   * Body param: Title of the event.
   */
  summary?: string;

  /**
   * Body param: Whether the event blocks time on the calendar. Optional. Possible
   * values are:
   *
   * - "opaque" - Default value. The event does block time on the calendar. This is
   *   equivalent to setting Show me as to Busy in the Calendar UI.
   * - "transparent" - The event does not block time on the calendar. This is
   *   equivalent to setting Show me as to Available in the Calendar UI.
   */
  transparency?: string;

  /**
   * Body param: Last modification time of the main event data (as a RFC3339
   * timestamp). Updating event reminders will not cause this to change. Read-only.
   */
  updated?: string;

  /**
   * Body param: Visibility of the event. Optional. Possible values are:
   *
   * - "default" - Uses the default visibility for events on the calendar. This is
   *   the default value.
   * - "public" - The event is public and event details are visible to all readers of
   *   the calendar.
   * - "private" - The event is private and only event attendees may view event
   *   details.
   * - "confidential" - The event is private. This value is provided for
   *   compatibility reasons.
   */
  visibility?: string;

  /**
   * Body param: Working location event data.
   */
  workingLocationProperties?: unknown;
}

export namespace EventImportParams {
  /**
   * The creator of the event. Read-only.
   */
  export interface Creator {
    /**
     * The creator's Profile ID, if available.
     */
    id?: string;

    /**
     * The creator's name, if available.
     */
    displayName?: string;

    /**
     * The creator's email address, if available.
     */
    email?: string;

    /**
     * Whether the creator corresponds to the calendar on which this copy of the event
     * appears. Read-only. The default is False.
     */
    self?: boolean;
  }

  /**
   * Extended properties of the event.
   */
  export interface ExtendedProperties {
    /**
     * Properties that are private to the copy of the event that appears on this
     * calendar.
     */
    private?: unknown;

    /**
     * Properties that are shared between copies of the event on other attendees'
     * calendars.
     */
    shared?: unknown;
  }

  /**
   * A gadget that extends this event. Gadgets are deprecated; this structure is
   * instead only used for returning birthday calendar metadata.
   */
  export interface Gadget {
    /**
     * The gadget's display mode. Deprecated. Possible values are:
     *
     * - "icon" - The gadget displays next to the event's title in the calendar view.
     * - "chip" - The gadget displays when the event is clicked.
     */
    display?: string;

    /**
     * The gadget's height in pixels. The height must be an integer greater than 0.
     * Optional. Deprecated.
     */
    height?: number;

    /**
     * The gadget's icon URL. The URL scheme must be HTTPS. Deprecated.
     */
    iconLink?: string;

    /**
     * The gadget's URL. The URL scheme must be HTTPS. Deprecated.
     */
    link?: string;

    /**
     * Preferences.
     */
    preferences?: unknown;

    /**
     * The gadget's title. Deprecated.
     */
    title?: string;

    /**
     * The gadget's type. Deprecated.
     */
    type?: string;

    /**
     * The gadget's width in pixels. The width must be an integer greater than 0.
     * Optional. Deprecated.
     */
    width?: number;
  }

  /**
   * The organizer of the event. If the organizer is also an attendee, this is
   * indicated with a separate entry in attendees with the organizer field set to
   * True. To change the organizer, use the move operation. Read-only, except when
   * importing an event.
   */
  export interface Organizer {
    /**
     * The organizer's Profile ID, if available.
     */
    id?: string;

    /**
     * The organizer's name, if available.
     */
    displayName?: string;

    /**
     * The organizer's email address, if available. It must be a valid email address as
     * per RFC5322.
     */
    email?: string;

    /**
     * Whether the organizer corresponds to the calendar on which this copy of the
     * event appears. Read-only. The default is False.
     */
    self?: boolean;
  }

  /**
   * Information about the event's reminders for the authenticated user. Note that
   * changing reminders does not also change the updated property of the enclosing
   * event.
   */
  export interface Reminders {
    /**
     * If the event doesn't use the default reminders, this lists the reminders
     * specific to the event, or, if not set, indicates that no reminders are set for
     * this event. The maximum number of override reminders is 5.
     */
    overrides?: Array<unknown>;

    /**
     * Whether the default reminders of the calendar apply to the event.
     */
    useDefault?: boolean;
  }

  /**
   * Source from which the event was created. For example, a web page, an email
   * message or any document identifiable by an URL with HTTP or HTTPS scheme. Can
   * only be seen or modified by the creator of the event.
   */
  export interface Source {
    /**
     * Title of the source; for example a title of a web page or an email subject.
     */
    title?: string;

    /**
     * URL of the source pointing to a resource. The URL scheme must be HTTP or HTTPS.
     */
    url?: string;
  }
}

export interface EventListInstancesParams {
  /**
   * Path param:
   */
  calendarId: string;

  /**
   * Query param: Deprecated and ignored. A value will always be returned in the
   * email field for the organizer, creator and attendees, even if no real email
   * address is available (i.e. a generated, non-working value will be provided).
   */
  alwaysIncludeEmail?: boolean;

  /**
   * Query param: The maximum number of attendees to include in the response. If
   * there are more than the specified number of attendees, only the participant is
   * returned. Optional.
   */
  maxAttendees?: number;

  /**
   * Query param: Maximum number of events returned on one result page. By default
   * the value is 250 events. The page size can never be larger than 2500 events.
   * Optional.
   */
  maxResults?: number;

  /**
   * Query param: The original start time of the instance in the result. Optional.
   */
  originalStart?: string;

  /**
   * Query param: Token specifying which result page to return. Optional.
   */
  pageToken?: string;

  /**
   * Query param: Whether to include deleted events (with status equals "cancelled")
   * in the result. Cancelled instances of recurring events will still be included if
   * singleEvents is False. Optional. The default is False.
   */
  showDeleted?: boolean;

  /**
   * Query param: Upper bound (exclusive) for an event's start time to filter by.
   * Optional. The default is not to filter by start time. Must be an RFC3339
   * timestamp with mandatory time zone offset.
   */
  timeMax?: string;

  /**
   * Query param: Lower bound (inclusive) for an event's end time to filter by.
   * Optional. The default is not to filter by end time. Must be an RFC3339 timestamp
   * with mandatory time zone offset.
   */
  timeMin?: string;

  /**
   * Query param: Time zone used in the response. Optional. The default is the time
   * zone of the calendar.
   */
  timeZone?: string;
}

export interface EventMoveParams {
  /**
   * Path param:
   */
  calendarId: string;

  /**
   * Query param: Calendar identifier of the target calendar where the event is to be
   * moved to.
   */
  destination: string;

  /**
   * Query param: Deprecated. Please use sendUpdates instead.
   *
   * Whether to send notifications about the change of the event's organizer. Note
   * that some emails might still be sent even if you set the value to false. The
   * default is false.
   */
  sendNotifications?: boolean;

  /**
   * Query param: Guests who should receive notifications about the change of the
   * event's organizer.
   */
  sendUpdates?: string;
}

export interface EventQuickAddParams {
  /**
   * The text describing the event to be created.
   */
  text: string;

  /**
   * Deprecated. Please use sendUpdates instead.
   *
   * Whether to send notifications about the creation of the event. Note that some
   * emails might still be sent even if you set the value to false. The default is
   * false.
   */
  sendNotifications?: boolean;

  /**
   * Guests who should receive notifications about the creation of the new event.
   */
  sendUpdates?: string;
}

export interface EventUpdatePartialParams {
  /**
   * Path param:
   */
  calendarId: string;

  /**
   * Query param: Deprecated and ignored. A value will always be returned in the
   * email field for the organizer, creator and attendees, even if no real email
   * address is available (i.e. a generated, non-working value will be provided).
   */
  alwaysIncludeEmail?: boolean;

  /**
   * Query param: Version number of conference data supported by the API client.
   * Version 0 assumes no conference data support and ignores conference data in the
   * event's body. Version 1 enables support for copying of ConferenceData as well as
   * for creating new conferences using the createRequest field of conferenceData.
   * The default is 0.
   */
  conferenceDataVersion?: number;

  /**
   * Query param: The maximum number of attendees to include in the response. If
   * there are more than the specified number of attendees, only the participant is
   * returned. Optional.
   */
  maxAttendees?: number;

  /**
   * Query param: Deprecated. Please use sendUpdates instead.
   *
   * Whether to send notifications about the event update (for example, description
   * changes, etc.). Note that some emails might still be sent even if you set the
   * value to false. The default is false.
   */
  sendNotifications?: boolean;

  /**
   * Query param: Guests who should receive notifications about the event update (for
   * example, title changes, etc.).
   */
  sendUpdates?: string;

  /**
   * Query param: Whether API client performing operation supports event attachments.
   * Optional. The default is False.
   */
  supportsAttachments?: boolean;

  /**
   * Body param: Opaque identifier of the event. When creating new single or
   * recurring events, you can specify their IDs. Provided IDs must follow these
   * rules:
   *
   * - characters allowed in the ID are those used in base32hex encoding, i.e.
   *   lowercase letters a-v and digits 0-9, see section 3.1.2 in RFC2938
   * - the length of the ID must be between 5 and 1024 characters
   * - the ID must be unique per calendar Due to the globally distributed nature of
   *   the system, we cannot guarantee that ID collisions will be detected at event
   *   creation time. To minimize the risk of collisions we recommend using an
   *   established UUID algorithm such as one described in RFC4122. If you do not
   *   specify an ID, it will be automatically generated by the server. Note that the
   *   icalUID and the id are not identical and only one of them should be supplied
   *   at event creation time. One difference in their semantics is that in recurring
   *   events, all occurrences of one event have different ids while they all share
   *   the same icalUIDs.
   */
  id?: string;

  /**
   * Body param: Whether anyone can invite themselves to the event (deprecated).
   * Optional. The default is False.
   */
  anyoneCanAddSelf?: boolean;

  /**
   * Body param: File attachments for the event. In order to modify attachments the
   * supportsAttachments request parameter should be set to true. There can be at
   * most 25 attachments per event,
   */
  attachments?: Array<unknown>;

  /**
   * Body param: The attendees of the event. See the Events with attendees guide for
   * more information on scheduling events with other calendar users. Service
   * accounts need to use domain-wide delegation of authority to populate the
   * attendee list.
   */
  attendees?: Array<unknown>;

  /**
   * Body param: Whether attendees may have been omitted from the event's
   * representation. When retrieving an event, this may be due to a restriction
   * specified by the maxAttendee query parameter. When updating an event, this can
   * be used to only update the participant's response. Optional. The default is
   * False.
   */
  attendeesOmitted?: boolean;

  /**
   * Body param: Birthday or special event data. Used if eventType is "birthday".
   * Immutable.
   */
  birthdayProperties?: unknown;

  /**
   * Body param: The color of the event. This is an ID referring to an entry in the
   * event section of the colors definition (see the colors endpoint). Optional.
   */
  colorId?: string;

  /**
   * Body param: The conference-related information, such as details of a Google Meet
   * conference. To create new conference details use the createRequest field. To
   * persist your changes, remember to set the conferenceDataVersion request
   * parameter to 1 for all event modification requests.
   */
  conferenceData?: unknown;

  /**
   * Body param: Creation time of the event (as a RFC3339 timestamp). Read-only.
   */
  created?: string;

  /**
   * Body param: The creator of the event. Read-only.
   */
  creator?: EventUpdatePartialParams.Creator;

  /**
   * Body param: Description of the event. Can contain HTML. Optional.
   */
  description?: string;

  /**
   * Body param: The (exclusive) end time of the event. For a recurring event, this
   * is the end time of the first instance.
   */
  end?: unknown;

  /**
   * Body param: Whether the end time is actually unspecified. An end time is still
   * provided for compatibility reasons, even if this attribute is set to True. The
   * default is False.
   */
  endTimeUnspecified?: boolean;

  /**
   * Body param: ETag of the resource.
   */
  etag?: string;

  /**
   * Body param: Specific type of the event. This cannot be modified after the event
   * is created. Possible values are:
   *
   * - "birthday" - A special all-day event with an annual recurrence.
   * - "default" - A regular event or not further specified.
   * - "focusTime" - A focus-time event.
   * - "fromGmail" - An event from Gmail. This type of event cannot be created.
   * - "outOfOffice" - An out-of-office event.
   * - "workingLocation" - A working location event.
   */
  eventType?: string;

  /**
   * Body param: Extended properties of the event.
   */
  extendedProperties?: EventUpdatePartialParams.ExtendedProperties;

  /**
   * Body param: Focus Time event data. Used if eventType is focusTime.
   */
  focusTimeProperties?: unknown;

  /**
   * Body param: A gadget that extends this event. Gadgets are deprecated; this
   * structure is instead only used for returning birthday calendar metadata.
   */
  gadget?: EventUpdatePartialParams.Gadget;

  /**
   * Body param: Whether attendees other than the organizer can invite others to the
   * event. Optional. The default is True.
   */
  guestsCanInviteOthers?: boolean;

  /**
   * Body param: Whether attendees other than the organizer can modify the event.
   * Optional. The default is False.
   */
  guestsCanModify?: boolean;

  /**
   * Body param: Whether attendees other than the organizer can see who the event's
   * attendees are. Optional. The default is True.
   */
  guestsCanSeeOtherGuests?: boolean;

  /**
   * Body param: An absolute link to the Google Hangout associated with this event.
   * Read-only.
   */
  hangoutLink?: string;

  /**
   * Body param: An absolute link to this event in the Google Calendar Web UI.
   * Read-only.
   */
  htmlLink?: string;

  /**
   * Body param: Event unique identifier as defined in RFC5545. It is used to
   * uniquely identify events accross calendaring systems and must be supplied when
   * importing events via the import method. Note that the iCalUID and the id are not
   * identical and only one of them should be supplied at event creation time. One
   * difference in their semantics is that in recurring events, all occurrences of
   * one event have different ids while they all share the same iCalUIDs. To retrieve
   * an event using its iCalUID, call the events.list method using the iCalUID
   * parameter. To retrieve an event using its id, call the events.get method.
   */
  iCalUID?: string;

  /**
   * Body param: Type of the resource ("calendar#event").
   */
  kind?: string;

  /**
   * Body param: Geographic location of the event as free-form text. Optional.
   */
  location?: string;

  /**
   * Body param: Whether this is a locked event copy where no changes can be made to
   * the main event fields "summary", "description", "location", "start", "end" or
   * "recurrence". The default is False. Read-Only.
   */
  locked?: boolean;

  /**
   * Body param: The organizer of the event. If the organizer is also an attendee,
   * this is indicated with a separate entry in attendees with the organizer field
   * set to True. To change the organizer, use the move operation. Read-only, except
   * when importing an event.
   */
  organizer?: EventUpdatePartialParams.Organizer;

  /**
   * Body param: For an instance of a recurring event, this is the time at which this
   * event would start according to the recurrence data in the recurring event
   * identified by recurringEventId. It uniquely identifies the instance within the
   * recurring event series even if the instance was moved to a different time.
   * Immutable.
   */
  originalStartTime?: unknown;

  /**
   * Body param: Out of office event data. Used if eventType is outOfOffice.
   */
  outOfOfficeProperties?: unknown;

  /**
   * Body param: If set to True, Event propagation is disabled. Note that it is not
   * the same thing as Private event properties. Optional. Immutable. The default is
   * False.
   */
  privateCopy?: boolean;

  /**
   * Body param: List of RRULE, EXRULE, RDATE and EXDATE lines for a recurring event,
   * as specified in RFC5545. Note that DTSTART and DTEND lines are not allowed in
   * this field; event start and end times are specified in the start and end fields.
   * This field is omitted for single events or instances of recurring events.
   */
  recurrence?: Array<string>;

  /**
   * Body param: For an instance of a recurring event, this is the id of the
   * recurring event to which this instance belongs. Immutable.
   */
  recurringEventId?: string;

  /**
   * Body param: Information about the event's reminders for the authenticated user.
   * Note that changing reminders does not also change the updated property of the
   * enclosing event.
   */
  reminders?: EventUpdatePartialParams.Reminders;

  /**
   * Body param: Sequence number as per iCalendar.
   */
  sequence?: number;

  /**
   * Body param: Source from which the event was created. For example, a web page, an
   * email message or any document identifiable by an URL with HTTP or HTTPS scheme.
   * Can only be seen or modified by the creator of the event.
   */
  source?: EventUpdatePartialParams.Source;

  /**
   * Body param: The (inclusive) start time of the event. For a recurring event, this
   * is the start time of the first instance.
   */
  start?: unknown;

  /**
   * Body param: Status of the event. Optional. Possible values are:
   *
   * - "confirmed" - The event is confirmed. This is the default status.
   * - "tentative" - The event is tentatively confirmed.
   * - "cancelled" - The event is cancelled (deleted). The list method returns
   *   cancelled events only on incremental sync (when syncToken or updatedMin are
   *   specified) or if the showDeleted flag is set to true. The get method always
   *   returns them. A cancelled status represents two different states depending on
   *   the event type:
   * - Cancelled exceptions of an uncancelled recurring event indicate that this
   *   instance should no longer be presented to the user. Clients should store these
   *   events for the lifetime of the parent recurring event. Cancelled exceptions
   *   are only guaranteed to have values for the id, recurringEventId and
   *   originalStartTime fields populated. The other fields might be empty.
   * - All other cancelled events represent deleted events. Clients should remove
   *   their locally synced copies. Such cancelled events will eventually disappear,
   *   so do not rely on them being available indefinitely. Deleted events are only
   *   guaranteed to have the id field populated. On the organizer's calendar,
   *   cancelled events continue to expose event details (summary, location, etc.) so
   *   that they can be restored (undeleted). Similarly, the events to which the user
   *   was invited and that they manually removed continue to provide details.
   *   However, incremental sync requests with showDeleted set to false will not
   *   return these details. If an event changes its organizer (for example via the
   *   move operation) and the original organizer is not on the attendee list, it
   *   will leave behind a cancelled event where only the id field is guaranteed to
   *   be populated.
   */
  status?: string;

  /**
   * Body param: Title of the event.
   */
  summary?: string;

  /**
   * Body param: Whether the event blocks time on the calendar. Optional. Possible
   * values are:
   *
   * - "opaque" - Default value. The event does block time on the calendar. This is
   *   equivalent to setting Show me as to Busy in the Calendar UI.
   * - "transparent" - The event does not block time on the calendar. This is
   *   equivalent to setting Show me as to Available in the Calendar UI.
   */
  transparency?: string;

  /**
   * Body param: Last modification time of the main event data (as a RFC3339
   * timestamp). Updating event reminders will not cause this to change. Read-only.
   */
  updated?: string;

  /**
   * Body param: Visibility of the event. Optional. Possible values are:
   *
   * - "default" - Uses the default visibility for events on the calendar. This is
   *   the default value.
   * - "public" - The event is public and event details are visible to all readers of
   *   the calendar.
   * - "private" - The event is private and only event attendees may view event
   *   details.
   * - "confidential" - The event is private. This value is provided for
   *   compatibility reasons.
   */
  visibility?: string;

  /**
   * Body param: Working location event data.
   */
  workingLocationProperties?: unknown;
}

export namespace EventUpdatePartialParams {
  /**
   * The creator of the event. Read-only.
   */
  export interface Creator {
    /**
     * The creator's Profile ID, if available.
     */
    id?: string;

    /**
     * The creator's name, if available.
     */
    displayName?: string;

    /**
     * The creator's email address, if available.
     */
    email?: string;

    /**
     * Whether the creator corresponds to the calendar on which this copy of the event
     * appears. Read-only. The default is False.
     */
    self?: boolean;
  }

  /**
   * Extended properties of the event.
   */
  export interface ExtendedProperties {
    /**
     * Properties that are private to the copy of the event that appears on this
     * calendar.
     */
    private?: unknown;

    /**
     * Properties that are shared between copies of the event on other attendees'
     * calendars.
     */
    shared?: unknown;
  }

  /**
   * A gadget that extends this event. Gadgets are deprecated; this structure is
   * instead only used for returning birthday calendar metadata.
   */
  export interface Gadget {
    /**
     * The gadget's display mode. Deprecated. Possible values are:
     *
     * - "icon" - The gadget displays next to the event's title in the calendar view.
     * - "chip" - The gadget displays when the event is clicked.
     */
    display?: string;

    /**
     * The gadget's height in pixels. The height must be an integer greater than 0.
     * Optional. Deprecated.
     */
    height?: number;

    /**
     * The gadget's icon URL. The URL scheme must be HTTPS. Deprecated.
     */
    iconLink?: string;

    /**
     * The gadget's URL. The URL scheme must be HTTPS. Deprecated.
     */
    link?: string;

    /**
     * Preferences.
     */
    preferences?: unknown;

    /**
     * The gadget's title. Deprecated.
     */
    title?: string;

    /**
     * The gadget's type. Deprecated.
     */
    type?: string;

    /**
     * The gadget's width in pixels. The width must be an integer greater than 0.
     * Optional. Deprecated.
     */
    width?: number;
  }

  /**
   * The organizer of the event. If the organizer is also an attendee, this is
   * indicated with a separate entry in attendees with the organizer field set to
   * True. To change the organizer, use the move operation. Read-only, except when
   * importing an event.
   */
  export interface Organizer {
    /**
     * The organizer's Profile ID, if available.
     */
    id?: string;

    /**
     * The organizer's name, if available.
     */
    displayName?: string;

    /**
     * The organizer's email address, if available. It must be a valid email address as
     * per RFC5322.
     */
    email?: string;

    /**
     * Whether the organizer corresponds to the calendar on which this copy of the
     * event appears. Read-only. The default is False.
     */
    self?: boolean;
  }

  /**
   * Information about the event's reminders for the authenticated user. Note that
   * changing reminders does not also change the updated property of the enclosing
   * event.
   */
  export interface Reminders {
    /**
     * If the event doesn't use the default reminders, this lists the reminders
     * specific to the event, or, if not set, indicates that no reminders are set for
     * this event. The maximum number of override reminders is 5.
     */
    overrides?: Array<unknown>;

    /**
     * Whether the default reminders of the calendar apply to the event.
     */
    useDefault?: boolean;
  }

  /**
   * Source from which the event was created. For example, a web page, an email
   * message or any document identifiable by an URL with HTTP or HTTPS scheme. Can
   * only be seen or modified by the creator of the event.
   */
  export interface Source {
    /**
     * Title of the source; for example a title of a web page or an email subject.
     */
    title?: string;

    /**
     * URL of the source pointing to a resource. The URL scheme must be HTTP or HTTPS.
     */
    url?: string;
  }
}

export interface EventWatchParams {
  /**
   * Query param: Deprecated and ignored.
   */
  alwaysIncludeEmail?: boolean;

  /**
   * Query param: Event types to return. Optional. This parameter can be repeated
   * multiple times to return events of different types. If unset, returns all event
   * types.
   */
  eventTypes?: string;

  /**
   * Query param: Specifies an event ID in the iCalendar format to be provided in the
   * response. Optional. Use this if you want to search for an event by its iCalendar
   * ID.
   */
  iCalUID?: string;

  /**
   * Query param: The maximum number of attendees to include in the response. If
   * there are more than the specified number of attendees, only the participant is
   * returned. Optional.
   */
  maxAttendees?: number;

  /**
   * Query param: Maximum number of events returned on one result page. The number of
   * events in the resulting page may be less than this value, or none at all, even
   * if there are more events matching the query. Incomplete pages can be detected by
   * a non-empty nextPageToken field in the response. By default the value is 250
   * events. The page size can never be larger than 2500 events. Optional.
   */
  maxResults?: number;

  /**
   * Query param: The order of the events returned in the result. Optional. The
   * default is an unspecified, stable order.
   */
  orderBy?: string;

  /**
   * Query param: Token specifying which result page to return. Optional.
   */
  pageToken?: string;

  /**
   * Query param: Extended properties constraint specified as propertyName=value.
   * Matches only private properties. This parameter might be repeated multiple times
   * to return events that match all given constraints.
   */
  privateExtendedProperty?: string;

  /**
   * Query param: Free text search terms to find events that match these terms in the
   * following fields:
   *
   * - summary
   * - description
   * - location
   * - attendee's displayName
   * - attendee's email
   * - organizer's displayName
   * - organizer's email
   * - workingLocationProperties.officeLocation.buildingId
   * - workingLocationProperties.officeLocation.deskId
   * - workingLocationProperties.officeLocation.label
   * - workingLocationProperties.customLocation.label These search terms also match
   *   predefined keywords against all display title translations of working
   *   location, out-of-office, and focus-time events. For example, searching for
   *   "Office" or "Bureau" returns working location events of type officeLocation,
   *   whereas searching for "Out of office" or "Abwesend" returns out-of-office
   *   events. Optional.
   */
  q?: string;

  /**
   * Query param: Extended properties constraint specified as propertyName=value.
   * Matches only shared properties. This parameter might be repeated multiple times
   * to return events that match all given constraints.
   */
  sharedExtendedProperty?: string;

  /**
   * Query param: Whether to include deleted events (with status equals "cancelled")
   * in the result. Cancelled instances of recurring events (but not the underlying
   * recurring event) will still be included if showDeleted and singleEvents are both
   * False. If showDeleted and singleEvents are both True, only single instances of
   * deleted events (but not the underlying recurring events) are returned. Optional.
   * The default is False.
   */
  showDeleted?: boolean;

  /**
   * Query param: Whether to include hidden invitations in the result. Optional. The
   * default is False.
   */
  showHiddenInvitations?: boolean;

  /**
   * Query param: Whether to expand recurring events into instances and only return
   * single one-off events and instances of recurring events, but not the underlying
   * recurring events themselves. Optional. The default is False.
   */
  singleEvents?: boolean;

  /**
   * Query param: Token obtained from the nextSyncToken field returned on the last
   * page of results from the previous list request. It makes the result of this list
   * request contain only entries that have changed since then. All events deleted
   * since the previous list request will always be in the result set and it is not
   * allowed to set showDeleted to False. There are several query parameters that
   * cannot be specified together with nextSyncToken to ensure consistency of the
   * client state.
   *
   * These are:
   *
   * - iCalUID
   * - orderBy
   * - privateExtendedProperty
   * - q
   * - sharedExtendedProperty
   * - timeMin
   * - timeMax
   * - updatedMin All other query parameters should be the same as for the initial
   *   synchronization to avoid undefined behavior. If the syncToken expires, the
   *   server will respond with a 410 GONE response code and the client should clear
   *   its storage and perform a full synchronization without any syncToken. Learn
   *   more about incremental synchronization. Optional. The default is to return all
   *   entries.
   */
  syncToken?: string;

  /**
   * Query param: Upper bound (exclusive) for an event's start time to filter by.
   * Optional. The default is not to filter by start time. Must be an RFC3339
   * timestamp with mandatory time zone offset, for example,
   * 2011-06-03T10:00:00-07:00, 2011-06-03T10:00:00Z. Milliseconds may be provided
   * but are ignored. If timeMin is set, timeMax must be greater than timeMin.
   */
  timeMax?: string;

  /**
   * Query param: Lower bound (exclusive) for an event's end time to filter by.
   * Optional. The default is not to filter by end time. Must be an RFC3339 timestamp
   * with mandatory time zone offset, for example, 2011-06-03T10:00:00-07:00,
   * 2011-06-03T10:00:00Z. Milliseconds may be provided but are ignored. If timeMax
   * is set, timeMin must be smaller than timeMax.
   */
  timeMin?: string;

  /**
   * Query param: Time zone used in the response. Optional. The default is the time
   * zone of the calendar.
   */
  timeZone?: string;

  /**
   * Query param: Lower bound for an event's last modification time (as a RFC3339
   * timestamp) to filter by. When specified, entries deleted since this time will
   * always be included regardless of showDeleted. Optional. The default is not to
   * filter by last modification time.
   */
  updatedMin?: string;

  /**
   * Body param: A UUID or similar unique string that identifies this channel.
   */
  id?: string;

  /**
   * Body param: An arbitrary string delivered to the target address with each
   * notification delivered over this channel. Optional.
   */
  token?: string;

  /**
   * Body param: The address where notifications are delivered for this channel.
   */
  address?: string;

  /**
   * Body param: Date and time of notification channel expiration, expressed as a
   * Unix timestamp, in milliseconds. Optional.
   */
  expiration?: string;

  /**
   * Body param: Identifies this as a notification channel used to watch for changes
   * to a resource, which is "api#channel".
   */
  kind?: string;

  /**
   * Body param: Additional parameters controlling delivery channel behavior.
   * Optional.
   */
  params?: unknown;

  /**
   * Body param: A Boolean value to indicate whether payload is wanted. Optional.
   */
  payload?: boolean;

  /**
   * Body param: An opaque ID that identifies the resource being watched on this
   * channel. Stable across different API versions.
   */
  resourceId?: string;

  /**
   * Body param: A version-specific identifier for the watched resource.
   */
  resourceUri?: string;

  /**
   * Body param: The type of delivery mechanism used for this channel. Valid values
   * are "web_hook" (or "webhook"). Both values refer to a channel where Http
   * requests are used to deliver messages.
   */
  type?: string;
}

export declare namespace Events {
  export {
    type Event as Event,
    type Events as Events,
    type EventCreateParams as EventCreateParams,
    type EventRetrieveParams as EventRetrieveParams,
    type EventUpdateParams as EventUpdateParams,
    type EventListParams as EventListParams,
    type EventDeleteParams as EventDeleteParams,
    type EventImportParams as EventImportParams,
    type EventListInstancesParams as EventListInstancesParams,
    type EventMoveParams as EventMoveParams,
    type EventQuickAddParams as EventQuickAddParams,
    type EventUpdatePartialParams as EventUpdatePartialParams,
    type EventWatchParams as EventWatchParams,
  };
}
