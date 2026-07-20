'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import RecapCard, { type RecapData } from '@/components/circles/RecapCard'
import { ChevronDown, Sparkles, Loader2 } from 'lucide-react'
import { clsx } from 'clsx'

// A collapsible "share our recap" section for the circles page. Loads the
// circle's watched titles + the most common reaction, and renders a
// shareable card. Self-contained so the big circles page stays readable.

export default function RecapSection({
  circleId,
  circleName,
  circleEmoji,
  memberCount,
}: {
  circleId: string
  circleName: string
  circleEmoji: string
  memberCount: number
}) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<RecapData | null>(null)

  const load = useCallback(async () => {
    setLoading(true)

    // Watched titles for this circle, newest first.
    const { data: items } = await supabase
      .from('watchlist_items')
      .select('title, created_at')
      .eq('circle_id', circleId)
      .eq('watched', true)
      .order('created_at', { ascending: false })

    // Most common reaction across this circle's reviews.
    const { data: reviews } = await supabase
      .from('reviews')
      .select('reactions')
      .eq('circle_id', circleId)

    let topReaction: string | null = null
    if (reviews && reviews.length) {
      const counts: Record<string, number> = {}
      reviews.forEach((r) =>
        (r.reactions || []).forEach((lbl: string) => {
          counts[lbl] = (counts[lbl] || 0) + 1
        }),
      )
      const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]
      if (top) topReaction = top[0]
    }

    const monthLabel = new Date().toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    })

    setData({
      circleName,
      circleEmoji,
      monthLabel,
      watchedCount: items?.length || 0,
      titles: (items || []).map((i) => i.title),
      topReaction,
      memberCount,
    })
    setLoading(false)
  }, [circleId, circleName, circleEmoji, memberCount])

  // Load lazily the first time the section is opened.
  useEffect(() => {
    if (open && !data && !loading) load()
  }, [open, data, loading, load])

  return (
    <div className="glass rounded-2xl overflow-hidden mb-3">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-2 px-4 py-3 text-sm font-medium text-gray-600 hover:text-rose-500 transition-colors"
      >
        <span className="flex items-center gap-2">
          <Sparkles size={16} /> Share your movie recap
        </span>
        <ChevronDown size={14} className={clsx('text-gray-400 transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="px-4 pb-5 pt-1">
          {loading || !data ? (
            <div className="flex items-center justify-center py-8 text-rose-300">
              <Loader2 size={22} className="animate-spin" />
            </div>
          ) : data.watchedCount === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">
              Once you&apos;ve marked some titles as watched, your shareable recap card shows up here. 🍿
            </p>
          ) : (
            <>
              <p className="text-[13px] text-gray-500 text-center mb-4 max-w-xs mx-auto">
                A little card of what your circle watched — perfect for your story. Every share helps someone new find CinePop. 💕
              </p>
              <RecapCard data={data} />
            </>
          )}
        </div>
      )}
    </div>
  )
}
