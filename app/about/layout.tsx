import type { Metadata } from 'next'

// app/about/page.tsx is a client component ('use client'), and Next.js
// requires `metadata` to be exported from a server component — so it lives
// here in a thin layout wrapper instead of the page itself.
export const metadata: Metadata = {
  title: 'About CinePop 🍿',
  description:
    "The story behind CinePop — a shared movie-night app built by Kristel so she and her boyfriend would stop arguing about what to watch. Say hi, leave a suggestion, or buy us a coffee.",
  openGraph: {
    title: 'About CinePop',
    description:
      "The story behind CinePop — built so movie nights stop starting with an argument.",
  },
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children
}
