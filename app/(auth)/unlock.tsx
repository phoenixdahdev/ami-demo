import { PinScreen } from '@/components/auth/pin-screen';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { LoadingOverlay } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { useColor } from '@/hooks/use-color';
import { useHaptics } from '@/hooks/use-haptics';
import { greetingFor, useAuthStore } from '@/stores/auth-store';
import * as LocalAuthentication from 'expo-local-authentication';
import { router } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable } from 'react-native';

/**
 * Figma 394:4005 and its five companions. The other five frames are all iOS
 * drawing over this one — the Face ID permission alert (394:4366), the scan
 * (394:4121), success (394:4518) and "Face Not Recognized" (394:4245) are
 * system UI we trigger rather than draw. 394:4060 is the unlocking scrim, which
 * is ours.
 */
export default function UnlockScreen() {
  const profile = useAuthStore((state) => state.profile);
  const isVerifying = useAuthStore((state) => state.isVerifying);
  const unlockWithPin = useAuthStore((state) => state.unlockWithPin);

  const [error, setError] = useState<string | null>(null);
  const [biometricsReady, setBiometricsReady] = useState(false);
  // The prompt is offered once per visit; re-running it on every render would
  // trap the person in a loop of system sheets they can't cancel out of.
  const offered = useRef(false);

  const primary = useColor('primary');
  const bodyColor = useColor('secondaryForeground');
  const feedback = useHaptics();

  const enter = useCallback(() => {
    router.replace('/');
  }, []);

  const promptBiometrics = useCallback(async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Unlock FinTech',
        fallbackLabel: 'Enter PIN',
        // Keep the system's own PIN sheet out of it — this screen is the
        // fallback, and the kit shows "Cancel" returning here.
        disableDeviceFallback: true,
      });

      if (result.success) {
        useAuthStore.getState().signIn();
        feedback('success');
        enter();
      }
    } catch {
      // Face ID being unavailable is not an error worth showing: the PIN pad
      // is right there.
    }
  }, [enter, feedback]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const [hasHardware, isEnrolled] = await Promise.all([
        LocalAuthentication.hasHardwareAsync(),
        LocalAuthentication.isEnrolledAsync(),
      ]).catch(() => [false, false]);

      if (cancelled || !hasHardware || !isEnrolled) return;

      setBiometricsReady(true);

      // What the kit's first frame shows: the app asks as it opens.
      if (!offered.current) {
        offered.current = true;
        promptBiometrics();
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [promptBiometrics]);

  return (
    <>
      <PinScreen
        title='Enter PIN'
        error={error}
        disabled={isVerifying}
        onBiometric={biometricsReady ? promptBiometrics : undefined}
        header={
          <>
            <Avatar size={48}>
              <AvatarImage
                source={require('../../assets/images/user-avatar.webp')}
              />
            </Avatar>
            <Text
              variant='bodySm'
              lightColor={bodyColor}
              style={{ marginTop: 16 }}
            >
              {greetingFor()}, {profile.name}
            </Text>
          </>
        }
        footer={
          <Pressable
            onPress={() => router.replace('/log-in/phone')}
            hitSlop={8}
            accessibilityRole='link'
            accessibilityLabel='Forgot PIN'
            style={({ pressed }) => ({
              alignSelf: 'center',
              opacity: pressed ? 0.5 : 1,
            })}
          >
            <Text variant='bodySm' lightColor={primary}>
              Forgot PIN?
            </Text>
          </Pressable>
        }
        onComplete={async (pin) => {
          setError(null);

          if (await unlockWithPin(pin)) {
            feedback('success');
            enter();
            return true;
          }

          feedback('error');
          setError('Incorrect PIN');
          return false;
        }}
      />

      {/* 394:4060 */}
      <LoadingOverlay visible={isVerifying} backdropOpacity={0.6} />
    </>
  );
}
