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
