// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import * as CalendarListAPI from './calendar-list';
import {
  CalendarList,
  CalendarListCreateParams,
  CalendarListEntry,
  CalendarListListParams,
  CalendarListListResponse,
  CalendarListUpdateParams,
  CalendarListWatchParams,
} from './calendar-list';
import * as SettingsAPI from './settings';
import {
  SettingListParams,
  SettingListResponse,
  SettingRetrieveResponse,
  SettingWatchParams,
  Settings,
} from './settings';

export class Me extends APIResource {
  calendarList: CalendarListAPI.CalendarList = new CalendarListAPI.CalendarList(this._client);
  settings: SettingsAPI.Settings = new SettingsAPI.Settings(this._client);
}

Me.CalendarList = CalendarList;
Me.Settings = Settings;

export declare namespace Me {
  export {
    CalendarList as CalendarList,
    type CalendarListEntry as CalendarListEntry,
    type CalendarListListResponse as CalendarListListResponse,
    type CalendarListCreateParams as CalendarListCreateParams,
    type CalendarListUpdateParams as CalendarListUpdateParams,
    type CalendarListListParams as CalendarListListParams,
    type CalendarListWatchParams as CalendarListWatchParams,
  };

  export {
    Settings as Settings,
    type SettingRetrieveResponse as SettingRetrieveResponse,
    type SettingListResponse as SettingListResponse,
    type SettingListParams as SettingListParams,
    type SettingWatchParams as SettingWatchParams,
  };
}
