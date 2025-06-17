// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIPromise } from "../../core/api-promise";
import { APIResource } from "../../core/resource";
import { buildHeaders } from "../../internal/headers";
import { type RequestOptions } from "../../internal/request-options";
import { path } from "../../internal/utils/path";
import * as ACLAPI from "./acl";
import {
  ACL,
  type ACLCreateRuleParams,
  type ACLDeleteRuleParams,
  type ACLListRulesParams,
  type ACLListRulesResponse,
  type ACLRetrieveRuleParams,
  type ACLRule,
  type ACLUpdateRuleFullParams,
  type ACLUpdateRuleParams,
  type ACLWatchRulesParams,
  type Channel,
} from "./acl";
import * as EventsAPI from "./events";
import {
  type Event,
  type EventCreateParams,
  type EventDeleteParams,
  type EventImportParams,
  type EventListInstancesParams,
  type EventListParams,
  type EventMoveParams,
  type EventQuickAddParams,
  type EventRetrieveParams,
  type EventUpdateParams,
  type EventUpdatePartialParams,
  type EventWatchParams,
  type Events,
} from "./events";

export class Calendars extends APIResource {
  acl: ACLAPI.ACL = new ACLAPI.ACL(this._client);
  events: EventsAPI.Events = new EventsAPI.Events(this._client);

  /**
   * Creates a secondary calendar.
   */
  create(
    body: CalendarCreateParams,
    options?: RequestOptions,
  ): APIPromise<Calendar> {
    return this._client.post("/calendars", { body, ...options });
  }

  /**
   * Returns metadata for a calendar.
   */
  retrieve(calendarID: string, options?: RequestOptions): APIPromise<Calendar> {
    return this._client.get(path`/calendars/${calendarID}`, options);
  }

  /**
   * Updates metadata for a calendar.
   */
  update(
    calendarID: string,
    body: CalendarUpdateParams,
    options?: RequestOptions,
  ): APIPromise<Calendar> {
    return this._client.put(path`/calendars/${calendarID}`, {
      body,
      ...options,
    });
  }

  /**
   * Deletes a secondary calendar. Use calendars.clear for clearing all events on
   * primary calendars.
   */
  delete(calendarID: string, options?: RequestOptions): APIPromise<void> {
    return this._client.delete(path`/calendars/${calendarID}`, {
      ...options,
      headers: buildHeaders([{ Accept: "*/*" }, options?.headers]),
    });
  }

  /**
   * Clears a primary calendar. This operation deletes all events associated with the
   * primary calendar of an account.
   */
  clear(calendarID: string, options?: RequestOptions): APIPromise<void> {
    return this._client.post(path`/calendars/${calendarID}/clear`, {
      ...options,
      headers: buildHeaders([{ Accept: "*/*" }, options?.headers]),
    });
  }

  /**
   * Updates metadata for a calendar. This method supports patch semantics.
   */
  updatePartial(
    calendarID: string,
    body: CalendarUpdatePartialParams,
    options?: RequestOptions,
  ): APIPromise<Calendar> {
    return this._client.patch(path`/calendars/${calendarID}`, {
      body,
      ...options,
    });
  }
}

export interface Calendar {
  /**
   * Identifier of the calendar. To retrieve IDs call the calendarList.list() method.
   */
  id?: string;

  /**
   * Conferencing properties for this calendar, for example what types of conferences
   * are allowed.
   */
  conferenceProperties?: unknown;

  /**
   * Description of the calendar. Optional.
   */
  description?: string;

  /**
   * ETag of the resource.
   */
  etag?: string;

  /**
   * Type of the resource ("calendar#calendar").
   */
  kind?: string;

  /**
   * Geographic location of the calendar as free-form text. Optional.
   */
  location?: string;

  /**
   * Title of the calendar.
   */
  summary?: string;

  /**
   * The time zone of the calendar. (Formatted as an IANA Time Zone Database name,
   * e.g. "Europe/Zurich".) Optional.
   */
  timeZone?: string;
}

export interface CalendarCreateParams {
  /**
   * Identifier of the calendar. To retrieve IDs call the calendarList.list() method.
   */
  id?: string;

  /**
   * Conferencing properties for this calendar, for example what types of conferences
   * are allowed.
   */
  conferenceProperties?: unknown;

  /**
   * Description of the calendar. Optional.
   */
  description?: string;

  /**
   * ETag of the resource.
   */
  etag?: string;

  /**
   * Type of the resource ("calendar#calendar").
   */
  kind?: string;

  /**
   * Geographic location of the calendar as free-form text. Optional.
   */
  location?: string;

  /**
   * Title of the calendar.
   */
  summary?: string;

  /**
   * The time zone of the calendar. (Formatted as an IANA Time Zone Database name,
   * e.g. "Europe/Zurich".) Optional.
   */
  timeZone?: string;
}

export interface CalendarUpdateParams {
  /**
   * Identifier of the calendar. To retrieve IDs call the calendarList.list() method.
   */
  id?: string;

  /**
   * Conferencing properties for this calendar, for example what types of conferences
   * are allowed.
   */
  conferenceProperties?: unknown;

  /**
   * Description of the calendar. Optional.
   */
  description?: string;

  /**
   * ETag of the resource.
   */
  etag?: string;

  /**
   * Type of the resource ("calendar#calendar").
   */
  kind?: string;

  /**
   * Geographic location of the calendar as free-form text. Optional.
   */
  location?: string;

  /**
   * Title of the calendar.
   */
  summary?: string;

  /**
   * The time zone of the calendar. (Formatted as an IANA Time Zone Database name,
   * e.g. "Europe/Zurich".) Optional.
   */
  timeZone?: string;
}

export interface CalendarUpdatePartialParams {
  /**
   * Identifier of the calendar. To retrieve IDs call the calendarList.list() method.
   */
  id?: string;

  /**
   * Conferencing properties for this calendar, for example what types of conferences
   * are allowed.
   */
  conferenceProperties?: unknown;

  /**
   * Description of the calendar. Optional.
   */
  description?: string;

  /**
   * ETag of the resource.
   */
  etag?: string;

  /**
   * Type of the resource ("calendar#calendar").
   */
  kind?: string;

  /**
   * Geographic location of the calendar as free-form text. Optional.
   */
  location?: string;

  /**
   * Title of the calendar.
   */
  summary?: string;

  /**
   * The time zone of the calendar. (Formatted as an IANA Time Zone Database name,
   * e.g. "Europe/Zurich".) Optional.
   */
  timeZone?: string;
}

Calendars.ACL = ACL;

export declare namespace Calendars {
  export {
    type Calendar as Calendar,
    type CalendarCreateParams as CalendarCreateParams,
    type CalendarUpdateParams as CalendarUpdateParams,
    type CalendarUpdatePartialParams as CalendarUpdatePartialParams,
  };

  export {
    ACL as ACL,
    type ACLRule as ACLRule,
    type Channel as Channel,
    type ACLListRulesResponse as ACLListRulesResponse,
    type ACLCreateRuleParams as ACLCreateRuleParams,
    type ACLDeleteRuleParams as ACLDeleteRuleParams,
    type ACLListRulesParams as ACLListRulesParams,
    type ACLRetrieveRuleParams as ACLRetrieveRuleParams,
    type ACLUpdateRuleParams as ACLUpdateRuleParams,
    type ACLUpdateRuleFullParams as ACLUpdateRuleFullParams,
    type ACLWatchRulesParams as ACLWatchRulesParams,
  };

  export {
    type Events as Events,
    type Event as Event,
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
