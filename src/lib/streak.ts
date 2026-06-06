export function computeCheckInStreak(
  entryDates: Date[],
  today: Date = new Date(),
): number {
  if (entryDates.length === 0) return 0

  const normalizedToday = new Date(today)
  normalizedToday.setHours(0, 0, 0, 0)

  const uniqueDays = new Set(
    entryDates.map((date) => {
      const normalized = new Date(date)
      normalized.setHours(0, 0, 0, 0)
      return normalized.getTime()
    }),
  )

  const checkDate = new Date(normalizedToday)
  if (!uniqueDays.has(checkDate.getTime())) {
    checkDate.setDate(checkDate.getDate() - 1)
  }

  let streak = 0
  while (uniqueDays.has(checkDate.getTime())) {
    streak += 1
    checkDate.setDate(checkDate.getDate() - 1)
  }

  return streak
}
