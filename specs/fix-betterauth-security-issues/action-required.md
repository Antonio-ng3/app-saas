# Action Required: Fix BetterAuth Security Issues

Manual steps that must be completed by a human. These cannot be automated.

## Before Implementation

- [ ] **Generate a new secure BETTER_AUTH_SECRET** - Run `openssl rand -base64 32` and store the output in a secure password manager. Do NOT commit this to version control.

## During Implementation

- [ ] **Update production environment variables** - After updating `env.example`, ensure the production `.env` file has a unique, randomly generated `BETTER_AUTH_SECRET` (not the same as any development secret).

## After Implementation

- [ ] **Test protected routes manually** - Verify that `/dashboard`, `/profile`, `/gallery`, and `/chat` properly redirect unauthenticated users to the login page.
- [ ] **Test credit API validation** - Attempt to send negative or invalid values to `/api/user/credits` to verify 400 status codes are returned.
- [ ] **Test profile API validation** - Attempt to send empty names or names >100 characters to `/api/user/profile` to verify validation works.
- [ ] **Test image generation credit flow** - Generate an image and verify that 1 credit is deducted from your account.
- [ ] **Test rate limiting** - Attempt to log in with incorrect credentials 6+ times to verify rate limiting blocks further attempts.

---

> **Note:** These tasks are also listed in context within `implementation-plan.md`
