'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Film, Shuffle, Star, Heart, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react'
import { useAuth } from '@/components/auth/AuthProvider'
import { clsx } from 'clsx'

const PHOTO_URL = 'https://lscjqfqpnquielxncybb.supabase.co/storage/v1/object/public/avatars/site/kristel.jpg'
const THEO_URL = 'https://lscjqfqpnquielxncybb.supabase.co/storage/v1/object/public/avatars/site/theo.jpg'

const SLIDES = [
  { id: 'hero' },
  { id: 'how' },
  { id: 'made' },
]

export default function HomePage() {
  const { user, profile } = useAuth()
  const [cur, setCur] = useState(0)
  const [dir, setDir] = useState(0)
  const [animating, setAnimating] = useState(false)

  const name = profile?.display_name || user?.email?.split('@')[0] || null
  const initial = (name || 'U').charAt(0).toUpperCase()
  const accent = profile?.accent_color === 'purple' ? 'purple' : 'rose'

  function go(d: number) {
    if (animating) return
    setDir(d)
    setAnimating(true)
    setTimeout(() => {
      setCur((c) => (c + d + SLIDES.length) % SLIDES.length)
      setAnimating(false)
    }, 380)
  }

  // Keyboard navigation
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  // Touch swipe
  useEffect(() => {
    let startX = 0
    function onStart(e: TouchEvent) { startX = e.touches[0].clientX }
    function onEnd(e: TouchEvent) {
      const dx = e.changedTouches[0].clientX - startX
      if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1)
    }
    window.addEventListener('touchstart', onStart)
    window.addEventListener('touchend', onEnd)
    return () => { window.removeEventListener('touchstart', onStart); window.removeEventListener('touchend', onEnd) }
  })

  const slideClass = clsx(
    'absolute inset-0 transition-all duration-[380ms] ease-in-out',
    animating && dir > 0 ? '-translate-x-8 opacity-0' :
    animating && dir < 0 ? 'translate-x-8 opacity-0' :
    'translate-x-0 opacity-100'
  )

  // Slide backgrounds
  const BG = [
    'bg-[radial-gradient(ellipse_at_top_left,_#ff6b9d_0%,_#c44dff_40%,_#4d79ff_80%,_#00d4ff_100%)]',
    'bg-[radial-gradient(ellipse_at_bottom_right,_#ff4d6d_0%,_#ff6b35_30%,_#ffd93d_60%,_#ff6b9d_100%)]',
    'bg-[radial-gradient(ellipse_at_center,_#a855f7_0%,_#ec4899_40%,_#f43f5e_80%,_#ff6b35_100%)]',
  ]

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden">
      <style>{`
        @keyframes pop-in{0%{opacity:0;transform:scale(0.9) translateY(16px)}100%{opacity:1;transform:scale(1) translateY(0)}}
        @keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes shimmer{0%{background-position:200% center}100%{background-position:-200% center}}
        .pop{animation:pop-in 0.5s cubic-bezier(0.34,1.4,0.64,1) both}
        .d1{animation-delay:0.05s}.d2{animation-delay:0.12s}.d3{animation-delay:0.2s}.d4{animation-delay:0.28s}.d5{animation-delay:0.36s}
        .bob{animation:bob 3s ease-in-out infinite}
        .glass-card{background:rgba(255,255,255,0.15);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,0.3);border-radius:20px;}
        .glass-btn{background:rgba(255,255,255,0.2);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.4);border-radius:999px;color:white;font-weight:600;transition:all 0.2s;}
        .glass-btn:hover{background:rgba(255,255,255,0.3);transform:scale(1.04);}
        .solid-btn{background:white;border-radius:999px;font-weight:700;color:#e11d48;transition:all 0.2s;}
        .solid-btn:hover{transform:scale(1.04);box-shadow:0 8px 32px rgba(0,0,0,0.18);}
        .dot{width:8px;height:8px;border-radius:50%;background:rgba(255,255,255,0.35);transition:all 0.3s;cursor:pointer;}
        .dot.active{width:22px;border-radius:4px;background:white;}
      `}</style>

      {/* ── FIXED NAVBAR ────────────────────────────────────────────── */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-4 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-2xl bob inline-block">🍿</span>
          <span className="font-display text-xl font-bold text-white italic drop-shadow">CinePop</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/about" className="text-sm text-white/70 hover:text-white transition-colors hidden sm:block">About</Link>
          {user ? (
            <Link href="/watchlist" className="flex items-center gap-2 glass-btn px-4 py-1.5 text-sm">
              {profile?.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.avatar_url} alt={name || 'You'} className="w-6 h-6 rounded-full object-cover ring-1 ring-white/50" />
              ) : (
                <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold text-white">{initial}</span>
              )}
              <span>{name}</span>
            </Link>
          ) : (
            <Link href="/login" className="solid-btn px-5 py-1.5 text-sm">Log in</Link>
          )}
        </div>
      </nav>

      {/* ── SLIDE AREA ──────────────────────────────────────────────── */}
      <div className={clsx('flex-1 relative transition-all duration-500', BG[cur])}>

        {/* Slide content */}
        <div className="absolute inset-0 overflow-hidden">
          {cur === 0 && (
            <div key="hero" className={clsx(slideClass, 'flex flex-col items-center justify-center text-center px-6')}>
              <div className="pop d1 inline-flex items-center gap-2 glass-card px-4 py-1.5 text-sm text-white/90 font-medium mb-6">
                <Heart size={13} fill="white" className="text-white" /> your shared movie night app
              </div>
              <h1 className="pop d2 font-display font-black text-white drop-shadow-2xl mb-3" style={{fontSize:'clamp(52px,10vw,96px)',lineHeight:1.05}}>
                CinePop
              </h1>
              <p className="pop d3 text-white/80 font-semibold text-lg italic mb-3">
                Stop debating. Start watching. 🍿
              </p>
              <p className="pop d4 text-white/70 text-base max-w-md leading-relaxed mb-10">
                Build a shared watchlist with your circle, let fate pick tonight&apos;s movie, then rate it together.
              </p>
              <div className="pop d5 flex flex-col sm:flex-row gap-3">
                <Link href="/watchlist" className="solid-btn flex items-center gap-2 px-8 py-3.5 text-base">
                  <Film size={18} /> Browse Library
                </Link>
                <Link href="/randomizer" className="glass-btn flex items-center gap-2 px-8 py-3.5 text-base">
                  <Shuffle size={18} /> Pick Tonight&apos;s Watch
                </Link>
              </div>
              {!user && (
                <p className="pop mt-6 text-white/50 text-xs">Free forever · No ads · Made with 💕</p>
              )}
            </div>
          )}

          {cur === 1 && (
            <div key="how" className={clsx(slideClass, 'flex flex-col items-center justify-center text-center px-6')}>
              <div className="pop d1 text-white/60 text-xs font-bold uppercase tracking-widest mb-2">How it works</div>
              <h2 className="pop d2 font-display text-4xl font-black text-white drop-shadow mb-10">Movie nights, upgraded ✨</h2>
              <div className="pop d3 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl w-full">
                {[
                  { emoji: '🍿', step: '01', title: 'Create a circle', desc: 'Invite your partner, family, or friends. Everyone adds movies and shows they want to watch.' },
                  { emoji: '🎲', step: '02', title: 'Let fate decide', desc: 'Hit "Pick for us!" and CinePop randomly picks from your unwatched list — no more endless debating.' },
                  { emoji: '⭐', step: '03', title: 'Rate & remember', desc: 'After watching, rate it and react with emoji. Your reviews live on your profile forever.' },
                ].map((f) => (
                  <div key={f.step} className="glass-card p-6 text-left">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-white/40 text-xs font-bold">{f.step}</span>
                      <span className="text-2xl">{f.emoji}</span>
                    </div>
                    <h3 className="text-white font-bold text-base mb-2">{f.title}</h3>
                    <p className="text-white/65 text-sm leading-relaxed">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {cur === 2 && (
            <div key="made" className={clsx(slideClass, 'flex flex-col items-center justify-center text-center px-6')}>
              <div className="pop d1 flex items-end justify-center gap-4 mb-6">
                <div className="flex flex-col items-center gap-1.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={PHOTO_URL} alt="Kristel" className="w-20 h-20 rounded-full object-cover ring-3 ring-white/50 shadow-xl" style={{border:'3px solid rgba(255,255,255,0.5)'}} />
                  <span className="text-white/70 text-xs font-medium">Kristel 👩‍💻</span>
                </div>
                <div className="flex flex-col items-center gap-1.5 mb-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={THEO_URL} alt="Theo" className="w-14 h-14 rounded-full object-cover shadow-xl" style={{border:'3px solid rgba(255,255,255,0.5)'}} />
                  <span className="text-white/70 text-xs font-medium">Theo 🐾</span>
                </div>
              </div>
              <h2 className="pop d2 font-display text-3xl font-black text-white drop-shadow mb-3">
                Made with love, not VC money 💕
              </h2>
              <p className="pop d3 text-white/70 text-sm max-w-md leading-relaxed mb-8">
                CinePop was built by Kristel — a developer who made this for her boyfriend and herself so they&apos;d never argue about what to watch again. It&apos;s free, ad-free, and made one cozy feature at a time. Theo (the kitten) supervised everything. 🐈‍⬛
              </p>
              <div className="pop d4 flex flex-col sm:flex-row gap-3 items-center justify-center">
                {!user && (
                  <Link href="/login" className="solid-btn flex items-center gap-2 px-8 py-3.5 text-base">
                    <Sparkles size={18} /> Get started — it&apos;s free
                  </Link>
                )}
                <Link href="/about" className="glass-btn flex items-center gap-2 px-8 py-3.5 text-base">
                  Read our story →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Prev / Next arrows */}
        <button
          onClick={() => go(-1)}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center text-white transition-all hover:scale-110"
          style={{background:'rgba(255,255,255,0.15)',backdropFilter:'blur(8px)',border:'1px solid rgba(255,255,255,0.3)'}}
          aria-label="Previous slide"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => go(1)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center text-white transition-all hover:scale-110"
          style={{background:'rgba(255,255,255,0.15)',backdropFilter:'blur(8px)',border:'1px solid rgba(255,255,255,0.3)'}}
          aria-label="Next slide"
        >
          <ChevronRight size={20} />
        </button>

        {/* Dot indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => { setDir(i > cur ? 1 : -1); setCur(i) }}
              className={clsx('dot', i === cur && 'active')}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Footer credit */}
        <div className="absolute bottom-6 right-6 text-white/30 text-xs flex items-center gap-1">
          made with <Heart size={9} fill="currentColor" /> by Kristel & Theo
        </div>
      </div>
    </div>
  )
}
