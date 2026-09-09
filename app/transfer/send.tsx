import { AvoidKeyboard } from '@/components/ui/avoid-keyboard';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { MIN_AMOUNT } from '@/constants/transfer-data';
import { useColor } from '@/hooks/use-color';
import { formatMoney, toMinor } from '@/lib/money';
import { selectAccount, useLedgerStore } from '@/stores/ledger-store';
import { selectAmountValue, useTransferStore } from '@/stores/transfer-store';
import { FONTS } from '@/theme/fonts';
import { RADIUS } from '@/theme/globals';
import ArrowDown01Icon from '@hugeicons-pro/core-stroke-rounded/ArrowDown01Icon';
import Note01Icon from '@hugeicons-pro/core-stroke-rounded/Note01Icon';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { router } from 'expo-router';
import { useRef } from 'react';
import { Pressable, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/** Figma 660:6502 (empty) and 661:7069 (with an amount). */
const GUTTER = 16;

export default function SendScreen() {
  const recipient = useTransferStore((state) => state.recipient);
  const amount = useTransferStore((state) => state.amount);
  const setAmount = useTransferStore((state) => state.setAmount);
  const note = useTransferStore((state) => state.note);
  const setNote = useTransferStore((state) => state.setNote);
  const value = useTransferStore(selectAmountValue);
  const source = useLedgerStore(selectAccount);

  // The amount is a styled Text over a hidden field, so the system keypad the
  // frame shows is the one that opens.
  const amountInput = useRef<TextInput>(null);

  const canvas = useColor('canvas');
  const surface = useColor('background');
  const bodyColor = useColor('secondaryForeground');
  const muted = useColor('textMuted');
  const text = useColor('text');
  const primary = useColor('primary');
  const red = useColor('red');

  const affordable = toMinor(value) <= source.balance;
  const canContinue = value >= MIN_AMOUNT && affordable;

  return (
    <View style={{ flex: 1, backgroundColor: canvas }}>
      <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1 }}>
        <ScreenHeader title='' />

        <View
          style={{
            marginTop: -24,
            paddingHorizontal: GUTTER,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <Avatar size={40}>
            <AvatarImage source={recipient.avatar} />
          </Avatar>
          <View style={{ flex: 1 }}>
            <Text variant='subtitle'>{recipient.name}</Text>
            <Text variant='caption'>{recipient.handle}</Text>
          </View>
        </View>

        {/* Source account */}
        <Pressable
          onPress={() => router.push('/choose-source')}
          accessibilityRole='button'
          accessibilityLabel={`Paying from ${source.name}. Change source`}
          style={({ pressed }) => ({
            marginTop: 20,
            marginHorizontal: GUTTER,
            padding: 12,
            borderRadius: RADIUS.md,
            backgroundColor: surface,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            opacity: pressed ? 0.6 : 1,
          })}
        >
          <Text variant='subtitle'>{source.flag}</Text>
          <View style={{ flex: 1 }}>
            <Text variant='body'>{source.name}</Text>
            <Text variant='caption'>
              Balance: {formatMoney(source.balance, source.symbol)}
            </Text>
          </View>
          <HugeiconsIcon
            icon={ArrowDown01Icon}
            size={24}
            color={muted}
            strokeWidth={1.5}
          />
        </Pressable>

        {/* Amount */}
        <Pressable
          onPress={() => amountInput.current?.focus()}
          accessibilityRole='button'
          accessibilityLabel={`Amount ${value} dollars. Edit`}
          style={{ marginTop: 40, alignItems: 'center' }}
        >
          <Text
            variant='heading'
            lightColor={value > 0 ? text : muted}
          >
            ${amount || '0'}
          </Text>
          {/* `caption` fixes its own muted colour, so an override has to come
              through `style`, which is flattened over it. */}
          <Text
            variant='caption'
            style={{ marginTop: 4, color: affordable ? undefined : red }}
          >
            {affordable
              ? `Min: $${MIN_AMOUNT}`
              : `More than ${formatMoney(source.balance, source.symbol)} available`}
          </Text>

          <TextInput
            ref={amountInput}
            value={amount}
            onChangeText={setAmount}
            keyboardType='number-pad'
            autoFocus
            // Off-screen: the visible amount above is the real display.
            style={{ position: 'absolute', opacity: 0, width: 1, height: 1 }}
            accessibilityElementsHidden
          />
        </Pressable>

        <Text variant='caption' style={{ marginTop: 24, textAlign: 'center' }}>
          Sent by Multibank
        </Text>

        <View style={{ flex: 1 }} />

        {/* Note */}
        <View
          style={{
            marginHorizontal: GUTTER,
            paddingHorizontal: 12,
            height: 48,
            borderRadius: RADIUS.md,
            backgroundColor: surface,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <HugeiconsIcon
            icon={Note01Icon}
            size={20}
            color={muted}
            strokeWidth={1.5}
          />
          <TextInput
            value={note}
            onChangeText={setNote}
            placeholder='Add note'
            placeholderTextColor={muted}
            selectionColor={primary}
            accessibilityLabel='Add a note'
            style={{
              flex: 1,
              paddingVertical: 0,
              fontSize: 17,
              fontFamily: FONTS.regular,
              color: bodyColor,
            }}
          />
        </View>

        <Button
          disabled={!canContinue}
          onPress={() => router.push('/transfer/review')}
          style={{
            marginTop: 16,
            marginHorizontal: GUTTER,
            borderRadius: RADIUS.md,
          }}
        >
          Continue
        </Button>

        <AvoidKeyboard offset={16} />
      </SafeAreaView>
    </View>
  );
}
