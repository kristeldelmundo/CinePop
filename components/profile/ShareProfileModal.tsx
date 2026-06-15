'use client'

import { useState } from 'react'
import { Link2, Check, X } from 'lucide-react'

// A small modal to share the public profile link.
// (Downloadable card image is coming back later — it needs a dependency
// added the right way so the production build stays healthy.)
export default function ShareProfileModal({
  open,
  onClose,
  shareUrl,
}: {
  open: boolean
  onClose: () => void
  shareUrl: string
  cardRef?: React.RefObject<HTMLElement>
  fileBaseName?: string
}) {
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!open) return null

  async function copyLink() {
    setError(null)
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      setError('Could not copy — long-press the link to copy it.')
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Sheet */}
      <div className="relative w-full sm:max-w-sm bg-white rounded-t-[28px] sm:rounded-[28px] p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-display text-xl font-bold text-gray-800">Share your profile</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1" aria-label="Close">
            <X size={20} />
          </button>
        </div>
        <p className="text-[13px] text-gray-500 mb-5">Anyone with the link can see your card — no login needed. 🍿</p>

        {/* Link row */}
        <div className="flex items-center gap-2 bg-rose-50 border border-rose-100 rounded-xl px-3 py-2.5 mb-3">
          <Link2 size={16} className="text-rose-400 flex-shrink-0" />
          <span className="text-[13px] text-gray-600 truncate flex-1">{shareUrl.replace(/^https?:\/\//, '')}</span>
        </div>

        <button
          onClick={copyLink}
          className="w-full flex items-center justify-center gap-2 bg-rose-500 hover:bg-rose-600 text-white font-medium py-3 rounded-xl text-sm transition-all"
        >
          {copied ? <Check size={16} /> : <Link2 size={16} />}
          {copied ? 'Link copied!' : 'Copy link'}
        </button>

        {error && <p className="text-xs text-red-500 mt-3 text-center">{error}</p>}
      </div>
    </div>
  )
}
