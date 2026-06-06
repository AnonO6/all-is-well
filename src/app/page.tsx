import Link from 'next/link'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Sparkles,
  MessageCircle,
  Wind,
  PenLine,
  Heart,
  Shield,
} from 'lucide-react'

const FEATURES = [
  {
    icon: MessageCircle,
    title: 'Talk to Rancho',
    desc: 'Hume-powered voice mentor. Funny, chill, actually listens.',
  },
  {
    icon: Sparkles,
    title: 'Daily check-in',
    desc: 'Mood & energy — positive vibes only on screen.',
  },
  {
    icon: PenLine,
    title: 'Chupke se likh',
    desc: 'Journal prompts that feel like a friend, not a lecture.',
  },
  {
    icon: Wind,
    title: 'Saans le',
    desc: 'Breathing exercises when the pressure cooker whistles.',
  },
]

export default async function LandingPage() {
  const session = await auth()
  if (session?.user) redirect('/dashboard')

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen max-w-lg flex-col px-6 py-10">
        <header className="mb-10 text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-brand-purple">
            All Is Well
          </p>
        </header>

        <section className="flex flex-1 flex-col items-center justify-center text-center">
          <div className="mb-8 space-y-2">
            <p className="text-lg text-brand-text/70">
              Jab life ho out of control,
            </p>
            <p className="text-lg text-brand-text/70">
              toh haath muh pe rakh ke bol —
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-brand-orange sm:text-5xl">
              ALL IZZ WELL!
            </h1>
          </div>

          <p className="mb-8 max-w-sm text-sm leading-relaxed text-brand-text/60">
            Exam season wellness for NEET, JEE, UPSC & board students. Track the
            good stuff. Talk to Rancho. Breathe. Chill.
          </p>

          <div className="flex w-full max-w-xs flex-col gap-3">
            <Link href="/login">
              <Button size="lg" className="w-full">
                Login to continue
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" size="lg" className="w-full">
                New here? Join the chill side
              </Button>
            </Link>
          </div>
        </section>

        <section className="mt-12 grid grid-cols-2 gap-3">
          {FEATURES.map((feature) => {
            const Icon = feature.icon
            return (
              <Card key={feature.title} className="border-brand-purple/10">
                <CardContent className="p-4">
                  <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-brand-purple/10">
                    <Icon className="h-4 w-4 text-brand-purple" />
                  </div>
                  <p className="text-sm font-semibold">{feature.title}</p>
                  <p className="mt-1 text-xs text-brand-text/60">{feature.desc}</p>
                </CardContent>
              </Card>
            )
          })}
        </section>

        <Card className="mt-6 border-brand-teal/20 bg-brand-teal/5">
          <CardContent className="flex gap-3 p-5">
            <Shield className="mt-0.5 h-5 w-5 shrink-0 text-brand-teal" />
            <div className="text-left text-sm text-brand-text/80">
              <p className="font-semibold text-brand-text">
                Stress signals stay in the backend
              </p>
              <p className="mt-1 leading-relaxed">
                When you talk to Rancho, <strong>Hume AI</strong> reads emotional
                cues from your voice and we log them privately for care — never as
                scary labels on your screen. You only see{' '}
                <Heart className="inline h-3.5 w-3.5 text-brand-orange" /> positive
                markers: streaks, mood wins, energy, and what went well today.
                Showing raw stress scores would only make exam anxiety worse — so
                we don&apos;t.
              </p>
            </div>
          </CardContent>
        </Card>

        <p className="mt-8 text-center text-xs leading-relaxed text-brand-text/40">
          PWA — iPhone: Safari → Share → Add to Home Screen.
          <br />
          Android: use the Install banner when it appears.
        </p>
      </div>
    </div>
  )
}
