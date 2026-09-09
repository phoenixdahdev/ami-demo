import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { MERCHANT_LOGOS } from '@/constants/accounts-data';
import { useColor } from '@/hooks/use-color';
import { formatDelta, formatShortDate } from '@/lib/money';
import { LedgerEntry, useLedgerStore } from '@/stores/ledger-store';
import { Image } from 'expo-image';

const LOGO = 44;

/**
 * Figma 51:136 — 44pt logo, merchant over category, amount over date.
 *
 * The row reads its own currency off the account the entry belongs to, so a
 * list mixing accounts labels each line correctly without every caller having
 * to thread the currency through. Rows without artwork get the merchant's
 * initial instead of a placeholder image.
 */
export function TransactionRow({ item }: { item: LedgerEntry }) {
  const currency = useLedgerStore(
    (state) =>
      state.accounts.find((account) => account.id === item.accountId)
        ?.currency ?? ''
  );

  const strong = useColor('foreground');
  const green = useColor('green');
  const canvas = useColor('canvas');
  const bodyColor = useColor('secondaryForeground');

  const logo = item.logo ? MERCHANT_LOGOS[item.logo] : undefined;
  const amount = formatDelta(item.amount, currency);

  return (
    <View
      accessibilityRole='summary'
      accessibilityLabel={`${item.merchant}, ${item.category}, ${amount}, ${formatShortDate(item.date)}`}
      style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}
    >
      {logo ? (
        <Image
          source={logo}
          style={{ width: LOGO, height: LOGO, borderRadius: LOGO / 2 }}
          contentFit='contain'
        />
      ) : (
        <View
          style={{
            width: LOGO,
            height: LOGO,
            borderRadius: LOGO / 2,
            backgroundColor: canvas,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text variant='body' lightColor={bodyColor}>
            {item.merchant.charAt(0).toUpperCase()}
          </Text>
        </View>
      )}

      <View style={{ flex: 1 }}>
        <Text variant='body' lightColor={strong} numberOfLines={1}>
          {item.merchant}
        </Text>
        <Text variant='caption' numberOfLines={1}>
          {item.category}
        </Text>
      </View>

      <View style={{ alignItems: 'flex-end' }}>
        {/* Money in is worth picking out; money out is the ordinary case. */}
        <Text variant='body' lightColor={item.amount > 0 ? green : strong}>
          {amount}
        </Text>
        <Text variant='caption'>{formatShortDate(item.date)}</Text>
      </View>
    </View>
  );
}
