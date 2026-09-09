import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollView } from '@/components/ui/scroll-view';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { useColor } from '@/hooks/use-color';
import { formatMoney, toMinor } from '@/lib/money';
import { selectAccount, useLedgerStore } from '@/stores/ledger-store';
import { selectAmountValue, useTransferStore } from '@/stores/transfer-store';
import { RADIUS } from '@/theme/globals';
import Alert01Icon from '@hugeicons-pro/core-solid-rounded/Alert01Icon';
import Edit02Icon from '@hugeicons-pro/core-stroke-rounded/Edit02Icon';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { router } from 'expo-router';
import { Alert, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/** Figma 668:6949. */
const GUTTER = 16;

const WARNING_COPY =
  'Nec ornare praesent laoreet vitae metus, egestas proin eget metus. Dignissim fringilla porta risus varius sit purus facilisi etiam. Vitae leo consequat eu scelerisque leo aliquam.';

/** A label on the left, its value on the right — the frame's Component 56. */
function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
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
      <View
        style={{
          flexShrink: 1,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
        }}
      >
        {children}
      </View>
    </View>
  );
}

function Panel({ children }: { children: React.ReactNode }) {
  const surface = useColor('background');

  return (
    <View
      style={{
        marginTop: 12,
        marginHorizontal: GUTTER,
        padding: GUTTER,
        borderRadius: RADIUS.sm,
        backgroundColor: surface,
        gap: 12,
      }}
    >
      {children}
    </View>
  );
}

export default function ReviewScreen() {
  const recipient = useTransferStore((state) => state.recipient);
  const reference = useTransferStore((state) => state.reference);
  const value = useTransferStore(selectAmountValue);
  const isSending = useTransferStore((state) => state.isSending);
  const source = useLedgerStore(selectAccount);

  const canvas = useColor('canvas');
  const bodyColor = useColor('secondaryForeground');
  const warning = useColor('warning');

  const total = formatMoney(toMinor(value), source.symbol);

  return (
    <View style={{ flex: 1, backgroundColor: canvas }}>
      <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1 }}>
        <ScreenHeader title='Review transfer' />

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        >
          <Panel>
            <HugeiconsIcon icon={Alert01Icon} size={20} color={warning} />
            <Text variant='body' lightColor={bodyColor}>
              Do you know and trust this payee?
            </Text>
            <Text variant='caption'>{WARNING_COPY}</Text>
          </Panel>

          <Panel>
            <Row label='To'>
              <Avatar size={20}>
                <AvatarImage source={recipient.avatar} />
              </Avatar>
              <Text variant='body' lightColor={bodyColor}>
                {recipient.name}
              </Text>
            </Row>
            <Row label='IBAN'>
              <Text
                variant='body'
                lightColor={bodyColor}
                numberOfLines={1}
                style={{ flexShrink: 1 }}
              >
                {recipient.iban}
              </Text>
            </Row>
          </Panel>

          <Panel>
            <Row label='Reference'>
              <Text variant='body' lightColor={bodyColor} numberOfLines={1}>
                {reference}
              </Text>
              <Pressable
                hitSlop={8}
                accessibilityRole='button'
                accessibilityLabel='Edit reference'
                style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
              >
                <HugeiconsIcon
                  icon={Edit02Icon}
                  size={20}
                  color={bodyColor}
                  strokeWidth={1.5}
                />
              </Pressable>
            </Row>
          </Panel>

          <Panel>
            <Row label='Recipient gets'>
              <Text variant='body' lightColor={bodyColor}>
                {total}
              </Text>
            </Row>
            <Row label='Fees'>
              <Text variant='body' lightColor={bodyColor}>
                No fees
              </Text>
            </Row>
            <Row label='Your total'>
              <Text variant='body' lightColor={bodyColor}>
                {total}
              </Text>
            </Row>
          </Panel>

          <Panel>
            <Row label='Estimated arrival'>
              <Text variant='body' lightColor={bodyColor}>
                Usually in seconds
              </Text>
            </Row>
            <Row label='Paying from'>
              <Text variant='body' lightColor={bodyColor}>
                {source.name}
              </Text>
            </Row>
          </Panel>
        </ScrollView>

        <Button
          loading={isSending}
          onPress={async () => {
            const entry = await useTransferStore.getState().send();

            // The store refuses a debit it can't cover. Nothing on this screen
            // can cause that, but the balance is free to move between here and
            // the tap that started the transfer.
            if (!entry) {
              Alert.alert(
                'Not enough in that account',
                `${source.name} holds ${formatMoney(
                  source.balance,
                  source.symbol
                )}.`
              );
              return;
            }

            router.replace('/transfer/done');
          }}
          style={{
            marginHorizontal: GUTTER,
            marginBottom: 8,
            borderRadius: RADIUS.md,
          }}
        >
          Send
        </Button>
      </SafeAreaView>
    </View>
  );
}
