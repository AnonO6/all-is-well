'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Download, X } from 'lucide-react'

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  if (!deferredPrompt || dismissed) return null

  const handleInstall = async () => {
    await deferredPrompt.prompt()
    setDeferredPrompt(null)
  }

  return (
    <div className="fixed left-4 right-4 top-4 z-50 mx-auto flex max-w-lg items-center justify-between gap-3 rounded-2xl border border-brand-purple/20 bg-white p-4 shadow-lg">
      <div>
        <p className="text-sm font-semibold">Install All Is Well</p>
        <p className="text-xs text-brand-text/60">Quick access from your home screen</p>
      </div>
      <div className="flex gap-2">
        <Button size="sm" onClick={handleInstall} className="gap-1">
          <Download className="h-3 w-3" />
          Install
        </Button>
        <Button size="icon" variant="ghost" onClick={() => setDismissed(true)}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
