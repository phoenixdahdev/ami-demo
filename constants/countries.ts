export type Country = {
  /** ISO 3166-1 alpha-2, and the key the picker tracks selection by. */
  code: string;
  name: string;
  /** Dial code including the leading +. */
  dial: string;
  /** Regional-indicator pair. Renders as the flag on iOS and Android. */
  flag: string;
};

/**
 * The ten countries the Figma picker lists, in its order. The kit draws each
 * flag as a circular raster; emoji keep the list to data instead of ten image
 * assets, and stay crisp at any size.
 */
export const COUNTRIES: Country[] = [
  { code: 'AZ', name: 'Azerbaijan', dial: '+994', flag: '🇦🇿' },
  { code: 'GB', name: 'United Kingdom', dial: '+44', flag: '🇬🇧' },
  { code: 'FR', name: 'France', dial: '+33', flag: '🇫🇷' },
  { code: 'US', name: 'United States', dial: '+1', flag: '🇺🇸' },
  { code: 'CN', name: 'China', dial: '+86', flag: '🇨🇳' },
  { code: 'IN', name: 'India', dial: '+91', flag: '🇮🇳' },
  { code: 'AL', name: 'Albania', dial: '+355', flag: '🇦🇱' },
  { code: 'SG', name: 'Singapore', dial: '+65', flag: '🇸🇬' },
  { code: 'AU', name: 'Australia', dial: '+61', flag: '🇦🇺' },
  { code: 'AD', name: 'Andorra', dial: '+376', flag: '🇦🇩' },
];

export const DEFAULT_COUNTRY = COUNTRIES[0];

/** Groups digits the way the kit shows them: "51 748 51 75". */
export function formatPhone(digits: string): string {
  const groups = [2, 3, 2, 2];
  const out: string[] = [];
  let at = 0;

  for (const size of groups) {
    if (at >= digits.length) break;
    out.push(digits.slice(at, at + size));
    at += size;
  }
  if (at < digits.length) out.push(digits.slice(at));

  return out.join(' ');
}
