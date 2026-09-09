import { AuthScreenHeader } from '@/components/auth/screen-header';
import { InputOTP } from '@/components/ui/input-otp';
import { LoadingOverlay } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { formatPhone } from '@/constants/countries';
import { useColor } from '@/hooks/use-color';
import { OTP_LENGTH, useAuthStore } from '@/stores/auth-store';
import { RADIUS } from '@/theme/globals';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/** The kit's countdown starts at 0:59, so a 60 second window. */
const RESEND_SECONDS = 60;

const asClock = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;

/**
 * OTP entry, shared by sign up (356:2589, 461:4443, 356:2488, 373:3756) and
 * log in (498:4569, 498:4580, 498:4591, 498:4611, 498:4625). Identical screens;
 * only where they go on success differs.
 *
 * The slots are masked and reveal the digit just entered, which is what the
 * kit draws — and what iOS does when it autofills the code from Messages.
 */
type Props = { onVerified: () => void };

export function OtpVerifyScreen({ onVerified }: Props) {
  const country = useAuthStore((state) => state.country);
  const phone = useAuthStore((state) => state.phone);
  const otp = useAuthStore((state) => state.otp);
  const setOtp = useAuthStore((state) => state.setOtp);
  const isVerifying = useAuthStore((state) => state.isVerifying);

  const [remaining, setRemaining] = useState(RESEND_SECONDS);
  // Guards against a second submit while the first is still in flight.
  const submitted = useRef(false);

  const muted = useColor('textMuted');
  const bodyColor = useColor('secondaryForeground');
  const primary = useColor('primary');
  const slotFill = useColor('infoSubtle');

  useEffect(() => {
    if (remaining === 0) return;

    const timer = setInterval(
      () => setRemaining((seconds) => Math.max(0, seconds - 1)),
      1000
    );
    return () => clearInterval(timer);
  }, [remaining]);

  const submit = useCallback(async () => {
    if (submitted.current) return;
    submitted.current = true;

    const ok = await useAuthStore.getState().verifyOtp();
    if (ok) onVerified();
    submitted.current = false;
  }, [onVerified]);

  const resend = () => {
    setOtp('');
    setRemaining(RESEND_SECONDS);
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
      <AuthScreenHeader
        title='Verify OTP'
        subtitle={
          <View style={{ flexDirection: 'row', gap: 6 }}>
            <Text variant='bodySm' lightColor={muted}>
              Code is sent to
            </Text>
            <Text variant='bodySm' lightColor={bodyColor}>
              {country.dial} {formatPhone(phone)}
            </Text>
          </View>
        }
      />

      <View style={{ marginTop: 61, paddingHorizontal: 16 }}>
        <InputOTP
          length={OTP_LENGTH}
          value={otp}
          onChangeText={setOtp}
          onComplete={submit}
          autoFocus
          masked
          groupSize={3}
          separator={
            <View
              style={{
                width: 8,
                height: 1,
                backgroundColor: muted,
                marginHorizontal: 2,
              }}
            />
          }
          // Border stays so the slot being typed into picks up the focus ring
          // the kit shows (498:4611); idle slots read as fill-only.
          slotStyle={{
            width: 36,
            height: 44,
            marginHorizontal: 2,
            borderRadius: RADIUS.sm,
            backgroundColor: slotFill,
          }}
        />
      </View>

      <View
        style={{
          marginTop: 48,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <Text variant='bodySm'>Didn’t get the code?</Text>

        {remaining > 0 ? (
          <Text variant='action' lightColor={primary}>
            Resend in {asClock(remaining)}
          </Text>
        ) : (
          <Pressable
            onPress={resend}
            hitSlop={8}
            accessibilityRole='button'
            accessibilityLabel='Resend code'
            style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
          >
            <Text variant='action' lightColor={primary}>
              Resend
            </Text>
          </Pressable>
        )}
      </View>

      {/* The whole screen sits behind a scrim while the code is checked, which
          is also what stops a second submit landing. */}
      <LoadingOverlay visible={isVerifying} backdropOpacity={0.6} />
    </SafeAreaView>
  );
}
