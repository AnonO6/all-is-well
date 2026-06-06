import { env } from '@/lib/env'

const UNSPLASH_BASE = 'https://api.unsplash.com'

type UnsplashPhoto = {
  id: string
  urls: { regular: string; small: string }
  alt_description: string | null
  user: { name: string }
}

export async function fetchWellnessImage(moodScore?: number) {
  const query =
    moodScore && moodScore <= 4
      ? 'sunrise calm nature hope'
      : 'peaceful nature meditation wellness'

  const response = await fetch(
    `${UNSPLASH_BASE}/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
    {
      headers: { Authorization: `Client-ID ${env.UNSPLASH_API_KEY}` },
      next: { revalidate: 3600 },
    },
  )

  if (!response.ok) {
    return null
  }

  const data = (await response.json()) as { results: UnsplashPhoto[] }
  const photo = data.results[0]
  if (!photo) return null

  return {
    url: photo.urls.regular,
    thumbnail: photo.urls.small,
    alt: photo.alt_description ?? 'Calming nature scene',
    credit: photo.user.name,
  }
}
