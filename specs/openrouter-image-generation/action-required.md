# Action Required: OpenRouter Image Generation Integration

Manual steps that must be completed by a human. These cannot be automated.

## Before Implementation

- [ ] **Verify OpenRouter API key is set** - The `OPENROUTER_API_KEY` environment variable must be configured (should already exist from chat feature)
- [ ] **Verify Vercel Blob token (optional for dev, required for production)** - `BLOB_READ_WRITE_TOKEN` enables cloud storage; without it, images are stored locally in `public/uploads/`

## During Implementation

None - all implementation steps are automated through code and migrations.

## After Implementation

- [ ] **Test generation flow** - Upload an image, generate a plush version, verify it appears in gallery
- [ ] **Test storage location** - Confirm images are stored in `bob-app-saas/` subfolder in Vercel Blob or `public/uploads/bob-app-saas/` locally
- [ ] **Test credit deduction** - Verify 1 credit is deducted per successful generation
- [ ] **Test insufficient credits error** - Try generating with 0 credits and verify the toast error appears
- [ ] **Test delete functionality** - Delete an image from gallery and verify both storage files and database record are removed
- [ ] **Test before/after slider** - Verify the slider component works correctly in the gallery view

---

> **Note:** These tasks are also listed in context within `implementation-plan.md`
