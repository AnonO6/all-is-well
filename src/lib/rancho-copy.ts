export const RANCHO_QUOTES = [
  'All is well, buddy. Even when Virus says otherwise.',
  'Virus ne aaj kya bola? Kuch bhi. Tu sun mat — tu jee.',
  'Did you sleep well today? Ya 3 AM "bas ek chapter aur" wala scene?',
  'Machine banoge ya insaan? Insaan. Ab thoda saans le, yaar.',
  'Rank sheet poori zindagi nahi hai — wo Netflix subscription bhi nahi.',
  'Excellence ke peeche bhaago. Marks ke peeche mat — wo thak jaayenge.',
  'Beta doctor banega? Pehle beta khush banega. Deal?',
  'Pressure cooker mein mat reh. Khol ke thoda hawa le.',
  'Comparison chor — tu apni race mein first aa, baaki sab side character.',
  'Rest bhi padhai ka part hai. Rancho ne bola hai. Case closed.',
]

export function getDailyGreeting(name: string) {
  const hour = new Date().getHours()
  const firstName = name.split(' ')[0] ?? 'buddy'

  if (hour < 12) {
    return {
      eyebrow: 'Good morning, buddy',
      headline: `Did you sleep well today, ${firstName}?`,
      subline: 'Honest answer only. Rancho is watching. Gently.',
    }
  }

  if (hour < 17) {
    return {
      eyebrow: 'All is well, buddy?',
      headline: `Virus ne aaj kya bola, ${firstName}?`,
      subline: 'Chill. Bol de. Phir hum "all is well" karenge.',
    }
  }

  return {
    eyebrow: 'Evening check-in',
    headline: `All is well, ${firstName}?`,
    subline: 'Raat ke 11 baje bhi tu insaan hai. Machine nahi.',
  }
}

export const CHECK_IN_STEPS = [
  'Dil ka meter',
  'Battery check',
  'Aaj kya achha hua',
  'Chupke se bol',
] as const

export const CHECK_IN_COPY = {
  doneTitle: 'All is well, buddy.',
  doneSubtitle: 'Aaj tu aaya. Virus impressed nahi hoga — hum hain.',
  title: 'Daily reality check',
  moodTitle: 'Aaj dil kaisa hai?',
  moodHint: 'Face choose kar — Rancho judge nahi karega',
  energyTitle: 'Battery kitni bachi hai?',
  energyLabel: 'Energy',
  highlightsTitle: 'Aaj kya achha hua?',
  highlightsHint: 'Choti choti jeet bhi jeet hai — select kar le',
  noteTitle: 'Kuch aur kehna hai?',
  noteHint: 'Optional. Ek line bhi chalegi.',
  notePlaceholder: 'Aaj main feel kar raha hoon... kyunki...',
  complete: 'Done — all is well',
  saving: 'Saving...',
} as const

export const POSITIVE_HIGHLIGHT_LABELS: Record<string, string> = {
  good_sleep: 'Achhi neend aayi',
  study_win: 'Padhai mein win',
  took_break: 'Break liya — smart',
  talked_friend: 'Dost se baat ki',
  went_outside: 'Bahar hawa li',
  ate_well: 'Khana time pe',
  family_time: 'Ghar walo ke saath time',
  other_win: 'Koi aur jeet',
}

export const TRIGGER_LABELS: Record<string, string> = {
  exam_pressure: 'Virus wala pressure',
  comparison: 'Sharma ji ka beta',
  sleep: 'Neend chori ho gayi',
  family: 'Ghar wale expectations',
  time: 'Time kam, syllabus zyada',
  uncertainty: 'Result ka suspense',
  other: 'Kuch aur drama',
}

export const NAV_LABELS = {
  journal: 'Kuch likh',
  breathe: 'Saans le',
  rancho: 'Rancho',
} as const

export const PAGE_COPY = {
  journal: {
    title: 'Chupke se likh',
    subtitle: 'Jo bol nahi sakta, likh de. Virus nahi padhega.',
    promptLoading: 'Rancho soch raha hai...',
    newPrompt: 'Ek aur sawaal',
    moodBefore: 'Likhte pehle dil kaisa tha?',
    reflection: 'Apni baat likh',
    reflectionPlaceholder: 'Yahan sab safe hai. Bol de...',
    saveMood: 'Save karo & mood check',
    moodAfter: 'Ab dil kaisa hai?',
    save: 'Save kar',
    saving: 'Saving...',
    past: 'Pehle kya likha',
  },
  breathe: {
    title: 'Saans le, yaar',
    subtitle: 'Machine mode off. Insaan mode on.',
    bodyScan: 'Body scan — Rancho edition',
  },
  insights: {
    title: 'Teri wins report card',
    subtitle: 'Sirf positive markers — stress backend mein rehta hai, screen pe nahi.',
    avgMood: 'Avg mood',
    avgEnergy: 'Avg energy',
    moodTrend: 'Mood & energy graph',
    wins: 'Aaj kya achha hua (top wins)',
    aiSummary: 'Rancho ka weekly take',
    empty: 'Abhi data nahi — pehle check-in kar, buddy',
    privacyNote:
      'Talk to Rancho sessions use Hume AI to read voice emotions privately. We never show raw stress scores — that would only make exam anxiety worse.',
  },
  rancho: {
    title: 'Talk to Rancho',
    subtitle:
      'Hume sunega kaise bol rahe ho — phir Rancho chill, funny, actually-helpful advice dega',
  },
  offline: {
    title: 'Net gaya. All is well.',
    subtitle: 'Saans le sakta hai offline bhi. Baaki sync baad mein.',
    cta: 'Saans le',
  },
  auth: {
    loginTagline: 'Exam season? All is well, buddy.',
    registerTagline: 'Join the chill side. Virus not invited.',
    loginError: 'Galat email/password. Virus khush ho gaya. Try again.',
  },
} as const
