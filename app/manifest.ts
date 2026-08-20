import type { MetadataRoute } from 'next'

// Next.js serves this at /manifest.webmanifest automatically.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'CinePop',
    short_name: 'CinePop',
    description: 'Pick, watch, and feel — your shared movie night app.',
    start_url: '/',
    display: 'standalone',
    background_color: '#fdeef5',
    theme_color: '#f43f72',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }
}
