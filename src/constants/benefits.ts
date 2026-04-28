import { Benefit } from '../types';

export const ANNUAL_FEE = 895;

export const BENEFITS: Benefit[] = [
  {
    id: 'airline-fee',
    name: 'Airline Fee Credit',
    description:
      'Up to $200 in statement credits per calendar year for incidental fees on a selected qualifying airline.',
    category: 'fixed',
    annualCap: 200,
    resetType: 'jan1',
    icon: '✈️',
  },
  {
    id: 'uber-cash',
    name: 'Uber Cash',
    description:
      '$15 in Uber Cash each month, plus a $20 bonus in December — for a total of $200 per year on Uber rides and Uber Eats.',
    category: 'fixed',
    annualCap: 200,
    resetType: 'jan1',
    icon: '🚗',
  },
  {
    id: 'digital-entertainment',
    name: 'Digital Entertainment Credit',
    description:
      'Up to $20 per month (up to $240 per year) in statement credits on eligible digital subscriptions.',
    category: 'fixed',
    annualCap: 240,
    resetType: 'jan1',
    icon: '📱',
  },
  {
    id: 'walmart-plus',
    name: 'Walmart+ Credit',
    description:
      'Up to $12.95 per month (plus applicable taxes) in statement credits to cover a Walmart+ monthly membership.',
    category: 'fixed',
    annualCap: 155,
    resetType: 'jan1',
    icon: '🛒',
  },
  {
    id: 'clear-plus',
    name: 'CLEAR Plus Credit',
    description:
      'Up to $199 per calendar year in statement credits for a CLEAR Plus membership.',
    category: 'fixed',
    annualCap: 199,
    resetType: 'jan1',
    icon: '🛡️',
  },
  {
    id: 'equinox',
    name: 'Equinox Credit',
    description:
      'Up to $300 per year in statement credits on an Equinox membership.',
    category: 'fixed',
    annualCap: 300,
    resetType: 'jan1',
    icon: '🏋️',
  },
  {
    id: 'soulcycle',
    name: 'SoulCycle Credit',
    description:
      'Up to $300 per year in statement credits on SoulCycle at-home bike purchases.',
    category: 'fixed',
    annualCap: 300,
    resetType: 'jan1',
    icon: '🚴',
  },
  {
    id: 'global-entry',
    name: 'Global Entry / TSA PreCheck',
    description:
      'Up to $100 every 4 years for Global Entry, or $85 every 4.5 years for TSA PreCheck.',
    category: 'fixed',
    annualCap: 100,
    resetType: 'per_use',
    icon: '🛂',
  },
  {
    id: 'centurion-lounge',
    name: 'Centurion Lounge Access',
    description:
      'Complimentary access to The Centurion Lounge network worldwide.',
    category: 'soft',
    annualCap: null,
    resetType: 'jan1',
    icon: '🛋️',
  },
  {
    id: 'priority-pass',
    name: 'Priority Pass Lounge Access',
    description:
      'Priority Pass Select membership with access to over 1,400 airport lounges worldwide.',
    category: 'soft',
    annualCap: null,
    resetType: 'jan1',
    icon: '🌐',
  },
  {
    id: 'delta-sky-club',
    name: 'Delta Sky Club Access',
    description:
      'Complimentary access to Delta Sky Club lounges when flying Delta.',
    category: 'soft',
    annualCap: null,
    resetType: 'jan1',
    icon: '✈️',
  },
  {
    id: 'marriott-gold',
    name: 'Marriott Bonvoy Gold Status',
    description:
      'Complimentary Marriott Bonvoy Gold Elite Status with room upgrades and bonus points.',
    category: 'soft',
    annualCap: null,
    resetType: 'jan1',
    icon: '🏨',
  },
  {
    id: 'hilton-gold',
    name: 'Hilton Honors Gold Status',
    description:
      'Complimentary Hilton Honors Gold Status with bonus points and room upgrades.',
    category: 'soft',
    annualCap: null,
    resetType: 'jan1',
    icon: '🏩',
  },
  {
    id: 'fhr',
    name: 'Fine Hotels + Resorts Perks',
    description:
      'Premium benefits at over 1,500 properties: room upgrades, daily breakfast, $100 amenity credits, and more.',
    category: 'soft',
    annualCap: null,
    resetType: 'jan1',
    icon: '🌟',
  },
  {
    id: 'travel-insurance',
    name: 'Travel Insurance / Purchase Protection',
    description:
      'Trip cancellation, baggage, and purchase protection coverage on eligible purchases.',
    category: 'soft',
    annualCap: null,
    resetType: 'jan1',
    icon: '🔒',
  },
];

export const getBenefitById = (id: string): Benefit | undefined =>
  BENEFITS.find((b) => b.id === id);
