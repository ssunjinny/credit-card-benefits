const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})

export const isoDateOnly = (date: Date) => date.toISOString().slice(0, 10)

export const today = () => isoDateOnly(new Date())

export const yesterday = () => isoDateOnly(new Date(Date.now() - 86_400_000))

export const isValidIsoDate = (value: string) =>
  /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value))

export const formatDateLabel = (iso: string) => dateFormatter.format(new Date(iso))

export const yearOf = (iso: string) => new Date(iso).getFullYear()

export const currentYear = () => new Date().getFullYear()

const MS_PER_DAY = 86_400_000

export const daysBetween = (fromIso: string, toIso: string) => {
  const from = Date.parse(fromIso)
  const to = Date.parse(toIso)
  if (!Number.isFinite(from) || !Number.isFinite(to)) return null
  return Math.floor((to - from) / MS_PER_DAY)
}

export const relativeDayLabel = (iso: string) => {
  const days = daysBetween(iso, today())
  if (days == null) return formatDateLabel(iso)
  if (days <= 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  return formatDateLabel(iso)
}
