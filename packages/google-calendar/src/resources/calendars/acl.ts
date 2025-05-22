// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { buildHeaders } from '../../internal/headers';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

export class ACL extends APIResource {
  /**
   * Creates an access control rule.
   */
  createRule(calendarID: string, params: ACLCreateRuleParams, options?: RequestOptions): APIPromise<ACLRule> {
    const { sendNotifications, ...body } = params;
    return this._client.post(path`/calendars/${calendarID}/acl`, {
      query: { sendNotifications },
      body,
      ...options,
    });
  }

  /**
   * Deletes an access control rule.
   */
  deleteRule(ruleID: string, params: ACLDeleteRuleParams, options?: RequestOptions): APIPromise<void> {
    const { calendarId } = params;
    return this._client.delete(path`/calendars/${calendarId}/acl/${ruleID}`, {
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Returns the rules in the access control list for the calendar.
   */
  listRules(
    calendarID: string,
    query: ACLListRulesParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<ACLListRulesResponse> {
    return this._client.get(path`/calendars/${calendarID}/acl`, { query, ...options });
  }

  /**
   * Returns an access control rule.
   */
  retrieveRule(ruleID: string, params: ACLRetrieveRuleParams, options?: RequestOptions): APIPromise<ACLRule> {
    const { calendarId } = params;
    return this._client.get(path`/calendars/${calendarId}/acl/${ruleID}`, options);
  }

  /**
   * Updates an access control rule. This method supports patch semantics.
   */
  updateRule(ruleID: string, params: ACLUpdateRuleParams, options?: RequestOptions): APIPromise<ACLRule> {
    const { calendarId, sendNotifications, ...body } = params;
    return this._client.patch(path`/calendars/${calendarId}/acl/${ruleID}`, {
      query: { sendNotifications },
      body,
      ...options,
    });
  }

  /**
   * Updates an access control rule.
   */
  updateRuleFull(
    ruleID: string,
    params: ACLUpdateRuleFullParams,
    options?: RequestOptions,
  ): APIPromise<ACLRule> {
    const { calendarId, sendNotifications, ...body } = params;
    return this._client.put(path`/calendars/${calendarId}/acl/${ruleID}`, {
      query: { sendNotifications },
      body,
      ...options,
    });
  }

  /**
   * Watch for changes to ACL resources.
   */
  watchRules(calendarID: string, params: ACLWatchRulesParams, options?: RequestOptions): APIPromise<Channel> {
    const { maxResults, pageToken, showDeleted, syncToken, ...body } = params;
    return this._client.post(path`/calendars/${calendarID}/acl/watch`, {
      query: { maxResults, pageToken, showDeleted, syncToken },
      body,
      ...options,
    });
  }
}

export interface ACLRule {
  /**
   * Identifier of the Access Control List (ACL) rule. See Sharing calendars.
   */
  id?: string;

  /**
   * ETag of the resource.
   */
  etag?: string;

  /**
   * Type of the resource ("calendar#aclRule").
   */
  kind?: string;

  /**
   * The role assigned to the scope. Possible values are:
   *
   * - "none" - Provides no access.
   * - "freeBusyReader" - Provides read access to free/busy information.
   * - "reader" - Provides read access to the calendar. Private events will appear to
   *   users with reader access, but event details will be hidden.
   * - "writer" - Provides read and write access to the calendar. Private events will
   *   appear to users with writer access, and event details will be visible.
   *   Provides read access to the calendar's ACLs.
   * - "owner" - Provides ownership of the calendar. This role has all of the
   *   permissions of the writer role with the additional ability to manipulate ACLs.
   */
  role?: string;

  /**
   * The extent to which calendar access is granted by this ACL rule.
   */
  scope?: ACLRule.Scope;
}

export namespace ACLRule {
  /**
   * The extent to which calendar access is granted by this ACL rule.
   */
  export interface Scope {
    /**
     * The type of the scope. Possible values are:
     *
     * - "default" - The public scope. This is the default value.
     * - "user" - Limits the scope to a single user.
     * - "group" - Limits the scope to a group.
     * - "domain" - Limits the scope to a domain. Note: The permissions granted to the
     *   "default", or public, scope apply to any user, authenticated or not.
     */
    type?: string;

    /**
     * The email address of a user or group, or the name of a domain, depending on the
     * scope type. Omitted for type "default".
     */
    value?: string;
  }
}

export interface Channel {
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

export interface ACLListRulesResponse {
  /**
   * ETag of the collection.
   */
  etag?: string;

  /**
   * List of rules on the access control list.
   */
  items?: Array<unknown>;

  /**
   * Type of the collection ("calendar#acl").
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

export interface ACLCreateRuleParams {
  /**
   * Query param: Whether to send notifications about the calendar sharing change.
   * Optional. The default is True.
   */
  sendNotifications?: boolean;

  /**
   * Body param: Identifier of the Access Control List (ACL) rule. See Sharing
   * calendars.
   */
  id?: string;

  /**
   * Body param: ETag of the resource.
   */
  etag?: string;

  /**
   * Body param: Type of the resource ("calendar#aclRule").
   */
  kind?: string;

  /**
   * Body param: The role assigned to the scope. Possible values are:
   *
   * - "none" - Provides no access.
   * - "freeBusyReader" - Provides read access to free/busy information.
   * - "reader" - Provides read access to the calendar. Private events will appear to
   *   users with reader access, but event details will be hidden.
   * - "writer" - Provides read and write access to the calendar. Private events will
   *   appear to users with writer access, and event details will be visible.
   *   Provides read access to the calendar's ACLs.
   * - "owner" - Provides ownership of the calendar. This role has all of the
   *   permissions of the writer role with the additional ability to manipulate ACLs.
   */
  role?: string;

  /**
   * Body param: The extent to which calendar access is granted by this ACL rule.
   */
  scope?: ACLCreateRuleParams.Scope;
}

export namespace ACLCreateRuleParams {
  /**
   * The extent to which calendar access is granted by this ACL rule.
   */
  export interface Scope {
    /**
     * The type of the scope. Possible values are:
     *
     * - "default" - The public scope. This is the default value.
     * - "user" - Limits the scope to a single user.
     * - "group" - Limits the scope to a group.
     * - "domain" - Limits the scope to a domain. Note: The permissions granted to the
     *   "default", or public, scope apply to any user, authenticated or not.
     */
    type?: string;

    /**
     * The email address of a user or group, or the name of a domain, depending on the
     * scope type. Omitted for type "default".
     */
    value?: string;
  }
}

export interface ACLDeleteRuleParams {
  calendarId: string;
}

export interface ACLListRulesParams {
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
   * Whether to include deleted ACLs in the result. Deleted ACLs are represented by
   * role equal to "none". Deleted ACLs will always be included if syncToken is
   * provided. Optional. The default is False.
   */
  showDeleted?: boolean;

  /**
   * Token obtained from the nextSyncToken field returned on the last page of results
   * from the previous list request. It makes the result of this list request contain
   * only entries that have changed since then. All entries deleted since the
   * previous list request will always be in the result set and it is not allowed to
   * set showDeleted to False. If the syncToken expires, the server will respond with
   * a 410 GONE response code and the client should clear its storage and perform a
   * full synchronization without any syncToken. Learn more about incremental
   * synchronization. Optional. The default is to return all entries.
   */
  syncToken?: string;
}

export interface ACLRetrieveRuleParams {
  calendarId: string;
}

export interface ACLUpdateRuleParams {
  /**
   * Path param:
   */
  calendarId: string;

  /**
   * Query param: Whether to send notifications about the calendar sharing change.
   * Note that there are no notifications on access removal. Optional. The default is
   * True.
   */
  sendNotifications?: boolean;

  /**
   * Body param: Identifier of the Access Control List (ACL) rule. See Sharing
   * calendars.
   */
  id?: string;

  /**
   * Body param: ETag of the resource.
   */
  etag?: string;

  /**
   * Body param: Type of the resource ("calendar#aclRule").
   */
  kind?: string;

  /**
   * Body param: The role assigned to the scope. Possible values are:
   *
   * - "none" - Provides no access.
   * - "freeBusyReader" - Provides read access to free/busy information.
   * - "reader" - Provides read access to the calendar. Private events will appear to
   *   users with reader access, but event details will be hidden.
   * - "writer" - Provides read and write access to the calendar. Private events will
   *   appear to users with writer access, and event details will be visible.
   *   Provides read access to the calendar's ACLs.
   * - "owner" - Provides ownership of the calendar. This role has all of the
   *   permissions of the writer role with the additional ability to manipulate ACLs.
   */
  role?: string;

  /**
   * Body param: The extent to which calendar access is granted by this ACL rule.
   */
  scope?: ACLUpdateRuleParams.Scope;
}

export namespace ACLUpdateRuleParams {
  /**
   * The extent to which calendar access is granted by this ACL rule.
   */
  export interface Scope {
    /**
     * The type of the scope. Possible values are:
     *
     * - "default" - The public scope. This is the default value.
     * - "user" - Limits the scope to a single user.
     * - "group" - Limits the scope to a group.
     * - "domain" - Limits the scope to a domain. Note: The permissions granted to the
     *   "default", or public, scope apply to any user, authenticated or not.
     */
    type?: string;

    /**
     * The email address of a user or group, or the name of a domain, depending on the
     * scope type. Omitted for type "default".
     */
    value?: string;
  }
}

export interface ACLUpdateRuleFullParams {
  /**
   * Path param:
   */
  calendarId: string;

  /**
   * Query param: Whether to send notifications about the calendar sharing change.
   * Note that there are no notifications on access removal. Optional. The default is
   * True.
   */
  sendNotifications?: boolean;

  /**
   * Body param: Identifier of the Access Control List (ACL) rule. See Sharing
   * calendars.
   */
  id?: string;

  /**
   * Body param: ETag of the resource.
   */
  etag?: string;

  /**
   * Body param: Type of the resource ("calendar#aclRule").
   */
  kind?: string;

  /**
   * Body param: The role assigned to the scope. Possible values are:
   *
   * - "none" - Provides no access.
   * - "freeBusyReader" - Provides read access to free/busy information.
   * - "reader" - Provides read access to the calendar. Private events will appear to
   *   users with reader access, but event details will be hidden.
   * - "writer" - Provides read and write access to the calendar. Private events will
   *   appear to users with writer access, and event details will be visible.
   *   Provides read access to the calendar's ACLs.
   * - "owner" - Provides ownership of the calendar. This role has all of the
   *   permissions of the writer role with the additional ability to manipulate ACLs.
   */
  role?: string;

  /**
   * Body param: The extent to which calendar access is granted by this ACL rule.
   */
  scope?: ACLUpdateRuleFullParams.Scope;
}

export namespace ACLUpdateRuleFullParams {
  /**
   * The extent to which calendar access is granted by this ACL rule.
   */
  export interface Scope {
    /**
     * The type of the scope. Possible values are:
     *
     * - "default" - The public scope. This is the default value.
     * - "user" - Limits the scope to a single user.
     * - "group" - Limits the scope to a group.
     * - "domain" - Limits the scope to a domain. Note: The permissions granted to the
     *   "default", or public, scope apply to any user, authenticated or not.
     */
    type?: string;

    /**
     * The email address of a user or group, or the name of a domain, depending on the
     * scope type. Omitted for type "default".
     */
    value?: string;
  }
}

export interface ACLWatchRulesParams {
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
   * Query param: Whether to include deleted ACLs in the result. Deleted ACLs are
   * represented by role equal to "none". Deleted ACLs will always be included if
   * syncToken is provided. Optional. The default is False.
   */
  showDeleted?: boolean;

  /**
   * Query param: Token obtained from the nextSyncToken field returned on the last
   * page of results from the previous list request. It makes the result of this list
   * request contain only entries that have changed since then. All entries deleted
   * since the previous list request will always be in the result set and it is not
   * allowed to set showDeleted to False. If the syncToken expires, the server will
   * respond with a 410 GONE response code and the client should clear its storage
   * and perform a full synchronization without any syncToken. Learn more about
   * incremental synchronization. Optional. The default is to return all entries.
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

export declare namespace ACL {
  export {
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
}
