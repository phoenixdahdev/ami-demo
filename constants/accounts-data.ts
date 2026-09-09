import { ColorKeys } from '@/theme/colors';

/**
 * The accounts tab's contents. No backend, so this is the fixture the screen
 * renders — shaped the way an API response would be.
 *
 * Colours are token names rather than hex, so a palette change reaches these
 * badges like it reaches everything else.
 */
export type Account = {
  id: string;
  name: string;
  /** Masked account number, shown as "•••• 6098". */
  last4: string;
  balance: string;
  currency: string;
  /** Spelled-out currency, shown under the balance. */
  currencyName: string;
  /** Regional-indicator pair, shown beside the balance. */
  flag: string;
  /** Currency sign shown in the badge. */
  symbol: string;
  /** Badge fill and the symbol's colour, as `theme/colors` keys. */
  tint: ColorKeys;
  accent: ColorKeys;
};

export const ACCOUNTS: Account[] = [
  {
    id: 'main-usd',
    name: 'Main account',
    last4: '6098',
    currencyName: 'US Dollar',
    flag: '🇺🇸',
    balance: '$20 750',
    currency: 'USD',
    symbol: '$',
    tint: 'brandSubtle',
    accent: 'primary',
  },
  {
    id: 'euro',
    name: 'Euro account',
    last4: '4107',
    currencyName: 'Euro',
    flag: '🇪🇺',
    balance: '€4 083',
    currency: 'EUR',
    symbol: '€',
    tint: 'lavender',
    accent: 'purple',
  },
  {
    id: 'savings-gbp',
    name: 'Savings',
    last4: '8842',
    currencyName: 'British Pound',
    flag: '🇬🇧',
    balance: '£310',
    currency: 'GBP',
    symbol: '£',
    tint: 'peach',
    accent: 'orange',
  },
];

/**
 * The "Other" group in the source sheet: currencies you could hold but don't
 * yet. The reference lists France as CFP, which is the Pacific franc — EUR here.
 */
export type SourceOption = {
  id: string;
  name: string;
  currency: string;
  flag: string;
};

export const OTHER_SOURCES: SourceOption[] = [
  { id: 'az', name: 'Azerbaijan', currency: 'AZN', flag: '🇦🇿' },
  { id: 'gb', name: 'Great Britain', currency: 'GBP', flag: '🇬🇧' },
  { id: 'fr', name: 'France', currency: 'EUR', flag: '🇫🇷' },
  { id: 'cn', name: 'China', currency: 'CNY', flag: '🇨🇳' },
  { id: 'in', name: 'India', currency: 'INR', flag: '🇮🇳' },
  { id: 'au', name: 'Australia', currency: 'AUD', flag: '🇦🇺' },
];
