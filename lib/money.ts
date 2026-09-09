/**
 * Money handling for the simulation.
 *
 * Balances are held as integer minor units — cents, not dollars. A ledger that
 * adds and subtracts floats drifts (0.1 + 0.2 is famously not 0.3), and once a
 * balance is wrong by a cent every screen showing it is wrong too. Conversion
 * to major units happens only at the point of display.
 */

/**
 * Grouping separator, as the kit writes balances: `$20 750`, not `$20,750`.
 * Non-breaking, so a balance never wraps mid-number — written as an escape
 * because the literal character is invisible and easy to "correct" away.
 */
const GROUP = '\u00A0';

export const toMinor = (major: number) => Math.round(major * 100);
export const toMajor = (minor: number) => minor / 100;

function group(value: number, decimals: number) {
  return value
    .toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })
    .replace(/,/g, GROUP);
}

/**
 * A balance, the way the kit writes one: `$20 750`, dropping the decimals when
 * there are none to show and keeping both when there are.
 */
export function formatMoney(minor: number, symbol = '$'): string {
  const major = toMajor(Math.abs(minor));
  const sign = minor < 0 ? '-' : '';
  return `${sign}${symbol}${group(major, major % 1 === 0 ? 0 : 2)}`;
}

/**
 * A movement on the ledger, the way a transaction row writes one:
 * `- 1.33 USD`, `+ 500.00 USD`. Always two decimals — a statement line shows
 * the cents even when they are zero.
 */
export function formatDelta(minor: number, currency: string): string {
  const sign = minor < 0 ? '-' : '+';
  return `${sign} ${group(toMajor(Math.abs(minor)), 2)} ${currency}`;
}

/** `21.02.21`, the date format the kit's transaction rows use. */
export function formatShortDate(iso: string): string {
  const date = new Date(iso);
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${pad(
    date.getFullYear() % 100
  )}`;
}
