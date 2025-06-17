// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIPromise } from "../core/api-promise";
import { APIResource } from "../core/resource";
import { type RequestOptions } from "../internal/request-options";

export class FreeBusy extends APIResource {
  /**
   * Returns free/busy information for a set of calendars.
   */
  checkAvailability(
    body: FreeBusyCheckAvailabilityParams,
    options?: RequestOptions,
  ): APIPromise<FreeBusyCheckAvailabilityResponse> {
    return this._client.post("/freeBusy", { body, ...options });
  }
}

export interface FreeBusyCheckAvailabilityResponse {
  /**
   * List of free/busy information for calendars.
   */
  calendars?: unknown;

  /**
   * Expansion of groups.
   */
  groups?: unknown;

  /**
   * Type of the resource ("calendar#freeBusy").
   */
  kind?: string;

  /**
   * The end of the interval.
   */
  timeMax?: string;

  /**
   * The start of the interval.
   */
  timeMin?: string;
}

export interface FreeBusyCheckAvailabilityParams {
  /**
   * Maximal number of calendars for which FreeBusy information is to be provided.
   * Optional. Maximum value is 50.
   */
  calendarExpansionMax?: number;

  /**
   * Maximal number of calendar identifiers to be provided for a single group.
   * Optional. An error is returned for a group with more members than this value.
   * Maximum value is 100.
   */
  groupExpansionMax?: number;

  /**
   * List of calendars and/or groups to query.
   */
  items?: Array<unknown>;

  /**
   * The end of the interval for the query formatted as per RFC3339.
   */
  timeMax?: string;

  /**
   * The start of the interval for the query formatted as per RFC3339.
   */
  timeMin?: string;

  /**
   * Time zone used in the response. Optional. The default is UTC.
   */
  timeZone?: string;
}

export declare namespace FreeBusy {
  export {
    type FreeBusyCheckAvailabilityResponse as FreeBusyCheckAvailabilityResponse,
    type FreeBusyCheckAvailabilityParams as FreeBusyCheckAvailabilityParams,
  };
}
