'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Download, Share, X } from 'lucide-react'

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const DISMISS_KEY = 'all-is-well-install-dismissed'

function isIosDevice() {
  if (typeof navigator === 'undefined') return false
  return /iphone|ipad|ipod/i.test(navigator.userAgent)
}

function isStandalone() {
  if (typeof window === 'undefined') return false
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    ('standalone' in navigator && (navigator as Navigator & { standalone?: boolean }).standalone)
  )
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null)
  const [showIosGuide, setShowIosGuide] = useState(false)
  const [dismissed, setDismissed] = useState(true)

  useEffect(() => {
    if (isStandalone()) return

    const wasDismissed = localStorage.getItem(DISMISS_KEY) === '1'
    if (wasDismissed) return

    setDismissed(false)

    if (isIosDevice()) {
      setShowIosGuide(true)
      return
    }

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setShowIosGuide(false)
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const dismiss = () => {
    setDismissed(true)
    setShowIosGuide(false)
    setDeferredPrompt(null)
    localStorage.setItem(DISMISS_KEY, '1')
  }

  if (dismissed || isStandalone()) return null
  if (!deferredPrompt && !showIosGuide) return null

  const handleInstall = async () => {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    setDeferredPrompt(null)
    dismiss()
  }

  return (
    <div className="fixed left-4 right-4 top-4 z-50 mx-auto flex max-w-lg items-center justify-between gap-3 rounded-2xl border border-brand-purple/20 bg-white p-4 shadow-lg">
      <div>
        <p className="text-sm font-semibold">Install All Is Well</p>
        {showIosGuide ? (
          <p className="text-xs leading-relaxed text-brand-text/60">
            iPhone pe: Safari mein kholo, phir{' '}
            <Share className="inline h-3 w-3" /> Share →{' '}
            <strong>Add to Home Screen</strong>. All is well, buddy.
          </p>
        ) : (
          <p className="text-xs text-brand-text/60">
            Quick access from your home screen
          </p>
        )}
      </div>
      <div className="flex shrink-0 gap-2">
        {!showIosGuide && (
          <Button size="sm" onClick={handleInstall} className="gap-1">
            <Download className="h-3 w-3" />
            Install
          </Button>
        )}
        <Button size="icon" variant="ghost" onClick={dismiss} aria-label="Dismiss">
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
