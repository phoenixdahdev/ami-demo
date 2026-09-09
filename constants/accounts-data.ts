import { ColorKeys } from '@/theme/colors';
import { ImageSourcePropType } from 'react-native';

/**
 * The accounts a new customer is opened with, and the shape they keep.
 *
 * The profile is fixed — a name, a currency, the badge colours — while the
 * balance moves as the simulation runs, so the two are separate. The profile
 * lives here in code; the balance lives in the ledger store, on the phone.
 *
 * Colours are token names rather than hex, so a palette change reaches these
 * badges like it reaches everything else.
 */
export type AccountProfile = {
  id: string;
  name: string;
  /** Masked account number, shown as "•••• 6098". */
  last4: string;
  /** ISO code, shown beside the balance. */
  currency: string;
  /** Spelled-out currency, shown under the balance. */
  currencyName: string;
  /** Regional-indicator pair, shown beside the balance. */
  flag: string;
  /** Currency sign shown in the badge and in front of amounts. */
  symbol: string;
  /** Badge fill and the symbol's colour, as `theme/colors` keys. */
  tint: ColorKeys;
  accent: ColorKeys;
};

/** A profile with the money in it. Balance is in minor units — see `lib/money`. */
export type Account = AccountProfile & { balance: number };

export const ACCOUNT_PROFILES: AccountProfile[] = [
  {
    id: 'main-usd',
    name: 'Main account',
    last4: '6098',
    currency: 'USD',
    currencyName: 'US Dollar',
    flag: '🇺🇸',
    symbol: '$',
    tint: 'brandSubtle',
    accent: 'primary',
  },
  {
    id: 'euro',
    name: 'Euro account',
    last4: '4107',
    currency: 'EUR',
    currencyName: 'Euro',
    flag: '🇪🇺',
    symbol: '€',
    tint: 'lavender',
    accent: 'purple',
  },
  {
    id: 'savings-gbp',
    name: 'Savings',
    last4: '8842',
    currency: 'GBP',
    currencyName: 'British Pound',
    flag: '🇬🇧',
    symbol: '£',
    tint: 'peach',
    accent: 'orange',
  },
];

/** What each account is opened with, in minor units. */
export const OPENING_BALANCES: Record<string, number> = {
  'main-usd': 2_075_000,
  euro: 408_300,
  'savings-gbp': 31_000,
};

/**
 * Merchant artwork, keyed rather than embedded: a `require()` resolves to a
 * number that means nothing after a relaunch, so what gets written to storage
 * is the key and the image is looked up again here on the way out.
 */
export const MERCHANT_LOGOS: Record<string, ImageSourcePropType> = {
  starbucks: require('../assets/images/brand-starbucks.webp'),
  payee: require('../assets/images/user-avatar.webp'),
};

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
