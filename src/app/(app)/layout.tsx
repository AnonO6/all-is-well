import { BottomNav } from '@/components/layout/bottom-nav'
import { InstallPrompt } from '@/components/pwa/install-prompt'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background pb-28">
      <InstallPrompt />
      <main className="mx-auto max-w-lg px-4 py-6">{children}</main>
      <BottomNav />
    </div>
  )
}
