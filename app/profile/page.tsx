'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/layout/Navbar'
import RequireAuth from '@/components/auth/RequireAuth'
import { useAuth } from '@/components/auth/AuthProvider'
import { supabase } from '@/lib/supabase'
import { Loader2, Check } from 'lucide-react'
import { clsx } from 'clsx'

function ProfileInner() {
  const { user, profile, refreshProfile } = useAuth()
  const [displayName, setDisplayName] = useState('')
  const [accent, setAccent] = useState('rose')
  const [bio, setBio] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name || '')
      setAccent(profile.accent_color || 'rose')
      setBio(profile.bio || '')
    }
  }, [profile])

  async function save() {
    if (!user) return
    setSaving(true)
    await supabase
      .from('profiles')
      .update({
        display_name: displayName,
        accent_color: accent,
        bio,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)
    await refreshProfile()
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const accents = [
    { value: 'rose', label: 'Rose', cls: 'bg-rose-500' },
    { value: 'purple', label: 'Plum', cls: 'bg-purple-500' },
    { value: 'amber', label: 'Amber', cls: 'bg-amber-500' },
    { value: 'teal', label: 'Teal', cls: 'bg-teal-500' },
  ]

  const initial = (displayName || user?.email || 'Y').charAt(0).toUpperCase()

  return (
    <>
      <Navbar />
      <main className="max-w-md mx-auto px-4 py-8">
        <h1 className="font-display text-3xl font-bold text-gray-800 mb-6">
          My <span className="gradient-text italic">Profile</span>
        </h1>

        <div className="glass rounded-2xl p-6">
          {/* Avatar preview */}
          <div className="flex items-center gap-4 mb-6">
            <span
              className={clsx(
                'w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white',
                accent === 'purple' ? 'bg-purple-500'
                  : accent === 'amber' ? 'bg-amber-500'
                  : accent === 'teal' ? 'bg-teal-500'
                  : 'bg-rose-500',
              )}
            >
              {initial}
            </span>
            <div>
              <p className="font-medium text-gray-800">{displayName || 'Your name'}</p>
              <p className="text-xs text-gray-400">{user?.email}</p>
            </div>
          </div>

          <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Display name</label>
          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full bg-white/80 border border-rose-100 rounded-xl px-3 py-2.5 text-sm mb-4 outline-none focus:border-rose-300"
          />

          <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Accent color</label>
          <div className="flex gap-2 mb-4">
            {accents.map((a) => (
              <button
                key={a.value}
                onClick={() => setAccent(a.value)}
                className={clsx(
                  'w-9 h-9 rounded-full transition-all',
                  a.cls,
                  accent === a.value ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : 'opacity-60',
                )}
                title={a.label}
              />
            ))}
          </div>

          <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            placeholder="A little about your movie taste..."
            className="w-full bg-white/80 border border-rose-100 rounded-xl px-3 py-2.5 text-sm mb-4 outline-none focus:border-rose-300 resize-none"
          />

          <button
            onClick={save}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 bg-rose-500 hover:bg-rose-600 disabled:bg-rose-300 text-white font-medium py-2.5 rounded-xl text-sm transition-all"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : saved ? <><Check size={16} /> Saved!</> : 'Save profile'}
          </button>
        </div>
      </main>
    </>
  )
}

export default function ProfilePage() {
  return (
    <RequireAuth>
      <ProfileInner />
    </RequireAuth>
  )
}
