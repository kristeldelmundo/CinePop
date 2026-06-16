'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import RequireAuth from '@/components/auth/RequireAuth'
import {
  ChevronDown, Users, Film, Shuffle, Star, TrendingUp, Share2, Sparkles, Search, X,
} from 'lucide-react'
import { clsx } from 'clsx'

interface HelpItem {
  id: string
  q: string
  a: string
}

interface HelpSection {
  id: string
  icon: typeof Users
  emoji: string
  title: string
  items: HelpItem[]
}

const SECTIONS: HelpSection[] = [
  {
    id: 'circles',
    icon: Users,
    emoji: '🍿',
    title: 'Circles',
    items: [
      {
        id: 'circles-create',
        q: 'How do I create a circle?',
        a: 'Go to My Circles (from your profile chip, top right), tap "Create a new circle," give it a name and an emoji, then tap "Create circle." You\'ll land in it right away.',
      },
      {
        id: 'circles-add-someone',
        q: 'How do I add someone to my circle?',
        a: 'Open My Circles, make sure the right circle is selected, then either tap "Copy invite link" and send it to them, or use "Invite by email" if they already have a CinePop account — they\'ll get a notification to accept.',
      },
      {
        id: 'circles-join',
        q: 'How do I join a circle someone invited me to?',
        a: 'Tap the invite link they sent — it\'ll open straight to the join screen. Or paste the invite code (or the whole link) into the "Join a circle" box on My Circles.',
      },
      {
        id: 'circles-multiple',
        q: 'Can I be in more than one circle?',
        a: 'Yes — use the circle switcher in the top-left of the navbar to jump between circles. Each one has its own separate watchlist.',
      },
      {
        id: 'circles-remove-leave',
        q: 'How do I remove someone or leave a circle?',
        a: 'On My Circles, tap the small X next to a member to remove them (owners can\'t be removed). If you want to leave a circle yourself, use the "Leave this circle" button — circle owners can\'t leave their own circle.',
      },
    ],
  },
  {
    id: 'movies',
    icon: Film,
    emoji: '📚',
    title: 'Adding movies & shows',
    items: [
      {
        id: 'movies-add',
        q: 'How do I add a movie or show?',
        a: 'Go to Library and use the search box near the top — type a title, pick it from the results, and it\'s added to your circle\'s shared watchlist instantly.',
      },
      {
        id: 'movies-add-trending',
        q: 'How do I add something from Trending?',
        a: 'Go to Trending, find a title, and tap its + button — it\'s added straight to your library without needing to search.',
      },
      {
        id: 'movies-mark-watched',
        q: 'How do I mark something as watched?',
        a: 'Tap a poster in Library to open it, then use the "Mark as watched" action. You can also mark something watched right after picking it with "Pick for us!"',
      },
      {
        id: 'movies-filter',
        q: 'Can I filter my library?',
        a: 'Yes — use the filter pills above the grid to show only movies, only TV shows, only what\'s unwatched, or only what a specific circle member added.',
      },
    ],
  },
  {
    id: 'randomizer',
    icon: Shuffle,
    emoji: '🎲',
    title: 'Pick for us!',
    items: [
      {
        id: 'randomizer-how',
        q: 'How does "Pick for us!" work?',
        a: 'Go to Pick for us! and tap the big button — CinePop randomly picks one unwatched title from your circle\'s library and shows it with a trailer link.',
      },
      {
        id: 'randomizer-filter',
        q: 'Can I narrow down what it picks from?',
        a: 'Yes — use the filter pills (Movies only, TV only, or a specific person\'s picks) before spinning to limit the pool.',
      },
      {
        id: 'randomizer-dislike',
        q: 'I don\'t like the pick — what now?',
        a: 'Tap "Different pick" to spin again, or "We watched this!" to mark it watched, or "Rate it now" to jump straight to Rate & Share.',
      },
    ],
  },
  {
    id: 'rate',
    icon: Star,
    emoji: '⭐',
    title: 'Rating & sharing',
    items: [
      {
        id: 'rate-how',
        q: 'How do I rate something I watched?',
        a: 'Go to Rate & Share, find the title, and give it a star rating plus an emoji reaction (like "So good 🍿" or "We cried 😭"). Everyone in your circle can see what you thought.',
      },
    ],
  },
  {
    id: 'trending',
    icon: TrendingUp,
    emoji: '🔥',
    title: 'Trending',
    items: [
      {
        id: 'trending-what',
        q: 'What is the Trending page?',
        a: 'A list of what\'s popular right now, refreshed regularly. Tap + on anything to add it to your circle\'s library without searching.',
      },
    ],
  },
  {
    id: 'profile',
    icon: Share2,
    emoji: '✨',
    title: 'Profile & sharing',
    items: [
      {
        id: 'profile-customize',
        q: 'How do I customize my profile?',
        a: 'Go to My Profile and tap Edit — you can set a display name, username, avatar, accent color, background, font, favorite genres, and custom "If I had to pick" categories.',
      },
      {
        id: 'profile-share-link',
        q: 'What is my share link?',
        a: 'It\'s a public, read-only view of your profile at cinepop.live/@yourusername (or cinepop.live/@your-id if you haven\'t set a username yet). Tap Share on your profile to copy it or save a shareable image.',
      },
      {
        id: 'profile-replay-tour',
        q: 'Can I replay the welcome tour?',
        a: 'Yes — on My Profile, tap "View onboarding" to replay the welcome wizard and the navbar walkthrough from the start.',
      },
    ],
  },
]

// Flat list of every item with its parent section, for searching.
const ALL_ITEMS: { item: HelpItem; sectionId: string }[] = SECTIONS.flatMap(
  (s) => s.items.map((item) => ({ item, sectionId: s.id })),
)

// Simple keyword-overlap scorer — no fuzzy-search library needed for this
// amount of content. Question-text matches count for more than answer-text
// matches; exact substring matches count for more than individual word hits.
function scoreItem(query: string, item: HelpItem): number {
  const q = query.trim().toLowerCase()
  if (!q) return 0
  const question = item.q.toLowerCase()
  const answer = item.a.toLowerCase()

  let score = 0
  if (question.includes(q)) score += 10
  if (answer.includes(q)) score += 4

  const words = q.split(/\s+/).filter((w) => w.length > 2)
  for (const w of words) {
    if (question.includes(w)) score += 2
    if (answer.includes(w)) score += 1
  }
  return score
}

function findBestMatch(query: string): { item: HelpItem; sectionId: string } | null {
  let best: { item: HelpItem; sectionId: string } | null = null
  let bestScore = 0
  for (const entry of ALL_ITEMS) {
    const s = scoreItem(query, entry.item)
    if (s > bestScore) {
      bestScore = s
      best = entry
    }
  }
  return bestScore > 0 ? best : null
}

function HelpAccordionItem({
  item,
  open,
  highlighted,
  onToggle,
}: {
  item: HelpItem
  open: boolean
  highlighted: boolean
  onToggle: () => void
}) {
  return (
    <div
      id={`item-${item.id}`}
      className={clsx(
        'border-b border-rose-50 last:border-b-0 rounded-lg transition-colors scroll-mt-24',
        highlighted && 'bg-rose-50/80 -mx-2 px-2',
      )}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-3 py-3 text-left"
      >
        <span className="text-sm font-medium text-gray-700">{item.q}</span>
        <ChevronDown
          size={16}
          className={clsx('text-gray-400 flex-shrink-0 transition-transform', open && 'rotate-180')}
        />
      </button>
      {open && (
        <p className="text-[13px] text-gray-500 leading-relaxed pb-3 pr-6">{item.a}</p>
      )}
    </div>
  )
}

function HelpInner() {
  const [query, setQuery] = useState('')
  const [openIds, setOpenIds] = useState<Set<string>>(new Set())
  const [highlightId, setHighlightId] = useState<string | null>(null)
  const [noMatch, setNoMatch] = useState(false)
  const highlightTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  function toggleItem(id: string) {
    setOpenIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function runSearch() {
    setNoMatch(false)
    const match = findBestMatch(query)
    if (!match) {
      setNoMatch(true)
      return
    }
    const { item } = match
    setOpenIds((prev) => new Set(prev).add(item.id))
    setHighlightId(item.id)

    if (highlightTimer.current) clearTimeout(highlightTimer.current)
    highlightTimer.current = setTimeout(() => setHighlightId(null), 2500)

    // Scroll after the accordion has had a tick to open.
    setTimeout(() => {
      document.getElementById(`item-${item.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 50)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    runSearch()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-sky-50">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">🍿</div>
          <h1 className="font-display text-3xl font-bold text-gray-800 mb-2">
            Help <span className="gradient-text italic">Center</span>
          </h1>
          <p className="text-sm text-gray-400 max-w-md mx-auto">
            Everything you need to know about creating circles, adding movies, and getting the most out of CinePop.
          </p>
        </div>

        {/* Ask-a-question search */}
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
            <input
              value={query}
              onChange={(e) => { setQuery(e.target.value); setNoMatch(false) }}
              placeholder="Ask a question, like “how do I invite my partner?”"
              className="w-full bg-white/90 border border-rose-100 rounded-full pl-11 pr-20 py-3 text-sm outline-none focus:border-rose-300 shadow-sm"
            />
            {query && (
              <button
                type="button"
                onClick={() => { setQuery(''); setNoMatch(false) }}
                className="absolute right-16 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500"
                aria-label="Clear search"
              >
                <X size={15} />
              </button>
            )}
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold px-3.5 py-2 rounded-full transition-all"
            >
              Find it
            </button>
          </div>
          {noMatch && (
            <p className="text-xs text-gray-400 mt-2 px-2">
              Couldn&apos;t find a close match for that — try different words, or browse a section below.
            </p>
          )}
        </form>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {SECTIONS.map(s => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="flex items-center gap-1.5 bg-white/80 hover:bg-white text-rose-600 text-xs font-semibold px-3 py-1.5 rounded-full transition-all shadow-sm"
            >
              <span>{s.emoji}</span> {s.title}
            </a>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          {SECTIONS.map(({ id, emoji, title, items }) => (
            <section key={id} id={id} className="glass rounded-2xl p-5 scroll-mt-20">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">{emoji}</span>
                <h2 className="font-display text-lg font-bold text-gray-800">{title}</h2>
              </div>
              <div className="mt-2">
                {items.map((item) => (
                  <HelpAccordionItem
                    key={item.id}
                    item={item}
                    open={openIds.has(item.id)}
                    highlighted={highlightId === item.id}
                    onToggle={() => toggleItem(item.id)}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="text-center mt-10">
          <p className="text-sm text-gray-400 mb-3">Still stuck, or have feedback?</p>
          <Link
            href="/profile"
            className="inline-flex items-center gap-1.5 bg-rose-500 hover:bg-rose-600 text-white text-sm font-medium px-5 py-2.5 rounded-full transition-all"
          >
            <Sparkles size={14} /> Back to your profile
          </Link>
        </div>
      </main>
    </div>
  )
}

export default function HelpPage() {
  return (
    <RequireAuth>
      <HelpInner />
    </RequireAuth>
  )
}
