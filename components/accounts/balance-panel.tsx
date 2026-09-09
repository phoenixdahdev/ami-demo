import {
  QuickActions,
  type QuickAction,
} from '@/components/home/quick-actions';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { Account } from '@/constants/accounts-data';
import { useColor } from '@/hooks/use-color';
import { useHaptics } from '@/hooks/use-haptics';
import { formatMoney } from '@/lib/money';
import { RADIUS } from '@/theme/globals';
import ArrowDataTransferHorizontalIcon from '@hugeicons-pro/core-stroke-rounded/ArrowDataTransferHorizontalIcon';
import ArrowDown01Icon from '@hugeicons-pro/core-stroke-rounded/ArrowDown01Icon';
import MoreHorizontalIcon from '@hugeicons-pro/core-stroke-rounded/MoreHorizontalIcon';
import PlusSignIcon from '@hugeicons-pro/core-stroke-rounded/PlusSignIcon';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { router } from 'expo-router';
import { Pressable } from 'react-native';

const ACTIONS: QuickAction[] = [
  { icon: PlusSignIcon, label: 'Add money' },
  {
    icon: ArrowDataTransferHorizontalIcon,
    label: 'Transfer',
    onPress: () => router.push('/transfer'),
  },
  { icon: MoreHorizontalIcon },
];

const FLAG = 40;
const SWITCH = 24;

/**
 * The balance header: the selected account's amount with a switcher beside it,
 * the currency spelled out underneath, its flag on the right, and the actions
 * as tinted pills.
 *
 * Follows the reference screenshot at node 24:119 — a raster pasted into the
 * Figma file rather than a frame, so the proportions are read from it and the
 * colours all come from our tokens.
 */
export function BalancePanel({
  account,
  onSwitch,
}: {
  account: Account;
  onSwitch: () => void;
}) {
  const surface = useColor('background');
  const brandFill = useColor('brandSubtle');
  const brandInk = useColor('primary');
  const canvas = useColor('canvas');
  const feedback = useHaptics();

  return (
    <View
      style={{
        paddingTop: 20,
        paddingBottom: 16,
        backgroundColor: surface,
        borderRadius: RADIUS.lg,
      }}
    >
      <View
        style={{
          paddingHorizontal: 16,
          flexDirection: 'row',
          alignItems: 'flex-start',
        }}
      >
        <View style={{ flex: 1 }}>
          <View
            style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
          >
            <Text variant='heading'>
              {formatMoney(account.balance, account.symbol)}
            </Text>

            <Pressable
              onPress={() => {
                feedback('selection');
                onSwitch();
              }}
              hitSlop={8}
              accessibilityRole='button'
              accessibilityLabel={`${account.currencyName}. Switch account`}
              style={({ pressed }) => ({
                width: SWITCH,
                height: SWITCH,
                borderRadius: SWITCH / 2,
                backgroundColor: brandFill,
                alignItems: 'center',
                justifyContent: 'center',
                opacity: pressed ? 0.6 : 1,
              })}
            >
              <HugeiconsIcon
                icon={ArrowDown01Icon}
                size={16}
                color={brandInk}
                strokeWidth={2.5}
              />
            </Pressable>
          </View>

          <Text variant='caption'>{account.currencyName}</Text>
        </View>

        <View
          accessible={false}
          style={{
            width: FLAG,
            height: FLAG,
            borderRadius: FLAG / 2,
            backgroundColor: canvas,
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          <Text variant='title'>{account.flag}</Text>
        </View>
      </View>

      <View style={{ marginTop: 20 }}>
        <QuickActions actions={ACTIONS} tone='brand' />
      </View>
    </View>
  );
}
