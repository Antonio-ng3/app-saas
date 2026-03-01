# Requirements: OpenRouter Image Generation Integration

## Overview

Integrate OpenRouter's `google/gemini-2.5-flash-image` model for AI-powered plush toy image generation, replacing the current OpenAI DALL-E 3 implementation. The feature will persist generated images in Vercel Blob storage and database, enabling a user gallery with before/after comparison.

## Problem Statement

The current implementation has several limitations:
- Uses OpenAI DALL-E 3 directly (not OpenRouter)
- Generated images are not persisted - users lose access after generation
- Gallery uses mock data instead of real user generations
- No ability to view or delete past generations
- Inconsistent with the project's OpenRouter-first architecture

## Solution

Replace the image generation pipeline with OpenRouter integration, add database persistence for all generations, implement a real user gallery, and enable image management (view, delete, compare).

## Acceptance Criteria

### Given a user with available credits
- When they upload an image and click "Generate"
- Then 1 credit is deducted
- And the original image is stored in Vercel Blob (`bob-app-saas/originals/{userId}/`)
- And a new plush version is generated using OpenRouter
- And the generated image is stored in Vercel Blob (`bob-app-saas/generated/{userId}/`)
- And a database record is created linking both images
- And the user sees the before/after comparison

### Given a user with insufficient credits (0)
- When they attempt to generate an image
- Then generation is blocked
- And a toast error appears: "Créditos insuficientes - Compre mais créditos para continuar gerando"
- And no credits are deducted

### Given a user with generated images
- When they visit the gallery page
- Then they see only their own images (not other users')
- And images are sorted by newest first
- And they can use a before/after slider to compare original vs generated
- And they can delete images (which removes from storage and database)

### Given an authenticated user
- When they access image generation endpoints
- Then their session is validated
- And unauthorized requests return 401

## Technical Requirements

- **AI Model**: `google/gemini-2.5-flash-image` via OpenRouter
- **Storage**: Vercel Blob with subfolder `bob-app-saas/` (same storage as other projects)
- **Database**: New `generated_image` table with user relationship
- **Auth**: BetterAuth session validation on all endpoints
- **UI**: Sonner toasts for errors, before/after slider for comparison

## User Stories

1. **Generate Plush Image**
   - As a user, I want to transform my photo into a plush toy version so I can see how it would look as a stuffed animal.

2. **Persistent Gallery**
   - As a user, I want to see all my past generations so I can revisit and download them later.

3. **Manage Generations**
   - As a user, I want to delete generations I don't like so my gallery stays organized.

4. **Before/After Comparison**
   - As a user, I want to compare the original and generated images side-by-side so I can appreciate the transformation.

## Dependencies

- **BetterAuth**: Session management (already implemented)
- **Vercel Blob Storage**: File storage via `@/lib/storage.ts` (already implemented)
- **Drizzle ORM**: Database operations (already implemented)
- **OpenRouter SDK**: `@openrouter/ai-sdk-provider` (already installed for chat)
- **AI SDK**: `ai` package (already installed)
- **Sonner**: Toast notifications (already implemented)
- **BeforeAfterSlider**: Comparison component (already implemented)

## Out of Scope

- Image editing tools (crop, rotate, filters)
- Social sharing (posting to social media)
- Public gallery (seeing other users' generations)
- Image regeneration variations
- Batch generation
- Credit purchasing flow (already exists separately)

## Related Features

- Credit system (`/api/user/credits/route.ts`)
- Dashboard generation UI (`/app/dashboard/page.tsx`)
- Gallery page (`/app/gallery/page.tsx`)
- Storage abstraction (`/lib/storage.ts`)
