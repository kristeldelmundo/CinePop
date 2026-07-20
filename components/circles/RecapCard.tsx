'use client'

import { useRef, useState } from 'react'
import { Download, Loader2, Share2, Check } from 'lucide-react'

// A shareable "what we watched" recap card. Renders an SVG (so it converts to
// a crisp PNG with zero external libraries — no html-to-image, no lockfile
// risk), sized 1080x1350 for Instagram/TikTok stories.

export interface RecapData {
  circleName: string
  circleEmoji: string
  monthLabel: string // e.g. "June 2026"
  watchedCount: number
  titles: string[] // recent watched titles (we'll show up to ~6)
  topReaction: string | null // label
  memberCount: number
}

const REACTION_EMOJI: Record<string, string> = {
  Obsessed: '😍', 'So good': '🍿', 'We cried': '😭', 'Laughed so hard': '🤣',
  'Plot twist!': '🤯', 'Fell asleep': '😴', Meh: '😐', 'Would rewatch': '🔁',
  'Perfect date night': '💑', "So bad it's good": '💀',
}

const W = 1080
const H = 1350

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

// Build the SVG markup for the card. Kept as a string so we can both preview
// it (via a data URL) and rasterize it to PNG on a canvas.
function buildSvg(data: RecapData): string {
  const titles = data.titles.slice(0, 6)
  const reactionEmoji = data.topReaction ? (REACTION_EMOJI[data.topReaction] || '🍿') : '🍿'

  const titleRows = titles
    .map((t, i) => {
      const y = 620 + i * 92
      const clean = escapeXml(t.length > 34 ? t.slice(0, 33) + '…' : t)
      return `
        <text x="110" y="${y}" font-family="Georgia, serif" font-size="42" fill="#ffffff" opacity="0.95">🎬  ${clean}</text>
      `
    })
    .join('')

  return `
  <svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#f43f72"/>
        <stop offset="55%" stop-color="#c53a6e"/>
        <stop offset="100%" stop-color="#7c3aed"/>
      </linearGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#bg)"/>

    <!-- header -->
    <text x="110" y="150" font-family="Georgia, serif" font-style="italic" font-size="54" fill="#ffffff" opacity="0.9">CinePop</text>
    <text x="${W - 110}" y="150" text-anchor="end" font-family="Georgia, serif" font-size="40" fill="#ffffff" opacity="0.75">${escapeXml(data.monthLabel)}</text>

    <!-- title -->
    <text x="110" y="310" font-family="Georgia, serif" font-weight="bold" font-size="88" fill="#ffffff">${escapeXml(data.circleEmoji)} ${escapeXml(data.circleName)}</text>
    <text x="110" y="390" font-family="Georgia, serif" font-style="italic" font-size="46" fill="#ffffff" opacity="0.85">what we watched</text>

    <!-- big number -->
    <text x="110" y="530" font-family="Georgia, serif" font-weight="bold" font-size="130" fill="#ffffff">${data.watchedCount}</text>
    <text x="${110 + String(data.watchedCount).length * 78 + 30}" y="530" font-family="Georgia, serif" font-size="46" fill="#ffffff" opacity="0.85">${data.watchedCount === 1 ? 'title' : 'titles'} together</text>

    <!-- titles list -->
    ${titleRows}

    <!-- footer band -->
    <rect x="0" y="${H - 190}" width="${W}" height="190" fill="#ffffff" opacity="0.12"/>
    <text x="110" y="${H - 108}" font-family="Georgia, serif" font-size="44" fill="#ffffff">${reactionEmoji}  most-felt: ${escapeXml(data.topReaction || 'movie magic')}</text>
    <text x="110" y="${H - 45}" font-family="Georgia, serif" font-style="italic" font-size="38" fill="#ffffff" opacity="0.9">make yours at cinepop.live 🍿</text>
  </svg>
  `.trim()
}

export default function RecapCard({ data }: { data: RecapData }) {
  const [downloading, setDownloading] = useState(false)
  const [shared, setShared] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const svgMarkup = buildSvg(data)
  const previewUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svgMarkup)}`
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Rasterize the SVG to a PNG blob using a canvas (no external deps).
  async function toPngBlob(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => {
        const canvas = canvasRef.current || document.createElement('canvas')
        canvas.width = W
        canvas.height = H
        const ctx = canvas.getContext('2d')
        if (!ctx) return reject(new Error('no canvas context'))
        ctx.drawImage(img, 0, 0, W, H)
        canvas.toBlob((blob) => {
          if (blob) resolve(blob)
          else reject(new Error('toBlob failed'))
        }, 'image/png')
      }
      img.onerror = () => reject(new Error('svg load failed'))
      img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgMarkup)}`
    })
  }

  async function download() {
    setError(null)
    setDownloading(true)
    try {
      const blob = await toPngBlob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      const safe = data.circleName.replace(/[^a-z0-9-_]+/gi, '-').toLowerCase()
      a.download = `cinepop-${safe}-recap.png`
      a.href = url
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      setError('Could not make the image — try again, or screenshot the card.')
    } finally {
      setDownloading(false)
    }
  }

  // Native share of the PNG where supported (great for phones).
  async function shareImage() {
    setError(null)
    try {
      const blob = await toPngBlob()
      const file = new File([blob], `cinepop-recap.png`, { type: 'image/png' })
      const navAny = navigator as Navigator & { canShare?: (d: { files: File[] }) => boolean }
      if (navAny.canShare && navAny.canShare({ files: [file] }) && navigator.share) {
        await navigator.share({
          files: [file],
          title: 'CinePop',
          text: `${data.circleEmoji} What we watched on CinePop`,
        })
        setShared(true)
        setTimeout(() => setShared(false), 2000)
      } else {
        // No file-share support → just download it.
        await download()
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return
      setError('Sharing didn\u2019t work — try Download instead.')
    }
  }

  return (
    <div className="flex flex-col items-center">
      {/* On-screen preview (scaled down) */}
      <div className="w-full max-w-[280px] rounded-2xl overflow-hidden shadow-xl shadow-rose-200/50 mb-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={previewUrl} alt={`${data.circleName} recap`} className="w-full h-auto block" />
      </div>

      <div className="flex gap-2 w-full max-w-[280px]">
        <button
          onClick={shareImage}
          className="flex-1 flex items-center justify-center gap-2 bg-rose-500 hover:bg-rose-600 text-white font-medium py-2.5 rounded-xl text-sm transition-all"
        >
          {shared ? <Check size={16} /> : <Share2 size={16} />}
          {shared ? 'Shared!' : 'Share'}
        </button>
        <button
          onClick={download}
          disabled={downloading}
          className="flex items-center justify-center gap-2 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 disabled:opacity-60 font-medium px-4 py-2.5 rounded-xl text-sm transition-all"
        >
          {downloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
        </button>
      </div>

      {error && <p className="text-xs text-red-500 mt-3 text-center max-w-[280px]">{error}</p>}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}
