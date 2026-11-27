import 'server-only'

/**
 * Every external service is optional. Missing configuration switches the
 * matching feature off instead of crashing the app (the 2023 deployment
 * returned 500 on every page once its Clerk keys stopped working).
 */
export const env = {
  databaseUrl: process.env.DATABASE_URL,
  databaseAuthToken: process.env.DATABASE_AUTH_TOKEN,
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
}

export const features = {
  /** Clerk needs both keys; the publishable one is also read in the browser. */
  auth: Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY),
  payments: Boolean(env.stripeSecretKey),
}
