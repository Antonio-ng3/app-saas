import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { db } from "./db"

export const auth = betterAuth({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  // Rate limiting configuration
  rateLimit: {
    window: 15, // 15 minutes
    max: 5, // maximum 5 attempts per window
  },
  advanced: {
    cookiePrefix: "plushify",
    useSecureCookies: process.env.NODE_ENV === "production",
    crossSubDomainCookies: {
      enabled: false,
    },
    sessionMaxAge: 7 * 24 * 60 * 60, // 7 days in seconds
  },
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      // Log password reset URL to terminal (no email integration yet)
      // eslint-disable-next-line no-console
      console.log(`\n${"=".repeat(60)}\nPASSWORD RESET REQUEST\nUser: ${user.email}\nReset URL: ${url}\n${"=".repeat(60)}\n`)
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      // Log verification URL to terminal (no email integration yet)
      // eslint-disable-next-line no-console
      console.log(`\n${"=".repeat(60)}\nEMAIL VERIFICATION\nUser: ${user.email}\nVerification URL: ${url}\n${"=".repeat(60)}\n`)
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      enabled: true,
    },
  },
})