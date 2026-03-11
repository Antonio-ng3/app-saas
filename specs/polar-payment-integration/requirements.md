# Requirements: Polar Payment Integration

## Overview

Integrate Polar payment processing into the Plushify application to enable users to purchase subscriptions and receive monthly credits.

## Problem Statement

Currently:
- Pricing UI exists on the landing page with 3 tiers (Free, Pro, Enterprise)
- Credit system is functional but there is no way to purchase additional credits
- Users can only use the initial 5 free credits
- BetterAuth is configured but without the Polar plugin
- `credits-display.tsx` links to `/pricing` which doesn't exist (404)

## Solution

Integrate BetterAuth's Polar plugin to:
- Create Polar customers automatically on user signup
- Enable checkout flow for Pro subscriptions
- Handle webhooks to add credits when payments succeed
- Provide customer portal for subscription management
- Track subscription tier in the database

## Scope

### In Scope
- **Free Tier**: Default state (1 credit), not a Polar product
- **Pro Tier**: Polar subscription product (R$29/month, 50 credits/month)
- **Enterprise Tier**: Continue as "Fale Conosco" (contact form) - NOT integrated with Polar

### Out of Scope
- Enterprise plan via Polar
- One-time credit purchases (only monthly subscriptions)
- Annual billing option
- Promo/discount codes

## Acceptance Criteria

### Functional Requirements
1. **User Signup**: When a new user registers, a Polar customer is automatically created with `externalId` linked to our user ID
2. **Checkout Flow**: Clicking "Assinar Pro" redirects to Polar checkout and returns to success page
3. **Credit Allocation**: When payment succeeds, webhook adds 50 credits to user account
4. **Subscription Tracking**: User's `subscriptionTier` is updated to "pro" on successful payment
5. **Subscription Management**: Pro users can access Polar Portal to manage/cancel subscriptions
6. **Cancellation Handling**: When subscription is canceled, `subscriptionTier` downgrades to "free" (access continues until period end)
7. **Pricing Page**: A dedicated `/pricing` page exists with checkout integration

### Non-Functional Requirements
1. **Webhook Security**: Polar webhooks are verified with signature
2. **Error Handling**: Checkout failures are handled gracefully with user feedback
3. **Environment Support**: Works in both development (sandbox) and production

## Dependencies

### External Services
- **Polar Sandbox/Production**: Payment processing and customer management
- **Polar Access Token**: For API authentication
- **Polar Webhook Secret**: For webhook signature verification

### Internal Systems
- **BetterAuth**: Authentication and user management
- **Drizzle ORM**: Database schema and migrations
- **PostgreSQL**: User data storage

## User Stories

1. **As a new user**, I want to sign up and automatically have a Polar customer account created
2. **As a free user**, I want to upgrade to Pro by clicking "Assinar Pro" and completing checkout
3. **As a Pro subscriber**, I want to receive 50 credits each month automatically
4. **As a Pro subscriber**, I want to manage my subscription (cancel, update payment) via a portal
5. **As a user**, I want to see my current subscription tier on my profile page

## Success Metrics

- Checkout conversion rate (free → pro upgrades)
- Webhook processing success rate (credits added correctly)
- Subscription cancellation rate
- User-reported issues with payments/credits

## Related Features

- Credit system (`src/components/credits-display.tsx`, `/api/user/credits`)
- User authentication (`src/lib/auth.ts`, BetterAuth)
- Dashboard (`src/app/dashboard/page.tsx`)
- Profile page (`src/app/profile/page.tsx`)

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Webhook delivery fails | Polar retries webhooks; store `creditsLastSyncedAt` to prevent double-allocation |
| User cancels but keeps access | Polar handles grace period automatically |
| Duplicate webhook events | Check timestamp in `creditsLastSyncedAt` before processing |
| Checkout redirect fails | Clear error messaging with retry option |
