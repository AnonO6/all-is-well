import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import { AuthSessionProvider } from '@/components/providers/session-provider'
import { InstallPrompt } from '@/components/pwa/install-prompt'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})

export const metadata: Metadata = {
  title: 'All Is Well — Mental Wellness Tracker',
  description:
    'All is well, buddy. Track mood wins, talk to Rancho, and breathe through exam season. Stress signals stay private in the backend.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'All Is Well',
  },
  icons: {
    apple: '/icons/icon-192.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#7C6FCD',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased`}>
        <AuthSessionProvider>
          <InstallPrompt />
          {children}
        </AuthSessionProvider>
      </body>
    </html>
  )
}
