import { ClerkProvider } from '@clerk/nextjs'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { features } from '@/config/env'
import './globals.css'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: { default: 'Epic Games Store (demo)', template: '%s · Epic Games Store (demo)' },
  description:
    'A portfolio demo of a game storefront built with Next.js, Drizzle ORM and SQLite, with optional Clerk sign-in and Stripe checkout.',
}

const clerkAppearance = {
  variables: { colorPrimary: '#26bbff', colorBackground: '#202020', colorText: '#fafafa' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const page = (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  )
  // Clerk is optional: without keys the store runs as a guest-only demo.
  return features.auth ? <ClerkProvider appearance={clerkAppearance}>{page}</ClerkProvider> : page
}
