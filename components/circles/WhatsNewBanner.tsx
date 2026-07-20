'use client'

import { useEffect, useState } from 'react'
import { useCircle } from '@/components/auth/CircleProvider'
import { getWhatsNew, markCircleSeen, type WhatsNew } from '@/lib/circles'
import { Sparkles, X } from 'lucide-react'

// A friendly "what's new since you were away" banner — the return hook.
// Shows on the main page when others have added titles/reviews to the active
// circle since the user last caught up. Dismissing marks the circle seen.
export default function WhatsNewBanner() {
  const { activeCircle } = useCircle()
  const [info, setInfo] = useState<WhatsNew | null>(null)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    let cancelled = false
    setDismissed(false)
    setInfo(null)
    if (!activeCircle) return
    getWhatsNew(activeCircle.id).then((res) => {
      if (!cancelled) setInfo(res)
    })
    return () => {
      cancelled = true
    }
  }, [activeCircle])

  if (!activeCircle || dismissed || !info) return null
  const total = info.newTitles + info.newReviews
  if (total === 0) return null

  const parts: string[] = []
  if (info.newTitles > 0) parts.push(`${info.newTitles} new ${info.newTitles === 1 ? 'pick' : 'picks'}`)
  if (info.newReviews > 0) parts.push(`${info.newReviews} new ${info.newReviews === 1 ? 'review' : 'reviews'}`)
  const summary = parts.join(' and ')

  async function catchUp() {
    if (!activeCircle) return
    setDismissed(true)
    await markCircleSeen(activeCircle.id)
  }

  return (
    <div className="relative rounded-2xl p-4 mb-4 bg-gradient-to-br from-rose-100 via-rose-50 to-purple-100 border border-rose-200 shadow-md shadow-rose-100">
      <button
        onClick={catchUp}
        className="absolute top-2.5 right-2.5 text-rose-300 hover:text-rose-500 transition-colors"
        aria-label="Dismiss"
        title="Mark as seen"
      >
        <X size={16} />
      </button>
      <div className="flex items-center gap-3 pr-6">
        <div className="w-10 h-10 rounded-full bg-white/70 flex items-center justify-center flex-shrink-0">
          <Sparkles size={18} className="text-rose-400" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-800">
            {summary} in <span className="text-rose-500">{activeCircle.emoji} {activeCircle.name}</span> while you were away!
          </p>
          <button
            onClick={catchUp}
            className="text-xs text-rose-500 hover:text-rose-600 font-medium mt-0.5"
          >
            Catch up →
          </button>
        </div>
      </div>
    </div>
  )
}
