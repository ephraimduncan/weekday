# Multi-Account Implementation for Weekday Calendar

This document outlines the implementation of multi-account functionality for the Weekday Calendar application using Better Auth.

## Overview

The multi-account feature allows users to:
- Log in with multiple Google accounts
- Switch between different accounts seamlessly
- View calendars from all connected accounts grouped by account
- Manage events across multiple accounts
- Add/remove Google accounts

## Architecture

### 1. Better Auth Configuration

**File: `packages/auth/index.ts`**

The Better Auth configuration has been updated to support:
- **Multi-Session Plugin**: Allows multiple active sessions per user
- **Account Linking**: Enables users to link additional Google accounts
- **Extended Scopes**: Added Gmail readonly scope for future email functionality

Key changes:
```typescript
plugins: [
  nextCookies(),
  multiSession({
    maximumSessions: 10, // Allow up to 10 different account sessions
  }),
],
account: {
  accountLinking: {
    enabled: true,
    trustedProviders: ["google"], // Allow automatic linking of Google accounts
  },
},
```

**File: `packages/auth/auth-client.ts`**

Updated client configuration includes:
- Multi-session client plugin
- Exported methods for account linking and management
- Multi-session management utilities

### 2. Database Schema

The existing Better Auth schema supports multi-account functionality without requiring additional tables. The multi-session plugin uses the existing session management system.

### 3. API Updates

**File: `packages/api/src/routers/calendar.ts`**

Updated calendar router with:
- `accountId` parameter for account-specific operations
- `getAllCalendars()` - Fetch calendars from all linked accounts
- `getAllEvents()` - Fetch events from all linked accounts
- `listAccounts()` - List all linked accounts for a user

**File: `packages/api/src/routers/account.ts`**

New account router with:
- `listDeviceSessions()` - List all active sessions
- `listAccounts()` - List all linked accounts

**File: `packages/lib/calendar.ts`**

Updated helper functions:
- `getGoogleAccount()` now supports optional `accountId` parameter for account-specific queries

### 4. UI Components

**File: `apps/web/components/account-switcher.tsx`**

New account switcher component that provides:
- Dropdown menu showing all active sessions
- Add account functionality
- Account switching with session management
- Visual indicators for the active account

**File: `apps/web/components/app-sidebar.tsx`**

Updated sidebar with:
- Account switcher integration
- Calendars grouped by account email
- Visual separation between different accounts
- Account-specific calendar management

**File: `apps/web/app/login/page.tsx`**

Enhanced login page that:
- Detects if user is already logged in
- Provides account linking functionality for existing users
- Maintains existing sign-in flow for new users

## Usage

### Adding a Google Account

1. **For New Users**: Use the regular login flow at `/login`
2. **For Existing Users**: 
   - Visit `/login` while logged in to add another account
   - Or use the account switcher in the sidebar to add an account

### Switching Between Accounts

1. Click the account switcher in the sidebar
2. Select the account you want to switch to
3. The application will reload with the selected account context

### Managing Calendars

- Calendars are now grouped by account email in the sidebar
- Each account's calendars are clearly separated
- Toggle visibility for individual calendars as before
- Calendar colors and settings are preserved per account

### Creating Events

- Events can be created in any connected account's calendars
- The calendar selection will show which account each calendar belongs to

## Implementation Details

### Multi-Session Management

The implementation uses Better Auth's multi-session plugin which:
- Maintains separate cookies for each account session
- Allows switching between accounts without re-authentication
- Preserves session state across browser refreshes

### Account Linking

When users add additional accounts:
1. Better Auth automatically links accounts with the same email (trusted provider)
2. Different email addresses are also supported and linked to the same user
3. Each linked account maintains its own access/refresh tokens

### Data Flow

1. **Authentication**: Better Auth manages multiple sessions
2. **API Calls**: Include optional `accountId` parameter for account-specific operations
3. **Calendar Data**: Fetched per account and aggregated in the UI
4. **Event Management**: Operations specify which account's calendar to use

## Future Enhancements

### Email Integration

With Gmail readonly scope already configured, future implementations can include:
- Reading emails from all connected accounts
- Unified inbox view
- Account-specific email actions

### Enhanced Account Management

- Account removal functionality
- Account-specific settings
- Bulk operations across accounts

### Advanced Calendar Features

- Cross-account calendar sharing
- Unified availability checking
- Smart scheduling across accounts

## Security Considerations

1. **Token Storage**: Each account's tokens are stored separately and encrypted
2. **Access Control**: API operations are scoped to the authenticated user's accounts
3. **Session Management**: Multi-sessions are properly isolated and managed
4. **Account Linking**: Only trusted providers (Google) are auto-linked

## API Reference

### Calendar Router

#### `getAllCalendars()`
Returns calendars from all linked accounts with account identification.

#### `getAllEvents(input?: { calendarIds?, timeMin?, timeMax?, ... })`
Returns events from all linked accounts with account identification.

#### `createEvent(input: { accountId?, calendarId, event, ... })`
Creates an event in a specific account's calendar.

### Account Router

#### `listAccounts()`
Returns all Google accounts linked to the current user.

#### `listDeviceSessions()`
Returns all active sessions for the current user.

## Migration Guide

For existing users, the multi-account functionality is backward compatible:
- Existing single-account setups continue to work
- Users can gradually add additional accounts
- No data migration is required

## Troubleshooting

### Common Issues

1. **Account Linking Fails**: Ensure Google OAuth app has proper permissions
2. **Sessions Not Switching**: Check that multi-session plugin is properly configured
3. **Calendars Not Loading**: Verify API has access to account tokens

### Debug Tips

- Check browser cookies for multiple session tokens
- Verify account linking in the database
- Monitor API calls for proper account ID passing

## Configuration

Ensure your `.env` file includes:
```
BETTER_AUTH_GOOGLE_ID=your_google_client_id
BETTER_AUTH_GOOGLE_SECRET=your_google_client_secret
BETTER_AUTH_SECRET=your_auth_secret
BETTER_AUTH_URL=your_app_url
```

The Google OAuth app should include scopes:
- `openid`
- `email`
- `profile`
- `https://www.googleapis.com/auth/calendar`
- `https://www.googleapis.com/auth/gmail.readonly`