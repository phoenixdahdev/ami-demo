import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { useColor } from '@/hooks/use-color';
import { useHaptics } from '@/hooks/use-haptics';
import { formatMoney } from '@/lib/money';
import { resetSimulation } from '@/lib/simulation';
import { useAuthStore } from '@/stores/auth-store';
import { selectTotalBalance, useLedgerStore } from '@/stores/ledger-store';
import { RADIUS } from '@/theme/globals';
import { router } from 'expo-router';
import { Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const GUTTER = 16;

/** A label on the left, its value on the right. */
function Row({ label, value }: { label: string; value: string }) {
  const bodyColor = useColor('secondaryForeground');

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
      }}
    >
      <Text variant='caption'>{label}</Text>
      <Text variant='body' lightColor={bodyColor}>
        {value}
      </Text>
    </View>
  );
}

/**
 * The account sheet, reached from the avatar in the header.
 *
 * Its real job is the button at the bottom: without a way to sign out there is
 * no way to see the sign-up flow a second time on a device that has already
 * been through it.
 */
export default function ProfileScreen() {
  const profile = useAuthStore((state) => state.profile);
  const openedAt = useLedgerStore((state) => state.openedAt);
  const total = useLedgerStore(selectTotalBalance);
  const transactionCount = useLedgerStore((state) => state.transactions.length);

  const insets = useSafeAreaInsets();
  const feedback = useHaptics();

  // Sheets paint nothing of their own, and every `View` here is transparent.
  const surface = useColor('background');
  const canvas = useColor('canvas');
  const red = useColor('red');

  const confirmReset = () => {
    Alert.alert(
      'Sign out?',
      'This clears the account, the balances and the loan from this phone. The next launch starts at sign up.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign out',
          style: 'destructive',
          onPress: () => {
            feedback('warning');
            // Dismiss first: the session guard replaces whatever is on top
            // once the state clears, and that should be the app, not this.
            router.back();
            resetSimulation();
          },
        },
      ]
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: canvas,
        paddingHorizontal: GUTTER,
        paddingTop: 24,
        paddingBottom: insets.bottom + 16,
      }}
    >
      <View style={{ alignItems: 'center', gap: 8 }}>
        <Avatar size={64}>
          <AvatarImage source={require('../assets/images/user-avatar.webp')} />
        </Avatar>
        <Text variant='subtitle'>{profile.name}</Text>
      </View>

      <View
        style={{
          marginTop: 24,
          padding: GUTTER,
          borderRadius: RADIUS.lg,
          backgroundColor: surface,
          gap: 12,
        }}
      >
        <Row label='Total balance' value={formatMoney(total)} />
        <Row
          label='Customer since'
          value={
            openedAt
              ? new Date(openedAt).toLocaleDateString('en-US', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })
              : '—'
          }
        />
        <Row label='Transactions' value={String(transactionCount)} />
      </View>

      <View style={{ flex: 1 }} />

      <Button
        variant='ghost'
        onPress={confirmReset}
        textStyle={{ color: red }}
        style={{ borderRadius: RADIUS.md }}
      >
        Sign out
      </Button>
    </View>
  );
}
