'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Film, Shuffle, Star, Heart, Sparkles, ChevronLeft, ChevronRight, Users, Coffee } from 'lucide-react'
import { useAuth } from '@/components/auth/AuthProvider'
import { clsx } from 'clsx'

const PHOTO_URL = 'https://lscjqfqpnquielxncybb.supabase.co/storage/v1/object/public/avatars/site/kristel.jpg'
const THEO_URL = 'https://lscjqfqpnquielxncybb.supabase.co/storage/v1/object/public/avatars/site/theo.jpg'
const KOFI_URL = 'https://ko-fi.com/kristeldelmundo'

const TOTAL = 3

export default function HomePage() {
  const { user, profile } = useAuth()
  const [cur, setCur] = useState(0)
  const [animating, setAnimating] = useState(false)

  const name = profile?.display_name || user?.email?.split('@')[0] || null
  const initial = (name || 'U').charAt(0).toUpperCase()
  const accent = profile?.accent_color === 'purple' ? 'purple' : 'rose'

  function go(d: number) {
    if (animating) return
    setAnimating(true)
    setTimeout(() => {
      setCur((c) => (c + d + TOTAL) % TOTAL)
      setAnimating(false)
    }, 300)
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  useEffect(() => {
    let startX = 0
    function onStart(e: TouchEvent) { startX = e.touches[0].clientX }
    function onEnd(e: TouchEvent) {
      const dx = e.changedTouches[0].clientX - startX
      if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1)
    }
    window.addEventListener('touchstart', onStart)
    window.addEventListener('touchend', onEnd)
    return () => {
      window.removeEventListener('touchstart', onStart)
      window.removeEventListener('touchend', onEnd)
    }
  })

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden bg-gradient-to-br from-rose-50 via-purple-50 to-sky-50">
      <style>{`
        @keyframes pop-in{0%{opacity:0;transform:translateY(14px) scale(0.97)}100%{opacity:1;transform:translateY(0) scale(1)}}
        @keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
        .pop{animation:pop-in 0.45s cubic-bezier(0.34,1.3,0.64,1) both}
        .d1{animation-delay:0.04s}.d2{animation-delay:0.1s}.d3{animation-delay:0.17s}.d4{animation-delay:0.24s}.d5{animation-delay:0.31s}
        .bob{animation:bob 3s ease-in-out infinite}
        .slide-out{opacity:0;transform:translateY(8px);transition:all 0.25s ease}
        .slide-in{opacity:1;transform:translateY(0);transition:all 0.3s ease}
        .dot{width:7px;height:7px;border-radius:50%;background:rgba(244,63,94,0.2);transition:all 0.3s;cursor:pointer;}
        .dot.active{width:20px;border-radius:4px;background:#f43f5e;}
        .glass{background:rgba(255,255,255,0.72);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border:1px solid rgba(255,255,255,0.85);}
      `}</style>

      {/* ── NAVBAR ──────────────────────────────────────────────────── */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto w-full flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-2xl bob inline-block">🍿</span>
          <span className="font-display text-xl font-medium text-rose-600 italic">CinePop</span>
        </div>
        <div className="flex items-center gap-2">
          {user ? (
            <Link
              href="/profile"
              className="flex items-center gap-2 bg-white/80 border border-rose-100 rounded-full px-4 py-1.5 text-sm text-gray-500 hover:border-rose-300 transition-colors"
            >
              {profile?.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.avatar_url} alt={name || 'You'} className="w-6 h-6 rounded-full object-cover" />
              ) : (
                <span className={clsx('w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium', accent === 'purple' ? 'bg-purple-100 text-purple-600' : 'bg-rose-100 text-rose-600')}>
                  {initial}
                </span>
              )}
              <span className="ml-1">{name}</span>
            </Link>
          ) : (
            <Link href="/login" className="flex items-center gap-1 bg-rose-500 hover:bg-rose-600 text-white rounded-full px-5 py-1.5 text-sm font-medium transition-colors">
              Log in
            </Link>
          )}
        </div>
      </nav>

      {/* ── SLIDE AREA ──────────────────────────────────────────────── */}
      <div className="flex-1 relative overflow-hidden">
        <div className={clsx('absolute inset-0 flex flex-col items-center justify-center text-center px-8', animating ? 'slide-out' : 'slide-in')}>

          {/* ── SLIDE 1: HERO ── */}
          {cur === 0 && (
            <>
              <div className="pop d1 inline-flex items-center gap-2 bg-white/60 border border-rose-200 rounded-full px-4 py-1.5 text-sm text-rose-500 mb-6 font-medium">
                <Heart size={13} fill="currentColor" /> your shared movie night app
              </div>
              <h1 className="pop d2 font-display font-bold text-gray-800 leading-tight mb-4" style={{ fontSize: 'clamp(52px,9vw,86px)' }}>
                <span className="gradient-text italic">CinePop</span>{' '}
                <span className="not-italic" style={{ WebkitTextFillColor: 'initial' }}>🍿</span>
              </h1>
              <p className="pop d3 text-lg text-rose-400 font-medium italic mb-3">Pop something on tonight 🍿</p>
              <p className="pop d4 text-xl text-gray-500 max-w-lg leading-relaxed mb-10">
                Add movies and shows, let fate decide what you watch, then rate and share the experience together.
              </p>
              <div className="pop d5 flex flex-col sm:flex-row gap-3">
                <Link href="/watchlist" className="flex items-center justify-center gap-2 bg-rose-500 hover:bg-rose-600 text-white font-medium px-8 py-3.5 rounded-full transition-all hover:scale-105 shadow-lg shadow-rose-200 text-base">
                  <Film size={18} /> Browse Library
                </Link>
                <Link href="/randomizer" className="flex items-center justify-center gap-2 bg-white hover:bg-rose-50 text-rose-500 font-medium px-8 py-3.5 rounded-full border border-rose-200 transition-all hover:scale-105 shadow-sm text-base">
                  <Shuffle size={18} /> Pick Tonight&apos;s Watch
                </Link>
              </div>
              {!user && (
                <p className="pop mt-5 text-sm text-gray-400">Free forever · No ads · Made with 💕</p>
              )}
            </>
          )}

          {/* ── SLIDE 2: HOW IT WORKS ── */}
          {cur === 1 && (
            <>
              <div className="pop d1 text-rose-400 text-xs font-bold uppercase tracking-widest mb-2">How it works</div>
              <h2 className="pop d2 font-display text-4xl font-bold text-gray-800 mb-2">Movie nights, upgraded ✨</h2>
              <p className="pop d3 text-base text-gray-400 max-w-sm mb-8">Everything you need for a perfect watch night, built in.</p>
              <div className="pop d4 grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-2xl w-full">
                {[
                  { emoji: '🍿', step: '01', title: 'Create a circle', desc: 'Invite your partner, family, or friends. Everyone adds to one shared watchlist — no more "send me your list."' },
                  { emoji: '🎲', step: '02', title: 'Let fate decide', desc: 'Can\'t agree? Hit "Pick for us!" and CinePop randomly picks from your unwatched list, with a trailer to preview.' },
                  { emoji: '⭐', step: '03', title: 'Rate & remember', desc: 'After watching, rate it and react with emoji. Reviews live on your profile so you never forget what you loved.' },
                ].map((f) => (
                  <div key={f.step} className="glass rounded-2xl p-6 text-center hover:-translate-y-1 transition-transform flex flex-col items-center">
                    <span className="text-[11px] font-bold text-gray-300 mb-1">{f.step}</span>
                    <span className="text-3xl mb-3">{f.emoji}</span>
                    <h3 className="font-bold text-gray-800 text-base mb-2">{f.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ── SLIDE 3: MADE BY ── */}
          {cur === 2 && (
            <>
              <div className="pop d1 flex items-end justify-center gap-5 mb-6">
                <div className="flex flex-col items-center gap-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={PHOTO_URL} alt="Kristel" className="w-24 h-24 rounded-full object-cover shadow-lg ring-2 ring-white" />
                  <span className="text-sm text-gray-400 font-medium">Kristel 👩‍💻</span>
                </div>
                <div className="flex flex-col items-center gap-2 mb-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={THEO_URL} alt="Theo" className="w-16 h-16 rounded-full object-cover shadow-lg ring-2 ring-rose-100" />
                  <span className="text-sm text-gray-400 font-medium">Theo 🐾</span>
                </div>
              </div>
              <h2 className="pop d2 font-display text-3xl font-bold text-gray-800 mb-3">Made with love, not VC money 💕</h2>
              <p className="pop d3 text-base text-gray-500 max-w-lg leading-relaxed mb-2">
                CinePop was built by Kristel — a developer who made this for her boyfriend and herself so they&apos;d never argue about what to watch again. It&apos;s free, ad-free, and built one cozy feature at a time.
              </p>
              <p className="pop d3 text-base text-gray-400 max-w-sm leading-relaxed mb-8">
                Oh, and Theo (the kitten) supervised the whole thing. 🐈‍⬛
              </p>
              <div className="pop d4 flex flex-col sm:flex-row gap-3 items-center justify-center">
                {!user ? (
                  <Link href="/login" className="flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white font-medium px-8 py-3.5 rounded-full transition-all hover:scale-105 shadow-lg shadow-rose-200 text-base">
                    <Sparkles size={18} /> Get started — it&apos;s free
                  </Link>
                ) : (
                  <Link href="/watchlist" className="flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white font-medium px-8 py-3.5 rounded-full transition-all hover:scale-105 shadow-lg shadow-rose-200 text-base">
                    <Film size={18} /> Go to my library
                  </Link>
                )}
                <a href={KOFI_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-white hover:bg-rose-50 text-rose-500 font-medium px-8 py-3.5 rounded-full border border-rose-200 transition-all hover:scale-105 shadow-sm text-base">
                  <Coffee size={18} /> Buy us a coffee
                </a>
              </div>
              <p className="pop d5 mt-5 text-sm text-gray-400 flex items-center gap-1">
                Made with <Heart size={10} className="text-rose-400" fill="currentColor" /> · CinePop {new Date().getFullYear()}
              </p>
            </>
          )}
        </div>

        {/* Arrows */}
        <button
          onClick={() => go(-1)}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-rose-400 hover:text-rose-600 transition-all hover:scale-110 bg-white/70 border border-rose-100 shadow-sm"
          aria-label="Previous"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => go(1)}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-rose-400 hover:text-rose-600 transition-all hover:scale-110 bg-white/70 border border-rose-100 shadow-sm"
          aria-label="Next"
        >
          <ChevronRight size={20} />
        </button>

        {/* Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {Array.from({ length: TOTAL }).map((_, i) => (
            <button
              key={i}
              onClick={() => { if (!animating) { setAnimating(true); setTimeout(() => { setCur(i); setAnimating(false) }, 300) } }}
              className={clsx('dot', i === cur && 'active')}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
