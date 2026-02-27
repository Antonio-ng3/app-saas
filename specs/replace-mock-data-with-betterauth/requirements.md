# Requirements: Replace Mock Data with BetterAuth

## Overview

Replace all mock/placeholder user data with real user-specific data from BetterAuth and PostgreSQL database.

## Problem Statement

The application currently uses fake data in several places:
- Dashboard shows hardcoded credits (5) and mock plushie generations
- Gallery uses `MOCK_PLUSHIES` from `src/lib/mock-data/plushie.ts` (same data for all users)
- Profile page edit form is non-functional

BetterAuth is already configured and working for authentication, but user-specific data (credits, generations) is not persisted to the database.

## Solution

Extend the database schema with new tables for user credits and plushie generations, create API endpoints for CRUD operations, and update components to fetch real data.

## Acceptance Criteria

- [ ] New users receive 5 default credits on account creation
- [ ] Credits are deducted when a user generates a plushie
- [ ] User's plushie generations are saved to database
- [ ] Gallery shows only the current user's generations (not mock data)
- [ ] Dashboard shows real credit balance and recent generations
- [ ] Profile edit form successfully updates user's name
- [ ] Favorite/unfavorite generations persists across sessions
- [ ] Delete generation removes it from database
- [ ] Zero credits prevents new generations
- [ ] Data is isolated per user (users can only see their own data)

## Dependencies

- BetterAuth must be configured (already done)
- PostgreSQL database with Drizzle ORM (already set up)
- Existing tables: `user`, `session`, `account`, `verification`

## Out of Scope

- Email notification system
- Two-factor authentication
- Credit purchase/payment system
- Advanced user preferences
- Activity history/sessions management

## Related Features

- Authentication (BetterAuth) - already implemented
- Image generation API - already implemented
- File storage - already implemented
