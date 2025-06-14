# Calendar App Permission Implementation

## Overview
This implementation adds proper event editing controls to the calendar app using Google Calendar API data to determine user permissions based on their role (organizer vs attendee).

## Key Changes Made

### 1. Updated Types (`apps/web/components/event-calendar/types.ts`)
- Added Google Calendar permission fields to `CalendarEvent` interface:
  - `organizer`: Contains organizer information with `self` boolean
  - `creator`: Contains creator information with `self` boolean  
  - `attendees`: Array of attendee objects with response status and `self` boolean
- Added new types:
  - `UserEventRole`: "organizer" | "attendee" | "none" 
  - `EventPermissions`: Interface defining what actions user can perform

### 2. Enhanced Data Processing (`packages/lib/calendar.ts`)
- Updated `ProcessedCalendarEventSchema` to include permission fields
- Modified `processEventData()` function to extract organizer, creator, and attendees data from Google Calendar API responses
- This ensures permission data is available throughout the application

### 3. Permission Utilities (`apps/web/components/event-calendar/utils.ts`)
- `getUserEventRole()`: Determines if user is organizer, attendee, or has no role
- `getEventPermissions()`: Returns comprehensive permission object based on user role
- `validateEventPermission()`: Validates specific actions (edit, delete, etc.)
- `getUserResponseStatus()`: Gets current user's RSVP status
- `canRespondToEvent()`: Checks if user can respond to event invitation

### 4. Updated Event Dialog (`apps/web/components/event-calendar/event-dialog.tsx`)
- Added new `AttendeeEventView` component for read-only event details
- Shows different interfaces based on user role:
  - **Organizers/Creators**: Full edit form with all controls
  - **Attendees**: Read-only view with RSVP buttons (Accept/Decline/Maybe)
- Added permission warnings for unauthorized access attempts
- Conditional rendering of edit/delete buttons based on permissions

### 5. Backend Permission Validation (`packages/api/src/routers/calendar.ts`)
- Added `validateEventPermissions()` helper function
- Enhanced `updateEvent` mutation with permission checking
- Enhanced `deleteEvent` mutation with permission checking
- Added new `updateAttendeeResponse` mutation for RSVP functionality
- Prevents unauthorized API calls that would cause errors

### 6. Frontend Integration (`apps/web/components/big-calendar.tsx`)
- Added `handleAttendeeResponse()` function for RSVP updates
- Integrated with new TRPC mutation for attendee responses
- Passes response handler to EventDialog component
- Uses actual calendar ID from event data instead of hardcoded values

### 7. Calendar Component Updates (`apps/web/components/event-calendar/event-calendar.tsx`)
- Added `onResponseUpdate` prop to EventCalendarProps interface
- Passes response handler through component hierarchy

## Permission Logic

### Organizer/Creator Permissions
- ✅ Can edit all event details
- ✅ Can delete events
- ✅ Can invite others
- ✅ Can see all attendees
- ✅ Full modification rights

### Attendee Permissions  
- ❌ Cannot edit event details
- ❌ Cannot delete events
- ❌ Cannot invite others
- ✅ Can see event details (read-only)
- ✅ Can respond to invitation (Accept/Decline/Maybe)
- ✅ Can see other attendees (by default)

### Non-participants
- ❌ No permissions (events shouldn't be accessible)

## Security Features

1. **Client-side validation**: UI prevents unauthorized actions before API calls
2. **Server-side validation**: TRPC mutations validate permissions before Google Calendar API calls
3. **Real-time permission checking**: Uses live Google Calendar API data, not cached permissions
4. **Role-based UI rendering**: Different interfaces prevent confusion and unauthorized attempts
5. **Proper error handling**: Clear error messages for permission failures

## User Experience Improvements

1. **Contextual interfaces**: Users see appropriate controls based on their role
2. **Clear visual feedback**: Permission warnings and role-appropriate buttons
3. **Google Calendar consistency**: Mimics Google Calendar's permission model
4. **RSVP functionality**: Easy Accept/Decline/Maybe buttons for attendees
5. **Error prevention**: UI prevents actions that would fail due to permissions

## API Integration

The implementation leverages the existing Google Calendar API integration but enhances it to:
- Extract permission-related fields from API responses
- Validate user permissions before making API calls
- Handle attendee response updates through the Google Calendar API
- Provide proper error handling for permission failures

This creates a robust permission system that prevents unauthorized calendar event modifications while providing an intuitive user experience that matches Google Calendar's behavior.