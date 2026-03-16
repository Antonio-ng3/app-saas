# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 16 SaaS application that transforms user photos into plush toy images using AI. The app uses Inngest for async background processing, BetterAuth for authentication, PostgreSQL with Drizzle ORM, and private Blob storage with authenticated proxy.

### Tech Stack

- **Framework**: Next.js 16 with App Router, React 19, TypeScript
- **AI Integration**: OpenRouter API for image generation (multimodal)
- **Job Processing**: Inngest (Cloud or Dev Server) for async plush generation
- **Authentication**: BetterAuth with Email/Password
- **Database**: PostgreSQL with Drizzle ORM
- **UI**: shadcn/ui components with Tailwind CSS 4
- **File Storage**: Vercel Blob (private, with authenticated proxy) / local filesystem (dev)

## Critical Architecture

### Private Blob Storage with Authenticated Proxy

**Important**: Images are stored as PRIVATE in Vercel Blob. Users can only access their own images through an authenticated proxy.

- Storage: `src/lib/storage.ts` uploads with `access: "private"`
- Proxy: `src/app/api/images/[...path]/route.ts` serves images after verifying user owns them
- URL conversion: `blobUrlToProxyUrl()` converts Blob URLs to proxy URLs for API responses

When working with image URLs:
- **Saving to DB**: Save the Blob URL or pathname from `upload()` result
- **Returning to client**: Use `blobUrlToProxyUrl()` to convert to `/api/images/...` URLs
- **Direct access**: Never return Blob URLs directly to clients

### Inngest Background Processing

Plush generation runs async through Inngest to avoid timeout issues:

1. Client calls `POST /api/generate-plush` → creates "pending" record, dispatches event
2. Inngest function `generate-plush` processes:
   - Step 1: Fetch and re-upload original image
   - Step 2: Call OpenRouter multimodal API for generation
   - Step 3: Save result and debit credit
3. Client polls `GET /api/generate-plush/status?recordId=X` until "complete"

**Inngest configuration** (`src/inngest/client.ts`):
- With `INNGEST_EVENT_KEY`: Uses Inngest Cloud
- Without: Uses local Dev Server (requires running `npx inngest-cli dev`)

**Important**: When fetching images from private Blob storage in Inngest, use `get()` from `@vercel/blob` with `access: "private"`.

### AI Image Generation

- Model: `google/gemini-3.1-flash-image-preview` via OpenRouter
- Prompt ordering: Text FIRST, then image (better model comprehension)
- Prompt defined in: `src/inngest/functions/generate-plush.ts` (`BASE_PLUSH_PROMPT`)
- Images stored under: `bob-app-saas/originals/{userId}/` and `bob-app-saas/generated/{userId}/`

## Environment Variables

Required for production:

```env
# Database
POSTGRES_URL=postgresql://user:password@localhost:5432/db_name

# Better Auth
BETTER_AUTH_SECRET=32-char-random-string

# AI via OpenRouter
OPENROUTER_API_KEY=sk-or-v1-your-key
OPENROUTER_MODEL=openai/gpt-4o-mini
OPENROUTER_IMAGE_MODEL=google/gemini-3.1-flash-image-preview

# Inngest (optional - for async plush generation)
INNGEST_EVENT_KEY=  # Set for Inngest Cloud, leave empty for Dev Server

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# File Storage
BLOB_READ_WRITE_TOKEN=  # Required for private Blob storage in production
```

## Available Scripts

```bash
pnpm run dev          # Start dev server with Turbopack
pnpm run build        # Build for production (runs db:migrate first)
pnpm run start        # Start production server
pnpm run check        # Run lint AND typecheck together
pnpm run lint         # Run ESLint
pnpm run typecheck    # TypeScript type checking
pnpm run db:generate  # Generate database migrations
pnpm run db:migrate   # Run database migrations
pnpm run db:push      # Push schema changes to database
pnpm run db:studio    # Open Drizzle Studio (database GUI)
```

## Guidelines for AI Assistants

### CRITICAL RULES

1. **ALWAYS run `pnpm run check`** (lint + typecheck) after completing changes

2. **NEVER start the dev server yourself** - ask the user to provide output if needed

3. **Use OpenRouter, NOT OpenAI directly**
   - Import from `@openrouter/ai-sdk-provider`
   - Model names: `provider/model-name`

4. **Private Blob Storage**
   - Images are PRIVATE - use authenticated proxy for access
   - Import: `import { upload, deleteFile, blobUrlToProxyUrl } from "@/lib/storage"`
   - When fetching private images in Inngest: use `get()` with `access: "private"`

5. **Authentication**
   - Server: `import { auth } from "@/lib/auth"`
   - Client: `import { useSession } from "@/lib/auth-client"`

6. **Database**: Drizzle ORM (`@/lib/db`), PostgreSQL only

7. **API Routes**: Follow Next.js 16 App Router conventions

### Common Tasks

**Working with private images:**
```typescript
// Upload (returns Blob URL)
import { upload, blobUrlToProxyUrl } from "@/lib/storage";
const result = await upload(buffer, "image.png", "folder");

// Save to DB: result.url or result.pathname

// Return to client: convert to proxy URL
const proxyUrl = blobUrlToProxyUrl(result.url);
```

**Fetching private images in Inngest:**
```typescript
import { get } from "@vercel/blob";

const blobResult = await get(imageUrl, { access: "private" });
// Read from blobResult.stream
```

**Database operations:**
1. Update schema in `src/lib/schema.ts`
2. Generate: `pnpm run db:generate`
3. Apply: `pnpm run db:migrate`

## Package Manager

This project uses **pnpm**. Use `pnpm run [script]` for commands.
