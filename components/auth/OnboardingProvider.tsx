'use client'

import {
  createContext, useContext, useState, ReactNode, useCallback,
} from 'react'
import OnboardingModal from '@/components/onboarding/OnboardingModal'

interface OnboardingContextValue {
  open: boolean
  openOnboarding: () => void
  closeOnboarding: () => void
}

const OnboardingContext = createContext<OnboardingContextValue>({
  open: false,
  openOnboarding: () => {},
  closeOnboarding: () => {},
})

// Provides global open/close state for the onboarding modal, and renders it
// once at the root so it can be triggered from anywhere (RequireAuth on first
// login, or the "View onboarding" button on /profile).
export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)

  const openOnboarding = useCallback(() => setOpen(true), [])
  const closeOnboarding = useCallback(() => setOpen(false), [])

  return (
    <OnboardingContext.Provider value={{ open, openOnboarding, closeOnboarding }}>
      {children}
      <OnboardingModal open={open} onClose={closeOnboarding} />
    </OnboardingContext.Provider>
  )
}

export function useOnboarding() {
  return useContext(OnboardingContext)
}
