# Implementation Plan: Polar Payment Integration

## Overview

Integrate BetterAuth's Polar plugin to enable subscription-based credit purchases, webhook-driven credit allocation, and customer portal access.

## Phase 1: Install Dependencies

Install the required Polar packages for BetterAuth integration.

### Tasks

- [ ] Install `@polar-sh/better-auth` and `@polar-sh/sdk` packages

### Technical Details

```bash
pnpm add @polar-sh/better-auth @polar-sh/sdk
```

---

## Phase 2: Database Schema Updates

Add subscription tracking fields to the user table and generate/run migrations.

### Tasks

- [ ] Add `subscriptionTier` field to user table (default: "free")
- [ ] Add `creditsLastSyncedAt` timestamp field to user table
- [ ] Generate database migration with `pnpm run db:generate`
- [ ] Run database migration with `pnpm run db:migrate`

### Technical Details

**File**: `src/lib/schema.ts`

Add to the `user` pgTable definition:

```typescript
export const user = pgTable("user", {
  // ... existing fields
  subscriptionTier: text("subscription_tier").default("free").notNull(),
  creditsLastSyncedAt: timestamp("credits_last_synced_at"),
  // ... rest of fields
});
```

**Also update BetterAuth additionalFields** (in Phase 3):
```typescript
user: {
  additionalFields: {
    platformRole: { /* existing */ },
    subscriptionTier: {
      type: ["free", "pro", "enterprise"],
      defaultValue: "free",
      input: false,
    },
  },
},
```

**CLI Commands**:
```bash
pnpm run db:generate  # Generates migration based on schema changes
pnpm run db:migrate   # Applies migration to database
```

---

## Phase 3: Configure BetterAuth Server with Polar Plugin

Configure the Polar plugin with checkout, portal, and webhook handlers.

### Tasks

- [ ] Import Polar SDK and BetterAuth Polar plugin
- [ ] Create Polar client instance (sandbox or production based on NODE_ENV)
- [ ] Add `polar()` plugin to BetterAuth configuration
- [ ] Enable `createCustomerOnSignUp: true`
- [ ] Configure `checkout` plugin with Pro product slug
- [ ] Configure `portal` plugin for customer management
- [ ] Configure `webhooks` plugin with secret and event handlers
- [ ] Add `onOrderPaid` handler to add credits and update tier
- [ ] Add `onSubscriptionCanceled` handler to downgrade tier to "free"
- [ ] Add `subscriptionTier` to BetterAuth additionalFields

### Technical Details

**File**: `src/lib/auth.ts`

**Add imports**:
```typescript
import { polar, checkout, portal, webhooks } from "@polar-sh/better-auth"
import { Polar } from "@polar-sh/sdk"
import { eq } from "drizzle-orm"
```

**Create Polar client** (after db import):
```typescript
const polarClient = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
  server: process.env.NODE_ENV === "production" ? "production" : "sandbox",
})
```

**Add to user.additionalFields**:
```typescript
subscriptionTier: {
  type: ["free", "pro", "enterprise"],
  defaultValue: "free",
  input: false,
},
```

**Add plugins array** (before closing betterAuth):
```typescript
plugins: [
  polar({
    client: polarClient,
    createCustomerOnSignUp: true,
    use: [
      checkout({
        products: [
          {
            productId: process.env.POLAR_PRO_PRODUCT_ID!,
            slug: "pro",
          },
        ],
        successUrl: "/checkout/success?checkout_id={CHECKOUT_ID}",
        authenticatedUsersOnly: true,
      }),
      portal(),
      webhooks({
        secret: process.env.POLAR_WEBHOOK_SECRET!,
        onOrderPaid: async (payload) => {
          // Add credits when payment succeeds
          const userId = payload.data.customer.external_id
          if (!userId) return

          const productId = payload.data.product.id
          const isProProduct = productId === process.env.POLAR_PRO_PRODUCT_ID

          if (isProProduct) {
            await db.update(user)
              .set({
                credits: sql`credits + 50`,
                subscriptionTier: "pro",
                creditsLastSyncedAt: new Date(),
              })
              .where(eq(user.id, userId))
          }
        },
        onSubscriptionCanceled: async (payload) => {
          // Handle subscription cancellation
          const userId = payload.data.customer.external_id
          if (!userId) return

          await db.update(user)
            .set({ subscriptionTier: "free" })
            .where(eq(user.id, userId))
        },
      }),
    ],
  }),
],
```

**Required imports** (add to top):
```typescript
import { sql } from "drizzle-orm"
```

---

## Phase 4: Update BetterAuth Client

Add the Polar client plugin to enable checkout and portal methods on the client side.

### Tasks

- [ ] Import `polarClient` from `@polar-sh/better-auth/client`
- [ ] Add `polarClient()` plugin to createAuthClient

### Technical Details

**File**: `src/lib/auth-client.ts`

```typescript
import { createAuthClient } from "better-auth/react"
import { polarClient } from "@polar-sh/better-auth/client"

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  plugins: [polarClient()],
})

export const {
  signIn,
  signOut,
  signUp,
  useSession,
  getSession,
  requestPasswordReset,
  resetPassword,
  sendVerificationEmail,
} = authClient
```

---

## Phase 5: Create Checkout Success Page

Create a page that displays after successful Polar checkout.

### Tasks

- [ ] Create `/checkout/success/page.tsx` with success message
- [ ] Parse `checkout_id` from URL query params
- [ ] Show loading state while verifying checkout
- [ ] Display success message with button to dashboard
- [ ] Handle missing checkout_id (redirect to dashboard)

### Technical Details

**File**: `src/app/checkout/success/page.tsx` (NEW)

```typescript
"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { CheckCircle2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isVerifying, setIsVerifying] = useState(true)

  useEffect(() => {
    const verifyCheckout = async () => {
      const checkoutId = searchParams.get("checkout_id")
      if (!checkoutId) {
        router.push("/dashboard")
        return
      }

      // Credits are added via webhook, just wait a moment
      await new Promise(resolve => setTimeout(resolve, 2000))
      setIsVerifying(false)
    }

    verifyCheckout()
  }, [searchParams, router])

  return (
    <div className="container mx-auto px-4 py-16">
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-6 text-center space-y-4">
          {isVerifying ? (
            <>
              <Loader2 className="h-16 w-16 mx-auto animate-spin text-primary" />
              <h1 className="text-2xl font-bold">Verificando pagamento...</h1>
              <p className="text-muted-foreground">
                Aguarde enquanto confirmamos sua assinatura.
              </p>
            </>
          ) : (
            <>
              <CheckCircle2 className="h-16 w-16 mx-auto text-green-500" />
              <h1 className="text-2xl font-bold">Pagamento Confirmado!</h1>
              <p className="text-muted-foreground">
                Sua assinatura Pro está ativa. Você já pode usar seus créditos.
              </p>
              <Button asChild className="w-full">
                <button onClick={() => router.push("/dashboard")}>
                  Ir para o Dashboard
                </button>
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
```

---

## Phase 6: Update Landing Page Pricing Section

Update the "Assinar Pro" button to use Polar checkout instead of linking to register.

### Tasks

- [ ] Update "Assinar Pro" button in pricing section to use `authClient.checkout()`
- [ ] Add loading state during checkout initiation
- [ ] Handle checkout errors gracefully

### Technical Details

**File**: `src/app/page.tsx`

**Locate the Pro Plan button** (around line 467-469):

Current code:
```tsx
<Button asChild className="w-full">
  <Link href="/register">Assinar Pro</Link>
</Button>
```

**Replace with** (make section client-side or extract to component):
```tsx
<Button
  className="w-full"
  onClick={async () => {
    try {
      await authClient.checkout({ slug: "pro" })
    } catch (error) {
      console.error("Checkout error:", error)
    }
  }}
>
  Assinar Pro
</Button>
```

**Note**: Since `page.tsx` is a Server Component and needs `authClient`, you may need to:
1. Extract the pricing section to a separate client component, OR
2. Move the entire pricing section to a client component

---

## Phase 7: Create Dedicated Pricing Page

Create a standalone pricing page with checkout integration.

### Tasks

- [ ] Create `/pricing/page.tsx` with 3 pricing tiers
- [ ] Add checkout integration to Pro plan button
- [ ] Keep Free and Enterprise buttons as Link components
- [ ] Import and use required UI components (Card, Badge, Button, etc.)

### Technical Details

**File**: `src/app/pricing/page.tsx` (NEW)

```typescript
"use client"

import Link from "next/link"
import { CheckCircle2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { authClient } from "@/lib/auth-client"

export default function PricingPage() {
  const handleSubscribePro = async () => {
    try {
      await authClient.checkout({ slug: "pro" })
    } catch (error) {
      console.error("Checkout error:", error)
    }
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl font-bold">Planos e Preços</h1>
        <p className="text-muted-foreground text-lg">
          Escolha o plano ideal para você
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {/* Free Plan Card */}
        <Card>
          <CardContent className="p-6 space-y-6">
            <div>
              <h3 className="text-2xl font-bold">Free</h3>
              <p className="text-muted-foreground">Para experimentar</p>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold">R$0</span>
              <span className="text-muted-foreground">/mês</span>
            </div>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span>1 crédito grátis</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span>Qualidade padrão</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span>3 estilos disponíveis</span>
              </li>
            </ul>
            <Button asChild className="w-full" variant="outline">
              <Link href="/register">Começar Grátis</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Pro Plan Card */}
        <Card className="border-2 border-primary relative">
          <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
            Mais Popular
          </Badge>
          <CardContent className="p-6 space-y-6">
            <div>
              <h3 className="text-2xl font-bold">Pro</h3>
              <p className="text-muted-foreground">Para usuários ativos</p>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold">R$29</span>
              <span className="text-muted-foreground">/mês</span>
            </div>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span>50 créditos por mês</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span>Alta resolução</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span>Todos os 5 estilos</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span>Galeria ilimitada</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span>Suporte prioritário</span>
              </li>
            </ul>
            <Button className="w-full" onClick={handleSubscribePro}>
              Assinar Pro
            </Button>
          </CardContent>
        </Card>

        {/* Enterprise Plan Card */}
        <Card>
          <CardContent className="p-6 space-y-6">
            <div>
              <h3 className="text-2xl font-bold">Enterprise</h3>
              <p className="text-muted-foreground">Para empresas</p>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold">Custom</span>
            </div>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span>Créditos ilimitados</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span>API access</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span>Estilos personalizados</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span>Gerente de conta</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span>SLA garantido</span>
              </li>
            </ul>
            <Button asChild className="w-full" variant="outline">
              <Link href="/contact">Fale Conosco</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
```

**Also update** `src/components/credits-display.tsx` line 55:
```typescript
// The link currently goes to /pricing - this will now work
<Link href="/pricing" {...(onBuyMore && { onClick: onBuyMore })}>
```

---

## Phase 8: Update Profile Page with Subscription Management

Add subscription status display and management buttons to the profile page.

### Tasks

- [ ] Add subscription card to profile page
- [ ] Display current subscription tier (Free/Pro/Enterprise)
- [ ] Add "Manage Subscription" button for Pro users (opens Polar Portal)
- [ ] Add "Upgrade to Pro" button for Free users

### Technical Details

**File**: `src/app/profile/page.tsx`

**Add a new Card** after the "Account Information" card (after line 199):

```tsx
{/* Subscription Management Card */}
<Card>
  <CardHeader>
    <CardTitle>Subscription</CardTitle>
    <CardDescription>Manage your subscription and billing</CardDescription>
  </CardHeader>
  <CardContent className="space-y-4">
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div>
        <p className="font-medium">Current Plan</p>
        <p className="text-sm text-muted-foreground">
          {user.subscriptionTier === "pro" ? "Pro Plan" :
           user.subscriptionTier === "enterprise" ? "Enterprise Plan" :
           "Free Plan"}
        </p>
      </div>
      <Badge variant={user.subscriptionTier === "pro" ? "default" : "secondary"}>
        {user.subscriptionTier === "pro" ? "Active" :
         user.subscriptionTier === "enterprise" ? "Enterprise" :
         "Free"}
      </Badge>
    </div>
    {user.subscriptionTier === "pro" && (
      <Button
        variant="outline"
        className="w-full"
        onClick={async () => {
          try {
            await authClient.customer.portal()
          } catch (error) {
            console.error("Portal error:", error)
          }
        }}
      >
        Manage Subscription
      </Button>
    )}
    {user.subscriptionTier === "free" && (
      <Button
        className="w-full"
        onClick={async () => {
          try {
            await authClient.checkout({ slug: "pro" })
          } catch (error) {
            console.error("Checkout error:", error)
          }
        }}
      >
        Upgrade to Pro
      </Button>
    )}
  </CardContent>
</Card>
```

**Note**: You'll need to add `authClient` import at the top if not already present:
```typescript
import { authClient } from "@/lib/auth-client"
```

---

## Environment Variables

Add the following to your `.env` file:

```bash
# Polar payment processing
POLAR_ACCESS_TOKEN=polar_pat_...
POLAR_WEBHOOK_SECRET=polar_whsec_...
POLAR_PRO_PRODUCT_ID=prod_...
```

## Testing Checklist

After implementation, verify:

- [ ] Create test account → verify Polar customer was created in Polar Dashboard
- [ ] Click "Assinar Pro" → redirects to Polar checkout
- [ ] Complete test payment in sandbox → webhook adds 50 credits
- [ ] Check profile page shows "Pro" tier badge
- [ ] Click "Manage Subscription" → opens Polar Customer Portal
- [ ] Cancel subscription in portal → tier downgrades to "free"
- [ ] Verify `pnpm run lint && pnpm run typecheck` passes
