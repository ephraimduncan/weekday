// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIPromise } from "../../../core/api-promise";
import { APIResource } from "../../../core/resource";
import { type RequestOptions } from "../../../internal/request-options";
import { path } from "../../../internal/utils/path";
import * as ACLAPI from "../../calendars/acl";

export class Settings extends APIResource {
  /**
   * Returns a single user setting.
   */
  retrieve(
    setting: string,
    options?: RequestOptions
  ): APIPromise<SettingRetrieveResponse> {
    return this._client.get(path`/users/me/settings/${setting}`, options);
  }

  /**
   * Returns all user settings for the authenticated user.
   */
  list(
    query: SettingListParams | null | undefined = {},
    options?: RequestOptions
  ): APIPromise<SettingListResponse> {
    return this._client.get("/users/me/settings", { query, ...options });
  }

  /**
   * Watch for changes to Settings resources.
   */
  watch(
    params: SettingWatchParams,
    options?: RequestOptions
  ): APIPromise<ACLAPI.Channel> {
    const { maxResults, pageToken, syncToken, ...body } = params;
    return this._client.post("/users/me/settings/watch", {
      query: { maxResults, pageToken, syncToken },
      body,
      ...options,
    });
  }
}

export interface SettingRetrieveResponse {
  /**
   * The id of the user setting.
   */
  id?: string;

  /**
   * ETag of the resource.
   */
  etag?: string;

  /**
   * Type of the resource ("calendar#setting").
   */
  kind?: string;

  /**
   * Value of the user setting. The format of the value depends on the ID of the
   * setting. It must always be a UTF-8 string of length up to 1024 characters.
   */
  value?: string;
}

export interface SettingListResponse {
  /**
   * Etag of the collection.
   */
  etag?: string;

  /**
   * List of user settings.
   */
  items?: Array<unknown>;

  /**
   * Type of the collection ("calendar#settings").
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
}

export interface SettingListParams {
  /**
   * Maximum number of entries returned on one result page. By default the value is
   * 100 entries. The page size can never be larger than 250 entries. Optional.
   */
  maxResults?: number;

  /**
   * Token specifying which result page to return. Optional.
   */
  pageToken?: string;

  /**
   * Token obtained from the nextSyncToken field returned on the last page of results
   * from the previous list request. It makes the result of this list request contain
   * only entries that have changed since then. If the syncToken expires, the server
   * will respond with a 410 GONE response code and the client should clear its
   * storage and perform a full synchronization without any syncToken. Learn more
   * about incremental synchronization. Optional. The default is to return all
   * entries.
   */
  syncToken?: string;
}

export interface SettingWatchParams {
  /**
   * Query param: Maximum number of entries returned on one result page. By default
   * the value is 100 entries. The page size can never be larger than 250 entries.
   * Optional.
   */
  maxResults?: number;

  /**
   * Query param: Token specifying which result page to return. Optional.
   */
  pageToken?: string;

  /**
   * Query param: Token obtained from the nextSyncToken field returned on the last
   * page of results from the previous list request. It makes the result of this list
   * request contain only entries that have changed since then. If the syncToken
   * expires, the server will respond with a 410 GONE response code and the client
   * should clear its storage and perform a full synchronization without any
   * syncToken. Learn more about incremental synchronization. Optional. The default
   * is to return all entries.
   */
  syncToken?: string;

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

export declare namespace Settings {
  export {
    type SettingRetrieveResponse as SettingRetrieveResponse,
    type SettingListResponse as SettingListResponse,
    type SettingListParams as SettingListParams,
    type SettingWatchParams as SettingWatchParams,
  };
}
