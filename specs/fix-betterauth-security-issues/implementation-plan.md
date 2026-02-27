# Implementation Plan: Fix BetterAuth Security Issues

## Overview

This plan addresses critical and important security vulnerabilities identified in the BetterAuth implementation. The fixes will be implemented in phases, starting with the most critical security issues.

## Phase 1: Fix Critical Security Vulnerabilities ✅ COMPLETED

Fix the highest-priority security issues that could lead to data compromise or unauthorized access.

### Tasks

- [x] Update `env.example` to remove hardcoded `BETTER_AUTH_SECRET`
- [x] Add input validation to `/api/user/credits` PATCH endpoint
- [x] Add input validation to `/api/user/profile` PATCH endpoint
- [x] Fix `useCredits` hook to sync with server
- [x] Add authentication check to `/gallery` page

### Status
**Completed on:** 2026-02-27
**Validation:** Lint and typecheck pass with no errors

### Technical Details

#### Task 1: Update env.example

**File**: `env.example`

**Current problematic code**:
```bash
BETTER_AUTH_SECRET=qtD4Ssa0t5jY7ewALgai97sKhAtn7Ysc
```

**Replace with**:
```bash
# Generate a secure secret with: openssl rand -base64 32
BETTER_AUTH_SECRET=
```

#### Task 2: Validate credits API input

**File**: `src/app/api/user/credits/route.ts`

**Current code** (around line 23-39):
```typescript
export async function PATCH(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { credits } = body;

  const [updatedUser] = await db.update(user)
    .set({ credits })
    .where(eq(user.id, session.user.id))
    .returning();

  return NextResponse.json({ credits: updatedUser?.credits ?? 0 });
}
```

**Replace with**:
```typescript
export async function PATCH(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { credits } = body;

  // Validate credits value
  if (typeof credits !== 'number' || credits < 0 || !Number.isFinite(credits)) {
    return NextResponse.json(
      { error: "Invalid credits value. Must be a non-negative number." },
      { status: 400 }
    );
  }

  const [updatedUser] = await db.update(user)
    .set({ credits })
    .where(eq(user.id, session.user.id))
    .returning();

  return NextResponse.json({ credits: updatedUser?.credits ?? 0 });
}
```

#### Task 3: Validate profile API input

**File**: `src/app/api/user/profile/route.ts`

**Current code** (around line 8-24):
```typescript
export async function PATCH(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name } = body;

  const [updatedUser] = await db.update(user)
    .set({ name })
    .where(eq(user.id, session.user.id))
    .returning();

  return NextResponse.json(updatedUser);
}
```

**Replace with**:
```typescript
export async function PATCH(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name } = body;

  // Validate name
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return NextResponse.json(
      { error: "Name is required and cannot be empty" },
      { status: 400 }
    );
  }

  if (name.trim().length > 100) {
    return NextResponse.json(
      { error: "Name must be 100 characters or less" },
      { status: 400 }
    );
  }

  const trimmedName = name.trim();

  const [updatedUser] = await db.update(user)
    .set({ name: trimmedName, updatedAt: new Date() })
    .where(eq(user.id, session.user.id))
    .returning();

  return NextResponse.json(updatedUser);
}
```

#### Task 4: Fix useCredits hook server sync

**File**: `src/hooks/use-credits.ts`

**Current code** (around line 25-27):
```typescript
const deduct = () => {
  setCredits((prev) => Math.max(0, prev - 1));
};
```

**Replace with**:
```typescript
const deduct = async () => {
  // Optimistic update
  const previousCredits = credits;
  setCredits((prev) => Math.max(0, prev - 1));

  try {
    const res = await fetch("/api/user/credits", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ credits: Math.max(0, previousCredits - 1) }),
    });

    if (!res.ok) {
      // Revert on error
      setCredits(previousCredits);
      throw new Error("Failed to deduct credits");
    }

    const data = await res.json();
    setCredits(data.credits);
  } catch (error) {
    // Revert on error
    setCredits(previousCredits);
    console.error("Error deducting credits:", error);
    throw error;
  }
};
```

#### Task 5: Protect gallery page

**File**: `src/app/gallery/page.tsx`

**Current code** (around line 21, 32) - Uses mock data and no auth check.

**Add authentication check after imports and before component**:
```typescript
"use client"

import { useSession } from "@/lib/auth-client"
import { Lock } from "lucide-react"
import { UserProfile } from "@/components/auth/user-profile"
// ... other imports

// ... existing interface definitions

export default function GalleryPage() {
  const { data: session, isPending } = useSession()

  if (isPending) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-3xl text-center">
          <div className="animate-pulse">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-muted" />
            <div className="mx-auto h-8 w-48 rounded bg-muted" />
          </div>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-3xl text-center">
          <Lock className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
          <h1 className="mb-2 text-2xl font-bold">Página Protegida</h1>
          <p className="mb-6 text-muted-foreground">
            Você precisa entrar para acessar a galeria
          </p>
          <UserProfile />
        </div>
      </div>
    )
  }

  // ... existing component continues with session.user.id
}
```

---

## Phase 2: Fix Important Issues

Address important functional issues that affect the reliability and correctness of the application.

### Tasks

- [ ] Fix `cookiePrefix` configuration in `src/proxy.ts`
- [ ] Add server-side credit validation to `/api/generate-plush`
- [ ] Add server-side credit deduction to `/api/generate-plush`
- [ ] Add rate limiting to BetterAuth configuration
- [ ] Add session expiration to BetterAuth configuration

### Technical Details

#### Task 1: Fix proxy cookie prefix

**File**: `src/proxy.ts`

**Current code** (around line 12):
```typescript
import { getSessionCookie } from "better-auth/cookies";

export async function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);

  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}
```

**Replace with**:
```typescript
import { getSessionCookie } from "better-auth/cookies";

export async function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request, {
    cookiePrefix: "plushify" // Must match auth.ts configuration
  });

  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}
```

#### Task 2 & 3: Add credit validation and deduction to generate-plush

**File**: `src/app/api/generate-plush/route.ts`

**Note**: First read the current implementation to understand the flow, then add:

1. **Before generating**: Check if user has sufficient credits
2. **After successful generation**: Deduct 1 credit
3. **Return updated credit count** in response

**Pattern to add**:
```typescript
import { db } from "@/lib/db"
import { user } from "@/lib/schema"
import { eq } from "drizzle-orm"

// In the POST handler, after session check:
const session = await auth.api.getSession({ headers: await headers() });

if (!session?.user?.id) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

// Fetch current credits
const [currentUser] = await db
  .select({ credits: user.credits })
  .from(user)
  .where(eq(user.id, session.user.id))
  .limit(1);

if (!currentUser || currentUser.credits <= 0) {
  return NextResponse.json(
    { error: "Insufficient credits. Please upgrade to continue." },
    { status: 402 } // Payment Required
  );
}

// ... proceed with generation

// After successful generation:
const [updatedUser] = await db
  .update(user)
  .set({ credits: currentUser.credits - 1 })
  .where(eq(user.id, session.user.id))
  .returning({ credits: user.credits });

// Return in response:
return NextResponse.json({
  // ... existing response fields
  creditsRemaining: updatedUser.credits
});
```

#### Task 4: Add rate limiting to BetterAuth

**File**: `src/lib/auth.ts`

**Current configuration** lacks rate limiting. Add to the `betterAuth` config:

```typescript
export const auth = betterAuth({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  // ... existing config

  // ADD RATE LIMITING:
  rateLimit: {
    window: 15, // 15 minutes
    max: 5, // maximum 5 attempts per window
  },

  // ... rest of config
})
```

#### Task 5: Add session expiration

**File**: `src/lib/auth.ts`

**Current configuration** lacks explicit session expiration. Add to the `betterAuth` config:

```typescript
export const auth = betterAuth({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  advanced: {
    cookiePrefix: "plushify",
    useSecureCookies: process.env.NODE_ENV === "production",
    crossSubDomainCookies: {
      enabled: false,
    },
    // ADD SESSION EXPIRATION:
    sessionMaxAge: 7 * 24 * 60 * 60, // 7 days in seconds
  },
  // ... rest of config
})
```

---

## Phase 3: Cleanup and Validation

Ensure all changes work correctly and pass validation.

### Tasks

- [ ] Run `npm run lint` and fix any errors
- [ ] Run `npm run typecheck` and fix any errors
- [ ] Update `env.example` to fix `OPENROUTER_MODEL` inconsistency
- [ ] Verify all protected routes work correctly

### Technical Details

#### Task 1 & 2: Lint and typecheck

**Commands**:
```bash
npm run lint
npm run typecheck
```

Fix any errors that arise from the changes.

#### Task 3: Fix env.example model

**File**: `env.example`

**Current**:
```bash
OPENROUTER_MODEL="openai/gpt-5-mini"
```

**Replace with**:
```bash
OPENROUTER_MODEL="openai/gpt-4o-mini"  # Default AI model (see https://openrouter.ai/models)
```

#### Task 4: Verify protected routes

**Manual testing checklist**:
- [ ] Access `/dashboard` while logged out → should redirect to login
- [ ] Access `/profile` while logged out → should redirect to login
- [ ] Access `/gallery` while logged out → should show login prompt
- [ ] Access `/chat` while logged out → should redirect to login
- [ ] After login, all routes should be accessible

---

## Dependencies Between Tasks

| Task | Depends On |
|------|------------|
| Phase 2, Task 2&3 (generate-plush credits) | Phase 1, Task 2 (credits API validation) - ensures credits API pattern is established |
| Phase 3, All tasks | Phase 1 and Phase 2 completion |

---

## Testing Strategy

After implementation:

1. **API Testing**: Use curl or Postman to test validation endpoints
2. **Manual Testing**: Log in/out and verify protected routes
3. **Credit Flow**: Generate an image and verify credit deduction
4. **Error Cases**: Try invalid inputs to all APIs
