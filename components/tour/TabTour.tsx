'use client'

import { useState, useEffect, useCallback } from 'react'
import { X } from 'lucide-react'
import { clsx } from 'clsx'

export interface TabTourStep {
  targetId: string
  title: string
  body: string
}

interface Rect {
  top: number
  left: number
  width: number
  height: number
}

const PADDING = 8 // breathing room around the spotlighted element
const RADIUS = 14

function measure(targetId: string): Rect | null {
  const el = document.getElementById(targetId)
  if (!el) return null
  const r = el.getBoundingClientRect()
  return {
    top: r.top - PADDING,
    left: r.left - PADDING,
    width: r.width + PADDING * 2,
    height: r.height + PADDING * 2,
  }
}

export default function TabTour({
  open,
  steps,
  onClose,
}: {
  open: boolean
  steps: TabTourStep[]
  onClose: () => void
}) {
  const [stepIndex, setStepIndex] = useState(0)
  const [rect, setRect] = useState<Rect | null>(null)
  // Drives the fade: false during the brief gap while we re-measure/move.
  const [visible, setVisible] = useState(false)

  const step = steps[stepIndex]
  const isLast = stepIndex === steps.length - 1

  const recalc = useCallback(() => {
    if (!step) return
    const r = measure(step.targetId)
    setRect(r)
  }, [step])

  // Reset to step 0 whenever the tour is (re)opened.
  useEffect(() => {
    if (open) setStepIndex(0)
  }, [open])

  // Fade out briefly, re-measure, fade back in — on step change and on open.
  useEffect(() => {
    if (!open) return
    setVisible(false)
    const t = setTimeout(() => {
      recalc()
      setVisible(true)
    }, 180)
    return () => clearTimeout(t)
  }, [open, stepIndex, recalc])

  // Keep the spotlight glued to its target on resize/scroll.
  useEffect(() => {
    if (!open) return
    function handle() { recalc() }
    window.addEventListener('resize', handle)
    window.addEventListener('scroll', handle, true)
    return () => {
      window.removeEventListener('resize', handle)
      window.removeEventListener('scroll', handle, true)
    }
  }, [open, recalc])

  if (!open || !step) return null

  function next() {
    if (isLast) {
      onClose()
    } else {
      setStepIndex(i => i + 1)
    }
  }

  // Target not found in the DOM (e.g. no active circle yet) — skip it.
  if (!rect && visible) {
    if (isLast) {
      onClose()
    } else {
      setStepIndex(i => i + 1)
    }
    return null
  }

  // Tooltip placement: prefer below the target, flip above if too close to
  // the bottom of the viewport.
  const viewportH = typeof window !== 'undefined' ? window.innerHeight : 800
  const viewportW = typeof window !== 'undefined' ? window.innerWidth : 1200
  const tooltipWidth = 280
  const spaceBelow = rect ? viewportH - (rect.top + rect.height) : 0
  const placeAbove = spaceBelow < 160
  const tooltipTop = rect
    ? placeAbove ? Math.max(12, rect.top - 12) : rect.top + rect.height + 12
    : 0
  let tooltipLeft = rect ? rect.left + rect.width / 2 - tooltipWidth / 2 : 0
  tooltipLeft = Math.max(12, Math.min(tooltipLeft, viewportW - tooltipWidth - 12))

  return (
    <div className="fixed inset-0 z-[280] pointer-events-none">
      {/* Dimmed backdrop with a spotlight cutout via SVG mask */}
      <svg className="absolute inset-0 w-full h-full pointer-events-auto" onClick={onClose}>
        <defs>
          <mask id="tour-spotlight-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {rect && (
              <rect
                x={rect.left} y={rect.top} width={rect.width} height={rect.height}
                rx={RADIUS} ry={RADIUS} fill="black"
                style={{ transition: 'all 200ms ease' }}
              />
            )}
          </mask>
        </defs>
        <rect
          x="0" y="0" width="100%" height="100%"
          fill="rgba(20, 12, 20, 0.55)"
          mask="url(#tour-spotlight-mask)"
          style={{ opacity: visible ? 1 : 0, transition: 'opacity 200ms ease' }}
        />
      </svg>

      {/* Highlight ring around the spotlighted element */}
      {rect && (
        <div
          className="absolute rounded-2xl ring-2 ring-rose-300 pointer-events-none"
          style={{
            top: rect.top, left: rect.left, width: rect.width, height: rect.height,
            borderRadius: RADIUS,
            opacity: visible ? 1 : 0,
            transition: 'opacity 200ms ease, top 200ms ease, left 200ms ease, width 200ms ease, height 200ms ease',
          }}
        />
      )}

      {/* Tooltip */}
      <div
        className="absolute pointer-events-auto bg-white rounded-2xl shadow-2xl shadow-black/20 p-4"
        style={{
          top: tooltipTop, left: tooltipLeft, width: tooltipWidth,
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : `translateY(${placeAbove ? '6px' : '-6px'})`,
          transition: 'opacity 200ms ease, transform 200ms ease, top 200ms ease, left 200ms ease',
        }}
      >
        <div className="flex items-start justify-between gap-2 mb-1">
          <span className="text-[10px] font-bold uppercase tracking-wide text-rose-400">
            Step {stepIndex + 1} of {steps.length}
          </span>
          <button onClick={onClose} className="text-gray-300 hover:text-gray-500 flex-shrink-0" aria-label="Close tour">
            <X size={14} />
          </button>
        </div>
        <div className="font-display text-base font-bold text-gray-800 mb-1">{step.title}</div>
        <p className="text-[13px] text-gray-500 leading-relaxed mb-3">{step.body}</p>
        <div className="flex items-center justify-between">
          <button onClick={onClose} className="text-[11px] text-gray-400 hover:text-rose-500 transition-colors">
            Skip tour
          </button>
          <button
            onClick={next}
            className="bg-rose-500 hover:bg-rose-600 text-white text-[13px] font-medium px-4 py-1.5 rounded-full transition-all"
          >
            {isLast ? 'Got it! 🎬' : 'Next'}
          </button>
        </div>
        <div className="flex items-center justify-center gap-1 mt-3">
          {steps.map((_, i) => (
            <span
              key={i}
              className={clsx(
                'h-1 rounded-full transition-all',
                i === stepIndex ? 'w-4 bg-rose-400' : 'w-1 bg-rose-200',
              )}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
