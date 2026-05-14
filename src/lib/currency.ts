const wholeUsd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

const preciseUsd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export const formatCurrency = (amount: number) => wholeUsd.format(amount)

export const formatCurrencyPrecise = (amount: number) => preciseUsd.format(amount)

export const formatAmountInput = (raw: string): string => {
  const cleaned = raw.replace(/[^\d.]/g, '')
  const decimalIdx = cleaned.indexOf('.')
  if (decimalIdx === -1) {
    const integer = cleaned.replace(/^0+(?=\d)/, '')
    return integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }
  const intPart = cleaned.slice(0, decimalIdx).replace(/^0+(?=\d)/, '')
  const fracPart = cleaned
    .slice(decimalIdx + 1)
    .replace(/\./g, '')
    .slice(0, 2)
  const intWithCommas = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return `${intWithCommas}.${fracPart}`
}

export const parseAmount = (formatted: string): number =>
  Number.parseFloat(formatted.replace(/,/g, ''))
