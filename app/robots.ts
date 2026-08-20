import type { MetadataRoute } from 'next'

const SITE_URL = 'https://cinepop.live'

// Served automatically at /robots.txt. Lets crawlers index the public pages
// and keeps them out of anything that requires being logged in — there's
// nothing for a search engine to usefully index behind auth anyway.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/about'],
      disallow: ['/watchlist', '/circles', '/profile', '/api', '/join', '/login', '/onboarding'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
