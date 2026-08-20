import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/components/auth/AuthProvider'
import { CircleProvider } from '@/components/auth/CircleProvider'
import { OnboardingProvider } from '@/components/auth/OnboardingProvider'
import { TabTourProvider } from '@/components/auth/TabTourProvider'

const SITE_URL = 'https://cinepop.live'
const TITLE = 'CinePop 🍿'
const DESCRIPTION = 'Pick, watch, and feel — your shared movie night app.'

export const metadata: Metadata = {
  // Required so relative asset paths (like the auto-detected opengraph-image)
  // resolve to absolute URLs wherever the site is shared from.
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: 'CinePop',
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: 'CinePop',
    type: 'website',
    // app/opengraph-image.png is picked up automatically by this convention,
    // but we set it explicitly too for clarity + reliable dimensions.
    images: [{ url: '/opengraph-image.png', width: 1200, height: 630, alt: 'CinePop' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CinePop',
    description: DESCRIPTION,
    images: ['/opengraph-image.png'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="grain min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-sky-50">
        <AuthProvider>
          <CircleProvider>
            <TabTourProvider>
              <OnboardingProvider>{children}</OnboardingProvider>
            </TabTourProvider>
          </CircleProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
