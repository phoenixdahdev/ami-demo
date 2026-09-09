import { PinDots } from '@/components/auth/pin-dots';
import { PinPad } from '@/components/auth/pin-pad';
import { Image } from '@/components/ui/image';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { useColor } from '@/hooks/use-color';
import { PIN_LENGTH } from '@/stores/auth-store';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * The PIN screen shared by Create PIN (361:3248), Confirm PIN (386:3896 /
 * 386:3950) and Enter PIN (394:4005).
 *
 * All three frames put the title at y=242, the dots at 310 and the keypad's
 * first row at 406, whatever sits above — a 110pt globe on the sign-up screens,
 * an avatar and greeting on unlock. So the header gets a fixed 158pt band
 * (84 → 242) and its content aligns to the top of it, which holds the rest of
 * the screen still across all three.
 */
type Props = {
  title: string;
  error?: string | null;
  /** Defaults to the globe the sign-up frames use. */
  header?: React.ReactNode;
  /** Sits between the keypad and the home indicator, e.g. "Forgot PIN?". */
  footer?: React.ReactNode;
  disabled?: boolean;
  onBiometric?: () => void;
  /**
   * Fires once the last digit lands. Return false to clear the entry — that's
   * the mismatch path; returning true leaves the dots filled while the screen
   * navigates away.
   */
  onComplete: (pin: string) => boolean | Promise<boolean>;
};

/** Lets the last dot paint before anything moves. */
const SETTLE_MS = 140;
/** 84 (header top, under the safe area) → 242 (title). */
const HEADER_BAND = 158;

export function PinScreen({
  title,
  error,
  header,
  footer,
  disabled,
  onBiometric,
  onComplete,
}: Props) {
  const [entry, setEntry] = useState('');
  const danger = useColor('red');

  const append = (digit: string) => {
    if (entry.length >= PIN_LENGTH || disabled) return;

    const next = entry + digit;
    setEntry(next);

    if (next.length === PIN_LENGTH) {
      setTimeout(async () => {
        if (!(await onComplete(next))) setEntry('');
      }, SETTLE_MS);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
      <View style={{ height: 40 }} />

      <View style={{ height: HEADER_BAND, alignItems: 'center' }}>
        {header ?? (
          <Image
            source={require('../../assets/images/onboarding-globe.webp')}
            variant='default'
            width={110}
            height={110}
            contentFit='contain'
            showLoadingIndicator={false}
            containerStyle={{ backgroundColor: 'transparent' }}
          />
        )}
      </View>

      <Text variant='subtitle' style={{ textAlign: 'center' }}>
        {title}
      </Text>

      <View style={{ marginTop: 40 }}>
        <PinDots length={PIN_LENGTH} filled={entry.length} error={!!error} />
      </View>

      {/* Always reserved, so the keypad sits identically on every PIN screen
          and nothing shifts when a message appears. */}
      <View style={{ height: 24, marginTop: 8 }}>
        {error ? (
          <Text
            variant='body'
            lightColor={danger}
            style={{ textAlign: 'center' }}
            accessibilityLiveRegion='polite'
          >
            {error}
          </Text>
        ) : null}
      </View>

      <View style={{ flex: 1 }} />

      <PinPad
        onDigit={append}
        onBackspace={() => setEntry((value) => value.slice(0, -1))}
        onBiometric={onBiometric}
        disabled={disabled}
      />

      {/* Same 76pt tail either way, so the keypad doesn't move when a footer
          is present: 40 above the footer, 16 below it. */}
      {footer ? (
        <>
          <View style={{ height: 40 }} />
          {footer}
          <View style={{ height: 16 }} />
        </>
      ) : (
        <View style={{ height: 76 }} />
      )}
    </SafeAreaView>
  );
}
