# Implementation Plan: OpenRouter Image Generation Integration

## Overview

Replace OpenAI DALL-E 3 with OpenRouter's `google/gemini-3.1-flash-image-preview` model, add database persistence for generated images, and implement a real user gallery with CRUD operations.

---

## Phase 1: Database Schema and Environment Setup ✅

**Goal**: Add the `generated_image` table and configure the image model environment variable.

### Tasks

- [x] Add `generatedImage` table to database schema (`src/lib/schema.ts`)
  - [x] Import required Drizzle types: `pgTable`, `text`, `timestamp`, `boolean`, `index`
  - [x] Define table with columns: `id`, `userId`, `originalImageUrl`, `generatedImageUrl`, `style`, `createdAt`, `isFavorite`
  - [x] Add foreign key to `user` table with cascade delete
  - [x] Add indexes on `userId` and `createdAt`

- [x] Add image model environment variable (`src/lib/env.ts`)
  - [x] Add `OPENROUTER_IMAGE_MODEL` to server schema
  - [x] Set default value: `"google/gemini-3.1-flash-image-preview"`

- [x] Update environment example (`env.example`)
  - [x] Add comment and example for `OPENROUTER_IMAGE_MODEL`

- [x] Generate and run database migration
  - [x] Run `pnpm run db:generate` to create migration file
  - [x] Run `pnpm run db:migrate` to apply migration

### Technical Details

**Database Schema** (`src/lib/schema.ts`):

```typescript
export const generatedImage = pgTable(
  "generated_image",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    originalImageUrl: text("original_image_url").notNull(),
    generatedImageUrl: text("generated_image_url").notNull(),
    style: text("style").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    isFavorite: boolean("is_favorite").default(false).notNull(),
  },
  (table) => [
    index("generated_image_user_id_idx").on(table.userId),
    index("generated_image_created_at_idx").on(table.createdAt),
  ]
);
```

**Environment Variable** (`src/lib/env.ts`):

```typescript
const serverEnvSchema = z.object({
  // ... existing vars
  OPENROUTER_IMAGE_MODEL: z.string().default("google/gemini-2.5-flash-image"),
});
```

**Environment Example** (`env.example`):

```env
# Image Generation Model (OpenRouter)
OPENROUTER_IMAGE_MODEL="google/gemini-3.1-flash-image-preview"
```

**CLI Commands**:

```bash
pnpm run db:generate
pnpm run db:migrate
```

---

## Phase 2: Refactor Generation API Route ✅

**Goal**: Replace OpenAI with OpenRouter, add image storage, and persist records to database.

### Tasks

- [x] Update imports in `src/app/api/generate-plush/route.ts`
  - [x] Add `import { createOpenRouter } from '@openrouter/ai-sdk-provider'`
  - [x] Add `import { generateImage } from 'ai'` (using `experimental_generateImage`)
  - [x] Add `import { upload } from '@/lib/storage'`
  - [x] Add `import { generatedImage } from '@/lib/schema'`
  - [x] Add `import { randomUUID } from 'node:crypto'` (for UUID generation)

- [x] Replace OpenAI analysis with OpenRouter [complex]
  - [x] Remove `analyzeSubject` function using OpenAI
  - [x] Create OpenRouter instance using `createOpenRouter({ apiKey: process.env.OPENROUTER_API_KEY })`
  - [x] Update image generation to use `generateImage()` with `openrouter.imageModel()`
  - [x] Extract base64 data from `image.base64` property

- [x] Add original image upload to storage
  - [x] Fetch original image from URL and convert to Buffer
  - [x] Upload using `upload(buffer, filename, "bob-app-saas/originals/{userId}")`
  - [x] Store result URL for database record

- [x] Add generated image upload to storage
  - [x] Convert `image.base64` to Buffer (remove data URL prefix)
  - [x] Upload using `upload(buffer, filename, "bob-app-saas/generated/{userId}")`
  - [x] Store result URL for database record

- [x] Save generation record to database
  - [x] Generate UUID using `randomUUID()`
  - [x] Insert into `generatedImage` table with all required fields
  - [x] Return inserted record in response

- [x] Update error handling for 402 (insufficient credits)
  - [x] Ensure 402 status code is returned when credits <= 0
  - [x] Return error message: "Insufficient credits. Please upgrade to continue."

### Technical Details

**OpenRouter Setup**:

```typescript
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { generateImage } from 'ai';

const openrouter = createOpenRouter({ apiKey: process.env.OPENROUTER_API_KEY });
```

**Image Generation Pattern**:

```typescript
const { image, warnings } = await generateImage({
  model: openrouter.imageModel(process.env.OPENROUTER_IMAGE_MODEL),
  prompt: fullPrompt,
  size: '1024x1024',
});

// Handle warnings if present
if (warnings && warnings.length > 0) {
  console.warn('Generation warnings:', warnings);
}
```

**Base64 to Buffer Conversion**:

```typescript
const base64Data = image.base64.split(',')[1]; // Remove data URL prefix
const buffer = Buffer.from(base64Data, 'base64');
```

**Storage Upload Pattern**:

```typescript
import { upload } from '@/lib/storage';

// Original image
const originalBuffer = await fetch(imageUrl).then(r => r.arrayBuffer());
const originalResult = await upload(
  Buffer.from(originalBuffer),
  `original-${Date.now()}.png`,
  `bob-app-saas/originals/${session.user.id}`
);

// Generated image
const generatedBuffer = Buffer.from(image.base64.split(',')[1], 'base64');
const generatedResult = await upload(
  generatedBuffer,
  `generated-${Date.now()}.png`,
  `bob-app-saas/generated/${session.user.id}`
);
```

**Database Insert Pattern**:

```typescript
import { generatedImage } from '@/lib/schema';
import { crypto } from 'node:crypto';

const [record] = await db.insert(generatedImage).values({
  id: crypto.randomUUID(),
  userId: session.user.id,
  originalImageUrl: originalResult.url,
  generatedImageUrl: generatedResult.url,
  style: style,
}).returning();
```

**Storage Paths**:
- Original: `bob-app-saas/originals/{userId}/original-{timestamp}.png`
- Generated: `bob-app-saas/generated/{userId}/generated-{timestamp}.png`

---

## Phase 3: Gallery API Routes ✅

**Goal**: Create GET and DELETE endpoints for the user's gallery.

### Tasks

- [x] Create GET endpoint at `src/app/api/gallery/route.ts`
  - [x] Import auth, db, generatedImage, and query helpers
  - [x] Check session authentication
  - [x] Query `generatedImage` table filtered by `userId`
  - [x] Order by `createdAt` descending
  - [x] Return JSON array of image records

- [x] Create DELETE endpoint at `src/app/api/gallery/[id]/route.ts`
  - [x] Import auth, db, generatedImage, storage delete, and query helpers
  - [x] Check session authentication
  - [x] Query record by `id` AND `userId` (security check)
  - [x] Return 404 if record doesn't exist or belongs to different user
  - [x] Delete original image from storage using `deleteFile()`
  - [x] Delete generated image from storage using `deleteFile()`
  - [x] Delete database record
  - [x] Return success response

### Technical Details

**GET Route** (`src/app/api/gallery/route.ts`):

```typescript
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { generatedImage } from "@/lib/schema";
import { desc, eq } from "drizzle-orm";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const images = await db
    .select()
    .from(generatedImage)
    .where(eq(generatedImage.userId, session.user.id))
    .orderBy(desc(generatedImage.createdAt));

  return NextResponse.json(images);
}
```

**DELETE Route** (`src/app/api/gallery/[id]/route.ts`):

```typescript
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { generatedImage } from "@/lib/schema";
import { deleteFile } from "@/lib/storage";
import { eq, and } from "drizzle-orm";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Security: Verify user owns this record
  const [record] = await db
    .select()
    .from(generatedImage)
    .where(
      and(
        eq(generatedImage.id, params.id),
        eq(generatedImage.userId, session.user.id)
      )
    )
    .limit(1);

  if (!record) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Delete files from storage
  await deleteFile(record.originalImageUrl);
  await deleteFile(record.generatedImageUrl);

  // Delete database record
  await db.delete(generatedImage).where(eq(generatedImage.id, params.id));

  return NextResponse.json({ success: true });
}
```

**API Endpoints**:
- `GET /api/gallery` - Fetch user's generations
- `DELETE /api/gallery/{id}` - Delete a generation

---

## Phase 4: UI Components ✅

**Goal**: Add alert dialog for delete confirmation.

### Tasks

- [x] Add shadcn/ui alert-dialog component
  - [x] Run: `pnpm dlx shadcn@latest add alert-dialog`
  - [x] Verify `src/components/ui/alert-dialog.tsx` is created

### Technical Details

**CLI Command**:

```bash
pnpm dlx shadcn@latest add alert-dialog
```

**Component Usage Pattern**:

```typescript
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
```

---

## Phase 5: Gallery Page Integration ✅

**Goal**: Replace mock data with real database records and add delete functionality.

### Tasks

- [x] Remove mock data from `src/app/gallery/page.tsx`
  - [x] Remove `MOCK_PLUSHIES` import and usage
  - [x] Add state for real images: `const [images, setImages] = useState<PlushieGeneration[]>([])`

- [x] Add data fetching on mount
  - [x] Create `useEffect` that fetches from `/api/gallery`
  - [x] Parse JSON response and update state
  - [x] Add loading state during fetch

- [x] Add delete functionality
  - [x] Import toast from "sonner"
  - [x] Create `handleDelete` async function
  - [x] Call `DELETE /api/gallery/{id}`
  - [x] Update state to remove deleted image
  - [x] Show success toast: "Imagem excluída"

- [x] Integrate BeforeAfterSlider component
  - [x] Import `BeforeAfterSlider` from `@/components/before-after-slider`
  - [x] Replace static image display with slider
  - [x] Pass `originalImageUrl` and `generatedImageUrl` as props

- [x] Add AlertDialog for delete confirmation
  - [x] Wrap delete button in AlertDialogTrigger
  - [x] Show AlertDialog with confirmation message
  - [x] Execute delete on AlertDialogAction

### Technical Details

**Data Fetching Pattern**:

```typescript
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface GenerationRecord {
  id: string;
  originalImageUrl: string;
  generatedImageUrl: string;
  style: string;
  createdAt: string;
  isFavorite: boolean;
}

const [images, setImages] = useState<GenerationRecord[]>([]);
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  fetch('/api/gallery')
    .then(r => r.json())
    .then(data => {
      setImages(data);
      setIsLoading(false);
    })
    .catch(err => {
      toast.error("Failed to load gallery");
      setIsLoading(false);
    });
}, []);
```

**Delete Handler Pattern**:

```typescript
const handleDelete = async (id: string) => {
  try {
    const response = await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Failed to delete');

    setImages(prev => prev.filter(img => img.id !== id));
    toast.success("Imagem excluída");
  } catch (error) {
    toast.error("Falha ao excluir imagem");
  }
};
```

**BeforeAfterSlider Integration**:

```typescript
import { BeforeAfterSlider } from "@/components/before-after-slider";

<BeforeAfterSlider
  beforeImage={image.originalImageUrl}
  afterImage={image.generatedImageUrl}
  beforeLabel="Original"
  afterLabel="Plush"
/>
```

---

## Phase 6: Error Handling and Toast Notifications ✅

**Goal**: Ensure proper error messages for insufficient credits and other failures.

### Tasks

- [x] Add 402 error handling in generation flow
  - [x] Check for `response.status === 402` in generation error handler
  - [x] Show toast.error with title: "Créditos insuficientes"
  - [x] Add description: "Compre mais créditos para continuar gerando"

- [x] Verify Sonner toaster is mounted in app
  - [x] Confirm `<Toaster />` is in root layout
  - [x] Import from `@/components/ui/sonner`

### Technical Details

**Error Handling Pattern**:

```typescript
import { toast } from "sonner";

// In the generation error handler
if (response.status === 402) {
  toast.error("Créditos insuficientes", {
    description: "Compre mais créditos para continuar gerando.",
  });
  return;
}
```

---

## Phase 7: Final Verification ✅

**Goal**: Ensure all code passes linting, type checking, and works end-to-end.

### Tasks

- [x] Run ESLint and fix any issues
  - [x] Execute: `pnpm run lint`
  - [x] Fix any linting errors

- [x] Run TypeScript type check
  - [x] Execute: `pnpm run typecheck`
  - [x] Fix any type errors

- [ ] Verify database table structure
  - [ ] Run: `pnpm run db:studio`
  - [ ] Confirm `generated_image` table exists with correct columns

- [ ] Test complete generation flow
  - [ ] Upload image and generate
  - [ ] Verify credit deduction
  - [ ] Check Vercel Blob for both images
  - [ ] Verify database record created
  - [ ] Check gallery displays new image
  - [ ] Test before/after slider
  - [ ] Test delete functionality

- [ ] Test edge cases
  - [ ] Generate with 0 credits (verify toast error)
  - [ ] Access API without auth (verify 401)
  - [ ] Delete another user's image (verify 404)
  - [ ] Delete own image (verify success)

### Technical Details

**Verification Commands**:

```bash
# Linting
pnpm run lint

# Type checking
pnpm run typecheck

# Database inspection
pnpm run db:studio
```

**Expected Storage Structure in Vercel Blob**:

```
bob-app-saas/
├── originals/
│   └── {userId}/
│       └── original-{timestamp}.png
└── generated/
    └── {userId}/
        └── generated-{timestamp}.png
```

---

## Dependencies

**Phase 2 depends on**: Phase 1 (schema must exist before API can use it)
**Phase 3 depends on**: Phase 1 (schema must exist before querying)
**Phase 5 depends on**: Phase 3 (API routes must exist before UI can consume)
**Phase 6 depends on**: Phase 2, Phase 5 (error handling for both generation and gallery)
**Phase 7 depends on**: All previous phases
