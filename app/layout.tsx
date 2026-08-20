import type { Metadata, Viewport } from 'next'
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
  // "Add to Home Screen" polish on iOS Safari (Android reads app/manifest.ts).
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'CinePop',
  },
}

// themeColor lives in a separate `viewport` export (Next.js 14 convention),
// tinting the browser UI / iOS status bar to match the brand.
export const viewport: Viewport = {
  themeColor: '#f43f72',
  width: 'device-width',
  initialScale: 1,
}

// Site-wide structured data — gives Google a consistent identity for CinePop
// (name, url, logo) across every page, independent of the homepage's
// page-specific WebApplication JSON-LD.
const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'CinePop',
  url: SITE_URL,
  logo: `${SITE_URL}/icon.png`,
  description: DESCRIPTION,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
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
