import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import { AuthSessionProvider } from '@/components/providers/session-provider'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})

export const metadata: Metadata = {
  title: 'All Is Well — Mental Wellness Tracker',
  description:
    'Track your mood, reflect on stress, and find calm during exam season.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'All Is Well',
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
        <AuthSessionProvider>{children}</AuthSessionProvider>
      </body>
    </html>
  )
}
