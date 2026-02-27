# Implementation Plan: Replace Mock Data with BetterAuth

## Overview

Extend database schema with credits and generations tables, create REST API endpoints, build custom hooks, and update components to use real user data instead of mock data.

## Phase 1: Database Schema Extension ✅

⚠️ **SCOPE DECISION (2026-02-27):**
- **NOT** creating separate `userCredits` or `plushieGenerations` tables
- Only adding `credits` column to existing `user` table
- Migration 0003 dropped the separate tables approach

### Tasks

- [x] Add `integer` to drizzle-orm imports in `src/lib/schema.ts`
- [x] Add `credits` column to `user` table (default: 5)
- [x] Generate migration with `pnpm run db:generate`
- [x] Apply migration with `pnpm run db:migrate`

### Current Schema

**File:** `src/lib/schema.ts`

```typescript
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  credits: integer("credits").notNull().default(5),  // ← Added for credits system
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => new Date())
    .notNull(),
});
```

---

## Phase 2: API Routes - Credits ✅

Create API endpoints for managing user credits.

### Tasks

- [x] Create `src/app/api/user/credits/route.ts` with GET handler
- [x] Create `src/app/api/user/credits/route.ts` with PATCH handler

### Technical Details

**File:** `src/app/api/user/credits/route.ts` (implemented)

```typescript
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { user } from "@/lib/schema";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userData = await db.query.user.findFirst({
    where: eq(user.id, session.user.id),
    columns: { credits: true },
  });

  return NextResponse.json({ credits: userData?.credits ?? 5 });
}

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

---

## Phase 3: API Routes - Generations ❌ NOT IMPLEMENTED

⚠️ **OUT OF SCOPE** - No `plushie_generations` table exists (dropped in migration 0003)

### Tasks

- [ ] Create `src/app/api/user/generations/route.ts` with GET and POST handlers
- [ ] Create `src/app/api/user/generations/[id]/route.ts` with PATCH and DELETE handlers

### Note

This phase was removed from scope. Gallery still uses mock data (`MOCK_PLUSHIES`).

---

## Phase 4: API Routes - Profile Update ✅

Create API endpoint for updating user profile information.

### Tasks

- [x] Create `src/app/api/user/profile/route.ts` with PATCH handler

### Technical Details

**File:** `src/app/api/user/profile/route.ts` (new file)

```typescript
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { user } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function PATCH(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name } = body;

  const [updatedUser] = await db.update(user)
    .set({ name, updatedAt: new Date() })
    .where(eq(user.id, session.user.id))
    .returning();

  return NextResponse.json(updatedUser);
}
```

---

## Phase 5: Update Generate Plush API ⚠️ NOT IMPLEMENTED

⚠️ **NOT IMPLEMENTED** - Current API generates images but doesn't save or deduct credits

### Tasks

- [ ] Add logic to save generations to database
- [ ] Add logic to deduct credits after successful generation

### Note

The `/api/generate-plush` endpoint currently:
- ✅ Generates plush images via OpenAI DALL-E
- ✅ Returns the generated image URL
- ❌ Does NOT save to database (no table exists)
- ❌ Does NOT deduct credits from user

### To Implement Later

When generations tracking is added, this API needs to:
1. Check if user has credits > 0
2. Deduct 1 credit from `user.credits`
3. Save generation record (when table exists)

---

## Phase 6: Custom Hooks ⚠️ PARTIAL

Create React hooks for data fetching.

### Tasks

- [x] Create `src/hooks/use-credits.ts` hook
- [ ] Create `src/hooks/use-generations.ts` hook (NOT IMPLEMENTED - no API)

### Technical Details

**File:** `src/hooks/use-credits.ts` (implemented)

```typescript
"use client";

import { useEffect, useState } from "react";

export function useCredits() {
  const [credits, setCredits] = useState(5);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/user/credits")
      .then((res) => res.json())
      .then((data) => {
        setCredits(data.credits);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const refresh = () => {
    fetch("/api/user/credits")
      .then((res) => res.json())
      .then((data) => setCredits(data.credits));
  };

  const deduct = () => {
    setCredits((c) => Math.max(0, c - 1));
  };

  return { credits, isLoading, refresh, deduct };
}
```

**Note:** `use-generations.ts` does not exist because there's no generations table/API.

---

## Phase 7: Update Dashboard Component ⚠️ PARTIAL

Replace mock data with real data in the dashboard.

### Tasks

- [x] Add `useCredits` hook import
- [x] Replace `useState` credits with `useCredits` hook
- [ ] Replace mock generations with `useGenerations` hook (NOT AVAILABLE)
- [ ] Update `handleGenerate` to save generation (NOT IMPLEMENTED)
- [ ] Update `CreditsDisplay` to use real maxCredits (hardcoded to 10)

### Technical Details

**File:** `src/app/dashboard/page.tsx`

**Current implementation:**
- ✅ Uses `useCredits()` hook to fetch credits
- ✅ Displays current credit balance
- ❌ Does NOT save generations after creation (no API)
- ❌ Does NOT deduct credits server-side (only local state)
- ❌ Uses hardcoded `maxCredits={10}`

### Note

Dashboard shows credits correctly but generations are not persisted to database.

---

## Phase 8: Update Gallery Component ❌ NOT IMPLEMENTED

Replace mock data with real user generations in the gallery.

### Tasks

- [ ] Add custom hook import to `src/app/gallery/page.tsx`
- [ ] Replace `MOCK_PLUSHIES` with `useGenerations` hook
- [ ] Update `handleDelete` to call API
- [ ] Update `handleFavorite` to call API

### Current State

`src/app/gallery/page.tsx` still imports and uses mock data:

```typescript
import { MOCK_PLUSHIES } from "@/lib/mock-data"
const [items, setItems] = React.useState<PlushieGeneration[]>(MOCK_PLUSHIES)
```

All users see the same mock data. No persistence, no API calls.

### Note

Gallery functionality depends on Phase 3 (Generations API) which is not implemented.

---

## Phase 9: Update Profile Component ✅

Make profile edit form functional.

### Tasks

- [x] Update `handleEditProfileSubmit` in `src/app/profile/page.tsx` to call API
- [x] Add success/error toast feedback

### Technical Details

**File:** `src/app/profile/page.tsx`

**Replace `handleEditProfileSubmit` function (lines 59-64):**
```typescript
const handleEditProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  const formData = new FormData(e.currentTarget);
  const name = formData.get("name") as string;

  const response = await fetch("/api/user/profile", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });

  if (response.ok) {
    toast.success("Profile updated successfully");
    setEditProfileOpen(false);
    // Reload to refresh session data
    window.location.reload();
  } else {
    toast.error("Failed to update profile");
  }
};
```

---

## Phase 10: Cleanup ⚠️ PARTIAL

Remove mock data file after verification.

### Tasks

- [x] Run `pnpm run lint` - ✅ PASS (0 errors, 5 img warnings)
- [x] Run `pnpm run typecheck` - ✅ PASS
- [ ] Remove `src/lib/mock-data/plushie.ts` - ⚠️ Still used by Gallery
- [ ] Test complete flow end-to-end (requires database to be running)

### Technical Details

**CLI Commands:**
```bash
pnpm run lint
pnpm run typecheck
```

**Note:** Mock data file cannot be removed yet because Gallery still uses it.

**Manual Testing Checklist:**
- [x] New user registration gives 5 credits (via database default)
- [ ] Generating plushie deducts credit (NOT IMPLEMENTED)
- [ ] Gallery shows user's generations only (still uses mock data)
- [ ] Favorite persists after refresh (NOT IMPLEMENTED)
- [ ] Delete removes from database (NOT IMPLEMENTED)
- [x] Profile name update works (via `/api/user/profile`)
- [ ] Zero credits blocks generation (NOT IMPLEMENTED)
