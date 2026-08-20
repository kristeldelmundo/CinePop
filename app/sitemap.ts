import type { MetadataRoute } from 'next'

const SITE_URL = 'https://cinepop.live'

// Served automatically at /sitemap.xml. Only public, indexable pages —
// everything else (watchlist, circles, profile, etc.) lives behind a login
// wall and has nothing useful to offer a crawler.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ]
}
