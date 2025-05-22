# Calendars

Types:

- <code><a href="./src/resources/calendars/calendars.ts">Calendar</a></code>

Methods:

- <code title="post /calendars">client.calendars.<a href="./src/resources/calendars/calendars.ts">create</a>({ ...params }) -> Calendar</code>
- <code title="get /calendars/{calendarId}">client.calendars.<a href="./src/resources/calendars/calendars.ts">retrieve</a>(calendarID) -> Calendar</code>
- <code title="put /calendars/{calendarId}">client.calendars.<a href="./src/resources/calendars/calendars.ts">update</a>(calendarID, { ...params }) -> Calendar</code>
- <code title="delete /calendars/{calendarId}">client.calendars.<a href="./src/resources/calendars/calendars.ts">delete</a>(calendarID) -> void</code>
- <code title="post /calendars/{calendarId}/clear">client.calendars.<a href="./src/resources/calendars/calendars.ts">clear</a>(calendarID) -> void</code>
- <code title="patch /calendars/{calendarId}">client.calendars.<a href="./src/resources/calendars/calendars.ts">updatePartial</a>(calendarID, { ...params }) -> Calendar</code>

## ACL

Types:

- <code><a href="./src/resources/calendars/acl.ts">ACLRule</a></code>
- <code><a href="./src/resources/calendars/acl.ts">Channel</a></code>
- <code><a href="./src/resources/calendars/acl.ts">ACLListRulesResponse</a></code>

Methods:

- <code title="post /calendars/{calendarId}/acl">client.calendars.acl.<a href="./src/resources/calendars/acl.ts">createRule</a>(calendarID, { ...params }) -> ACLRule</code>
- <code title="delete /calendars/{calendarId}/acl/{ruleId}">client.calendars.acl.<a href="./src/resources/calendars/acl.ts">deleteRule</a>(ruleID, { ...params }) -> void</code>
- <code title="get /calendars/{calendarId}/acl">client.calendars.acl.<a href="./src/resources/calendars/acl.ts">listRules</a>(calendarID, { ...params }) -> ACLListRulesResponse</code>
- <code title="get /calendars/{calendarId}/acl/{ruleId}">client.calendars.acl.<a href="./src/resources/calendars/acl.ts">retrieveRule</a>(ruleID, { ...params }) -> ACLRule</code>
- <code title="patch /calendars/{calendarId}/acl/{ruleId}">client.calendars.acl.<a href="./src/resources/calendars/acl.ts">updateRule</a>(ruleID, { ...params }) -> ACLRule</code>
- <code title="put /calendars/{calendarId}/acl/{ruleId}">client.calendars.acl.<a href="./src/resources/calendars/acl.ts">updateRuleFull</a>(ruleID, { ...params }) -> ACLRule</code>
- <code title="post /calendars/{calendarId}/acl/watch">client.calendars.acl.<a href="./src/resources/calendars/acl.ts">watchRules</a>(calendarID, { ...params }) -> Channel</code>

## Events

Types:

- <code><a href="./src/resources/calendars/events.ts">Event</a></code>
- <code><a href="./src/resources/calendars/events.ts">Events</a></code>

Methods:

- <code title="post /calendars/{calendarId}/events">client.calendars.events.<a href="./src/resources/calendars/events.ts">create</a>(calendarID, { ...params }) -> Event</code>
- <code title="get /calendars/{calendarId}/events/{eventId}">client.calendars.events.<a href="./src/resources/calendars/events.ts">retrieve</a>(eventID, { ...params }) -> Event</code>
- <code title="put /calendars/{calendarId}/events/{eventId}">client.calendars.events.<a href="./src/resources/calendars/events.ts">update</a>(eventID, { ...params }) -> Event</code>
- <code title="get /calendars/{calendarId}/events">client.calendars.events.<a href="./src/resources/calendars/events.ts">list</a>(calendarID, { ...params }) -> Events</code>
- <code title="delete /calendars/{calendarId}/events/{eventId}">client.calendars.events.<a href="./src/resources/calendars/events.ts">delete</a>(eventID, { ...params }) -> void</code>
- <code title="post /calendars/{calendarId}/events/import">client.calendars.events.<a href="./src/resources/calendars/events.ts">import</a>(calendarID, { ...params }) -> Event</code>
- <code title="get /calendars/{calendarId}/events/{eventId}/instances">client.calendars.events.<a href="./src/resources/calendars/events.ts">listInstances</a>(eventID, { ...params }) -> Events</code>
- <code title="post /calendars/{calendarId}/events/{eventId}/move">client.calendars.events.<a href="./src/resources/calendars/events.ts">move</a>(eventID, { ...params }) -> Event</code>
- <code title="post /calendars/{calendarId}/events/quickAdd">client.calendars.events.<a href="./src/resources/calendars/events.ts">quickAdd</a>(calendarID, { ...params }) -> Event</code>
- <code title="patch /calendars/{calendarId}/events/{eventId}">client.calendars.events.<a href="./src/resources/calendars/events.ts">updatePartial</a>(eventID, { ...params }) -> Event</code>
- <code title="post /calendars/{calendarId}/events/watch">client.calendars.events.<a href="./src/resources/calendars/events.ts">watch</a>(calendarID, { ...params }) -> Channel</code>

# Users

## Me

### CalendarList

Types:

- <code><a href="./src/resources/users/me/calendar-list.ts">CalendarListEntry</a></code>
- <code><a href="./src/resources/users/me/calendar-list.ts">CalendarListListResponse</a></code>

Methods:

- <code title="post /users/me/calendarList">client.users.me.calendarList.<a href="./src/resources/users/me/calendar-list.ts">create</a>({ ...params }) -> CalendarListEntry</code>
- <code title="get /users/me/calendarList/{calendarId}">client.users.me.calendarList.<a href="./src/resources/users/me/calendar-list.ts">retrieve</a>(calendarID) -> CalendarListEntry</code>
- <code title="put /users/me/calendarList/{calendarId}">client.users.me.calendarList.<a href="./src/resources/users/me/calendar-list.ts">update</a>(calendarID, { ...params }) -> CalendarListEntry</code>
- <code title="get /users/me/calendarList">client.users.me.calendarList.<a href="./src/resources/users/me/calendar-list.ts">list</a>({ ...params }) -> CalendarListListResponse</code>
- <code title="delete /users/me/calendarList/{calendarId}">client.users.me.calendarList.<a href="./src/resources/users/me/calendar-list.ts">delete</a>(calendarID) -> void</code>
- <code title="post /users/me/calendarList/watch">client.users.me.calendarList.<a href="./src/resources/users/me/calendar-list.ts">watch</a>({ ...params }) -> Channel</code>

### Settings

Types:

- <code><a href="./src/resources/users/me/settings.ts">SettingRetrieveResponse</a></code>
- <code><a href="./src/resources/users/me/settings.ts">SettingListResponse</a></code>

Methods:

- <code title="get /users/me/settings/{setting}">client.users.me.settings.<a href="./src/resources/users/me/settings.ts">retrieve</a>(setting) -> SettingRetrieveResponse</code>
- <code title="get /users/me/settings">client.users.me.settings.<a href="./src/resources/users/me/settings.ts">list</a>({ ...params }) -> SettingListResponse</code>
- <code title="post /users/me/settings/watch">client.users.me.settings.<a href="./src/resources/users/me/settings.ts">watch</a>({ ...params }) -> Channel</code>

# Channels

Methods:

- <code title="post /channels/stop">client.channels.<a href="./src/resources/channels.ts">stopWatching</a>({ ...params }) -> void</code>

# Colors

Types:

- <code><a href="./src/resources/colors.ts">ColorListResponse</a></code>

Methods:

- <code title="get /colors">client.colors.<a href="./src/resources/colors.ts">list</a>() -> ColorListResponse</code>

# FreeBusy

Types:

- <code><a href="./src/resources/free-busy.ts">FreeBusyCheckAvailabilityResponse</a></code>

Methods:

- <code title="post /freeBusy">client.freeBusy.<a href="./src/resources/free-busy.ts">checkAvailability</a>({ ...params }) -> FreeBusyCheckAvailabilityResponse</code>
