// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIPromise } from "../core/api-promise";
import { APIResource } from "../core/resource";
import { type RequestOptions } from "../internal/request-options";

export class Colors extends APIResource {
  /**
   * Returns the color definitions for calendars and events.
   */
  list(options?: RequestOptions): APIPromise<ColorListResponse> {
    return this._client.get("/colors", options);
  }
}

export interface ColorListResponse {
  /**
   * A global palette of calendar colors, mapping from the color ID to its
   * definition. A calendarListEntry resource refers to one of these color IDs in its
   * colorId field. Read-only.
   */
  calendar?: unknown;

  /**
   * A global palette of event colors, mapping from the color ID to its definition.
   * An event resource may refer to one of these color IDs in its colorId field.
   * Read-only.
   */
  event?: unknown;

  /**
   * Type of the resource ("calendar#colors").
   */
  kind?: string;

  /**
   * Last modification time of the color palette (as a RFC3339 timestamp). Read-only.
   */
  updated?: string;
}

export declare namespace Colors {
  export { type ColorListResponse as ColorListResponse };
}
