import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { Account } from '@/constants/accounts-data';
import { useColor } from '@/hooks/use-color';
import { useHaptics } from '@/hooks/use-haptics';
import { Pressable } from 'react-native';

const BADGE = 44;

/**
 * One account: a tinted currency badge, the name over its masked number, and
 * the balance over its currency code.
 *
 * `useColor` is called with the account's own token names — safe because each
 * row is its own component instance, so the hook order never varies.
 */
export function AccountRow({
  account,
  onPress,
}: {
  account: Account;
  onPress?: () => void;
}) {
  const tint = useColor(account.tint);
  const accent = useColor(account.accent);
  const feedback = useHaptics();

  return (
    <Pressable
      onPress={() => {
        feedback('selection');
        onPress?.();
      }}
      accessibilityRole='button'
      accessibilityLabel={`${account.name}, ending ${account.last4}, ${account.balance}`}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 12,
        opacity: pressed ? 0.6 : 1,
      })}
    >
      <View
        style={{
          width: BADGE,
          height: BADGE,
          borderRadius: BADGE / 2,
          backgroundColor: tint,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text variant='subtitle' lightColor={accent}>
          {account.symbol}
        </Text>
      </View>

      <View style={{ flex: 1 }}>
        <Text variant='body' numberOfLines={1}>
          {account.name}
        </Text>
        <Text variant='caption'>•••• {account.last4}</Text>
      </View>

      <View style={{ alignItems: 'flex-end' }}>
        <Text variant='body'>{account.balance}</Text>
        <Text variant='caption'>{account.currency}</Text>
      </View>
    </Pressable>
  );
}
