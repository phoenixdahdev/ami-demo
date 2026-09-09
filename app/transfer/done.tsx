import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { useColor } from '@/hooks/use-color';
import { selectAmountValue, useTransferStore } from '@/stores/transfer-store';
import { RADIUS } from '@/theme/globals';
import CheckmarkCircle02Icon from '@hugeicons-pro/core-solid-rounded/CheckmarkCircle02Icon';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { router } from 'expo-router';

/**
 * The confirmation, in the kit's success language (563:5693): a green check on
 * a small sheet with a single line under it.
 */
export default function TransferDoneScreen() {
  const recipient = useTransferStore((state) => state.recipient);
  const value = useTransferStore(selectAmountValue);
  const reset = useTransferStore((state) => state.reset);

  const green = useColor('green');
  const bodyColor = useColor('secondaryForeground');

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
        gap: 24,
      }}
    >
      <HugeiconsIcon icon={CheckmarkCircle02Icon} size={64} color={green} />

      <Text variant='body' lightColor={bodyColor} style={{ textAlign: 'center' }}>
        ${value} sent to {recipient.name}
      </Text>

      <Button
        onPress={() => {
          reset();
          router.dismissAll();
          router.replace('/');
        }}
        style={{ width: '100%', borderRadius: RADIUS.md }}
      >
        Done
      </Button>
    </View>
  );
}
