import { AccountRow } from '@/components/accounts/account-row';
import { BalancePanel } from '@/components/accounts/balance-panel';
import { HomeHeader } from '@/components/home/home-header';
import { TransactionRow } from '@/components/home/transaction-row';
import { ScrollView } from '@/components/ui/scroll-view';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { useBottomTabOverflow } from '@/hooks/use-bottom-tab-overflow';
import { useColor } from '@/hooks/use-color';
import { useHaptics } from '@/hooks/use-haptics';
import { useAuthStore } from '@/stores/auth-store';
import { selectAccount, useLedgerStore } from '@/stores/ledger-store';
import { RADIUS } from '@/theme/globals';
import ArrowRight01Icon from '@hugeicons-pro/core-stroke-rounded/ArrowRight01Icon';
import PlusSignIcon from '@hugeicons-pro/core-stroke-rounded/PlusSignIcon';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { router } from 'expo-router';
import { Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * The landing tab. No Figma frame for this one — it is built from the design
 * system the Cards screen established: the same canvas, the same white panels
 * at 16pt, the same header, so the two tabs read as one app. The balance panel
 * follows the reference screenshot at node 24:119.
 */
const GUTTER = 16;

export default function AccountsScreen() {
  const profile = useAuthStore((state) => state.profile);
  const tabBar = useBottomTabOverflow();
  const feedback = useHaptics();

  const accounts = useLedgerStore((state) => state.accounts);
  const transactions = useLedgerStore((state) => state.transactions);
  const account = useLedgerStore(selectAccount);
  const select = useLedgerStore((state) => state.select);

  const canvas = useColor('canvas');
  const surface = useColor('background');
  const bodyColor = useColor('secondaryForeground');
  const border = useColor('border');
  const primary = useColor('primary');

  return (
    <View style={{ flex: 1, backgroundColor: canvas }}>
      <SafeAreaView edges={['top']}>
        <HomeHeader name={profile.name} />
      </SafeAreaView>

      <ScrollView
        contentContainerStyle={{ paddingBottom: tabBar + 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ marginTop: GUTTER }}>
          <BalancePanel
            account={account}
            onSwitch={() => router.push('/choose-source')}
          />
        </View>

        {/* ── The accounts themselves ───────────────────────────────────── */}
        <Text
          variant='body'
          lightColor={bodyColor}
          style={{ marginTop: 32, marginHorizontal: GUTTER }}
        >
          Accounts
        </Text>

        <View
          style={{
            marginTop: 12,
            marginHorizontal: GUTTER,
            paddingHorizontal: GUTTER,
            paddingVertical: 4,
            backgroundColor: surface,
            borderRadius: RADIUS.lg,
          }}
        >
          {accounts.map((item, index) => (
            <View key={item.id}>
              {index > 0 ? (
                <View style={{ height: 1, backgroundColor: border }} />
              ) : null}
              <AccountRow account={item} onPress={() => select(item.id)} />
            </View>
          ))}
        </View>

        <Pressable
          onPress={() => feedback('impact-light')}
          accessibilityRole='button'
          accessibilityLabel='Open a new account'
          style={({ pressed }) => ({
            marginTop: 12,
            marginHorizontal: GUTTER,
            padding: GUTTER,
            borderRadius: RADIUS.lg,
            borderWidth: 1,
            borderStyle: 'dashed',
            borderColor: border,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            opacity: pressed ? 0.6 : 1,
          })}
        >
          <View
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: canvas,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <HugeiconsIcon
              icon={PlusSignIcon}
              size={18}
              color={primary}
              strokeWidth={2}
            />
          </View>

          <Text variant='body' lightColor={primary} style={{ flex: 1 }}>
            Open a new account
          </Text>

          <HugeiconsIcon
            icon={ArrowRight01Icon}
            size={20}
            color={primary}
            strokeWidth={1.5}
          />
        </Pressable>

        {/* ── Recent activity across every account ──────────────────────── */}
        <Text
          variant='body'
          lightColor={bodyColor}
          style={{ marginTop: 32, marginHorizontal: GUTTER }}
        >
          Recent activity
        </Text>

        <View
          style={{
            marginTop: 12,
            marginHorizontal: GUTTER,
            padding: GUTTER,
            backgroundColor: surface,
            borderRadius: RADIUS.lg,
            gap: 16,
          }}
        >
          {transactions.slice(0, 8).map((item) => (
            <TransactionRow key={item.id} item={item} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
