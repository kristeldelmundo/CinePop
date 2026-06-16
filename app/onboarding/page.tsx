'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Onboarding is now a modal (see components/onboarding/OnboardingModal.tsx),
// triggered automatically by RequireAuth or via the "View onboarding" button
// on /profile. This route is kept only to redirect anyone with an old link
// or bookmark to /watchlist, where the modal will open as needed.
export default function OnboardingRedirectPage() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/watchlist')
  }, [router])
  return null
}
