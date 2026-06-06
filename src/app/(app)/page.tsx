import Link from 'next/link'
import Image from 'next/image'
import { auth } from '@/lib/auth'
import { MoodService } from '@/services/mood/mood.service'
import { fetchWellnessImage } from '@/lib/unsplash'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MoodSparkline } from '@/components/dashboard/mood-sparkline'
import { getMoodEmoji } from '@/lib/utils'
import {
  Sparkles,
  PenLine,
  Wind,
  MessageCircle,
  Flame,
} from 'lucide-react'

const QUOTES = [
  'One chapter at a time. You are building something strong.',
  'Stress is not a sign of weakness — it means you care deeply.',
  'Rest is part of preparation, not a break from it.',
  'Your worth is not defined by a single exam score.',
  'Small consistent steps beat last-minute panic every time.',
]

export default async function DashboardPage() {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) return null

  const stats = await MoodService.getDashboardStats(userId)
  const heroImage = await fetchWellnessImage(
    stats.averageMood ? Math.round(stats.averageMood) : undefined,
  )
  const quote = QUOTES[new Date().getDate() % QUOTES.length]

  const sparklineData = stats.weeklyEntries.map((entry) => ({
    date: new Date(entry.created_at).toISOString().slice(5, 10),
    moodScore: entry.mood_score,
  }))

  const quickActions = [
    { href: '/check-in', label: 'Check In', icon: Sparkles, color: 'bg-brand-orange' },
    { href: '/journal', label: 'Journal', icon: PenLine, color: 'bg-brand-purple' },
    { href: '/breathe', label: 'Breathe', icon: Wind, color: 'bg-brand-teal' },
    { href: '/guru', label: 'Talk to Guru', icon: MessageCircle, color: 'bg-brand-purple' },
  ]

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-sm text-brand-text/60">Feel Better</p>
          <h1 className="text-2xl font-bold text-brand-text">
            Hi, {session.user.name?.split(' ')[0] ?? 'friend'} 👋
          </h1>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-purple text-sm font-bold text-white">
          {(session.user.name?.[0] ?? 'S').toUpperCase()}
        </div>
      </header>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold leading-snug text-brand-text">
          Let&apos;s start your wellness check-in for a better day.
        </h2>
        {!stats.checkedInToday && (
          <Link href="/check-in">
            <Button className="mt-2 w-full">Log today&apos;s mood</Button>
          </Link>
        )}
      </section>

      {heroImage && (
        <Card className="overflow-hidden p-0">
          <div className="relative h-40 w-full">
            <Image
              src={heroImage.url}
              alt={heroImage.alt}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <p className="absolute bottom-3 left-4 text-sm text-white/80">
              Photo by {heroImage.credit}
            </p>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-full bg-brand-orange/10 p-2">
              <Flame className="h-5 w-5 text-brand-orange" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.streak}</p>
              <p className="text-xs text-brand-text/60">Day streak</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <span className="text-3xl">
              {stats.averageMood ? getMoodEmoji(Math.round(stats.averageMood)) : '🌱'}
            </span>
            <div>
              <p className="text-2xl font-bold">
                {stats.averageMood ? stats.averageMood.toFixed(1) : '—'}
              </p>
              <p className="text-xs text-brand-text/60">Weekly mood</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>This week</CardTitle>
        </CardHeader>
        <CardContent>
          <MoodSparkline data={sparklineData} />
        </CardContent>
      </Card>

      <Card className="border-brand-purple/10 bg-brand-purple/5">
        <CardContent className="p-5">
          <p className="text-sm font-medium text-brand-purple">Quote of the day</p>
          <p className="mt-2 text-brand-text">{quote}</p>
        </CardContent>
      </Card>

      <section>
        <h3 className="mb-3 text-lg font-semibold">Quick actions</h3>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <Link key={action.href} href={action.href}>
                <Card className="transition-transform hover:scale-[1.02]">
                  <CardContent className="flex items-center gap-3 p-4">
                    <div className={`rounded-full p-2 ${action.color}`}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-medium">{action.label}</span>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}
