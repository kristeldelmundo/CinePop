'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/components/auth/AuthProvider'
import { useCircle } from '@/components/auth/CircleProvider'
import { joinCircleByCode } from '@/lib/circles'
import { Loader2, Check, X } from 'lucide-react'

export default function JoinCirclePage() {
  const router = useRouter()
  const params = useParams()
  const code = (params?.code as string) || ''
  const { user, loading: authLoading } = useAuth()
  const { refreshCircles, setActiveCircle } = useCircle()

  const [status, setStatus] = useState<'working' | 'ok' | 'error'>('working')
  const [message, setMessage] = useState('Joining the circle...')

  useEffect(() => {
    if (authLoading) return

    // Not logged in? Send to login, remembering the invite code so we can come back
    if (!user) {
      try {
        window.localStorage.setItem('cinepop_pending_invite', code)
      } catch {}
      router.replace('/login')
      return
    }

    async function doJoin() {
      const result = await joinCircleByCode(code, user!.id)
      if (result.circleId) {
        const updated = await refreshCircles()
        const joined = updated.find((c) => c.id === result.circleId)
        if (joined) setActiveCircle(joined)
        setStatus('ok')
        setMessage(result.error || "You're in! 🍿")
        setTimeout(() => router.replace('/watchlist'), 1500)
      } else {
        setStatus('error')
        setMessage(result.error || 'Could not join this circle.')
      }
    }
    doJoin()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user, code])

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 bg-gradient-to-br from-rose-50 via-purple-50 to-sky-50 text-center">
      <div className="text-5xl">🍿</div>
      {status === 'working' && (
        <>
          <Loader2 size={28} className="animate-spin text-rose-400" />
          <p className="text-sm text-gray-500">{message}</p>
        </>
      )}
      {status === 'ok' && (
        <>
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
            <Check size={24} className="text-green-600" />
          </div>
          <p className="font-display text-xl font-bold text-gray-800">{message}</p>
          <p className="text-sm text-gray-400">Taking you to the watchlist...</p>
        </>
      )}
      {status === 'error' && (
        <>
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <X size={24} className="text-red-500" />
          </div>
          <p className="font-display text-xl font-bold text-gray-800">Hmm.</p>
          <p className="text-sm text-gray-400">{message}</p>
          <button
            onClick={() => router.replace('/circles')}
            className="mt-2 bg-rose-500 hover:bg-rose-600 text-white font-medium px-5 py-2.5 rounded-full text-sm transition-all"
          >
            Go to Circles
          </button>
        </>
      )}
    </main>
  )
}
