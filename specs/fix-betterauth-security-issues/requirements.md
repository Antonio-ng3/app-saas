# Requirements: Fix BetterAuth Security Issues

## Overview

This feature addresses critical and important security vulnerabilities identified in the BetterAuth implementation. The current authentication system is functional but has several security gaps that must be resolved before production deployment.

## Why This Is Needed

The current implementation exposes the application to:

1. **Credential compromise** - Hardcoded secrets in version control
2. **Data integrity issues** - Unvalidated API inputs allow arbitrary data manipulation
3. **Unauthorized access** - Protected routes can be accessed without authentication
4. **State desynchronization** - Client-side state differs from server-side reality

## Current State

- BetterAuth is configured and working for basic authentication
- Database schema includes user sessions and accounts
- Protected routes exist but have inconsistent auth checks
- Credit system exists but lacks server-side validation

## Target State

- All security vulnerabilities identified in the audit are resolved
- All API endpoints have proper input validation
- All protected routes require authentication
- Credit operations are synchronized between client and server

## Dependencies

- Existing BetterAuth configuration in `src/lib/auth.ts`
- Existing database schema in `src/lib/schema.ts`
- Existing API routes in `src/app/api/`

## Acceptance Criteria

### Critical Security Issues (Must Pass)

- [ ] `BETTER_AUTH_SECRET` is not hardcoded in `env.example`
- [ ] `/api/user/credits` PATCH endpoint validates negative values
- [ ] `/api/user/profile` PATCH endpoint validates name length and type
- [ ] `/api/user/profile` PATCH endpoint rejects empty names
- [ ] `useCredits` hook syncs with server on deduction
- [ ] `/gallery` page requires authentication to access

### Important Issues (Must Pass)

- [ ] `src/proxy.ts` uses correct `cookiePrefix` configuration
- [ ] `/api/generate-plush` validates user credits before generating
- [ ] `/api/generate-plush` deducts credits server-side after generation
- [ ] BetterAuth config includes rate limiting
- [ ] BetterAuth config includes session expiration

### Validation (Must Pass)

- [ ] `npm run lint` passes with no errors
- [ ] `npm run typecheck` passes with no errors
- [ ] All API routes return appropriate HTTP status codes
- [ ] Protected routes redirect unauthenticated users to login

## Non-Goals

- Complete redesign of the authentication system
- Adding new authentication providers (beyond existing Google OAuth)
- Implementing email verification flow (deferred to future feature)
- Adding comprehensive audit logging (deferred to future feature)

## Related Features

- `replace-mock-data-with-betterauth` - Original migration to BetterAuth
