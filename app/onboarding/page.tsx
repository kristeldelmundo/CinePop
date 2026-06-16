'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import RequireAuth from '@/components/auth/RequireAuth'
import { useOnboarding } from '@/components/auth/OnboardingProvider'

// Onboarding now lives in a modal (components/onboarding/OnboardingModal.tsx),
// triggered by RequireAuth on first login or via "View onboarding" on /profile.
// This route exists only for old links/bookmarks pointing at /onboarding —
// it opens the modal directly (rather than relying on a redirect target to
// trigger it incidentally) and then sends the URL to /watchlist.
function OnboardingRedirectInner() {
  const router = useRouter()
  const { openOnboarding } = useOnboarding()

  useEffect(() => {
    openOnboarding()
    router.replace('/watchlist')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}

export default function OnboardingRedirectPage() {
  return (
    <RequireAuth>
      <OnboardingRedirectInner />
    </RequireAuth>
  )
}
