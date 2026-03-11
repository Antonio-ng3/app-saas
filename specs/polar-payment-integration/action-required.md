# Action Required: Polar Payment Integration

Manual steps that must be completed by a human. These cannot be automated.

## Before Implementation

- [ ] **Create Polar Sandbox Account** at https://sandbox.polar.sh
  - Required for testing payment flow before going to production
  - Sign up with email/password or GitHub OAuth

- [ ] **Create Pro Product in Polar Dashboard**
  - Go to Products → Create Product
  - Name: "Plushify Pro - 50 Credits"
  - Type: Subscription (Recurring)
  - Price: R$ 29.00
  - Billing Period: Monthly
  - Description: "50 credits per month for generating plush toys"
  - **Copy the Product ID** (needed for `POLAR_PRO_PRODUCT_ID` env var)

- [ ] **Generate Polar Access Token**
  - Go to Organization Settings → Access Tokens
  - Click "Create Access Token"
  - Name it something descriptive like "Plushify Production" or "Plushify Sandbox"
  - **Copy the token** (starts with `polar_pat_`)
  - Save to `.env` as `POLAR_ACCESS_TOKEN`

- [ ] **Configure Polar Webhook**
  - Go to Organization Settings → Webhooks
  - Click "Add Webhook"
  - URL: `https://yourdomain.com/api/auth/[...all]` (use localhost for dev: `http://localhost:3000/api/auth/[...all]`)
  - Select events:
    - `order.paid` - Triggered when payment succeeds
    - `subscription.canceled` - Triggered when user cancels
  - **Copy the Webhook Secret** (starts with `polar_whsec_`)
  - Save to `.env` as `POLAR_WEBHOOK_SECRET`

- [ ] **Update .env file**
  - Add all three variables to `.env`:
    ```bash
    POLAR_ACCESS_TOKEN=polar_pat_...
    POLAR_WEBHOOK_SECRET=polar_whsec_...
    POLAR_PRO_PRODUCT_ID=prod_...
    ```

## During Implementation

- [ ] **Verify webhook endpoint is publicly accessible** (for production)
  - BetterAuth Polar plugin handles webhooks at `/api/auth/[...all]`
  - Ensure this route is accessible from Polar servers
  - Use tools like ngrok for local development testing

- [ ] **Test webhook signature verification**
  - Polar signs all webhook requests with the secret
  - The BetterAuth plugin handles this automatically
  - Verify by checking server logs when test payment is made

## After Implementation

- [ ] **Test full checkout flow in Polar Sandbox**
  - Create test account in your app
  - Verify customer appears in Polar Dashboard (Customers section)
  - Initiate checkout and complete test payment
  - Confirm 50 credits were added via webhook

- [ ] **Test subscription cancellation**
  - Use Polar Customer Portal to cancel subscription
  - Verify `subscriptionTier` changes to "free" in database
  - Confirm user retains access until period ends (Polar handles this)

- [ ] **Set up production Polar organization** (when ready for production)
  - Create organization at https://polar.sh (not sandbox)
  - Repeat product creation, access token, and webhook setup
  - Update `POLAR_ACCESS_TOKEN` and `POLAR_WEBHOOK_SECRET` to production values
  - Ensure `NODE_ENV=production` in production environment

- [ ] **Monitor webhook deliveries** in Polar Dashboard
  - Check Webhooks → Deliveries to see failed/successful webhook calls
  - Investigate any failures immediately

---

> **Note:** These tasks are also listed in context within `implementation-plan.md`
