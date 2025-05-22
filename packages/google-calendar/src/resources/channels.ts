// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIPromise } from "../core/api-promise";
import { APIResource } from "../core/resource";
import { buildHeaders } from "../internal/headers";
import { type RequestOptions } from "../internal/request-options";

export class Channels extends APIResource {
  /**
   * Stop watching resources through this channel
   */
  stopWatching(
    body: ChannelStopWatchingParams,
    options?: RequestOptions
  ): APIPromise<void> {
    return this._client.post("/channels/stop", {
      body,
      ...options,
      headers: buildHeaders([{ Accept: "*/*" }, options?.headers]),
    });
  }
}

export interface ChannelStopWatchingParams {
  /**
   * A UUID or similar unique string that identifies this channel.
   */
  id?: string;

  /**
   * An arbitrary string delivered to the target address with each notification
   * delivered over this channel. Optional.
   */
  token?: string;

  /**
   * The address where notifications are delivered for this channel.
   */
  address?: string;

  /**
   * Date and time of notification channel expiration, expressed as a Unix timestamp,
   * in milliseconds. Optional.
   */
  expiration?: string;

  /**
   * Identifies this as a notification channel used to watch for changes to a
   * resource, which is "api#channel".
   */
  kind?: string;

  /**
   * Additional parameters controlling delivery channel behavior. Optional.
   */
  params?: unknown;

  /**
   * A Boolean value to indicate whether payload is wanted. Optional.
   */
  payload?: boolean;

  /**
   * An opaque ID that identifies the resource being watched on this channel. Stable
   * across different API versions.
   */
  resourceId?: string;

  /**
   * A version-specific identifier for the watched resource.
   */
  resourceUri?: string;

  /**
   * The type of delivery mechanism used for this channel. Valid values are
   * "web_hook" (or "webhook"). Both values refer to a channel where Http requests
   * are used to deliver messages.
   */
  type?: string;
}

export declare namespace Channels {
  export { type ChannelStopWatchingParams as ChannelStopWatchingParams };
}
