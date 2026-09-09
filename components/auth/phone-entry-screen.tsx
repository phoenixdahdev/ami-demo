import { AuthScreenHeader } from '@/components/auth/screen-header';
import { AvoidKeyboard } from '@/components/ui/avoid-keyboard';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { formatPhone } from '@/constants/countries';
import { useColor } from '@/hooks/use-color';
import { selectCanSubmitPhone, useAuthStore } from '@/stores/auth-store';
import { FONTS } from '@/theme/fonts';
import { RADIUS } from '@/theme/globals';
import ArrowDown01Icon from '@hugeicons-pro/core-stroke-rounded/ArrowDown01Icon';
import CancelCircleIcon from '@hugeicons-pro/core-solid-rounded/CancelCircleIcon';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { Link, router } from 'expo-router';
import { Pressable, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * Phone entry, shared by sign up (349:2383 / 367:3307) and log in
 * (332:2100 / 344:2244). The frames are the same screen down to the pixel —
 * only the title, the cross-link, the button label and the terms line differ.
 */
type Props = {
  title: string;
  /** e.g. "If you have an account" */
  altPrompt: string;
  /** e.g. "Log in" */
  altLabel: string;
  onAltPress: () => void;
  submitLabel: string;
  onSubmit: () => void;
  /** Sign up shows the terms line; log in does not. */
  showTerms?: boolean;
};

export function PhoneEntryScreen({
  title,
  altPrompt,
  altLabel,
  onAltPress,
  submitLabel,
  onSubmit,
  showTerms = false,
}: Props) {
  const country = useAuthStore((state) => state.country);
  const phone = useAuthStore((state) => state.phone);
  const setPhone = useAuthStore((state) => state.setPhone);
  const canSubmit = useAuthStore(selectCanSubmitPhone);

  const muted = useColor('textMuted');
  const bodyColor = useColor('secondaryForeground');
  const primary = useColor('primary');

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
      <AuthScreenHeader
        title={title}
        subtitle={
          <Text variant='bodySm' lightColor={muted}>
            Insert your phone number to continue
          </Text>
        }
      />

      <View style={{ paddingHorizontal: 16 }}>
        {/* Country + number over a single rule — the kit's whole input. */}
        <View
          style={{
            marginTop: 48,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <Pressable
            onPress={() => router.push('/country-code')}
            accessibilityRole='button'
            accessibilityLabel={`Country code ${country.dial}. Change country`}
            hitSlop={8}
            style={({ pressed }) => ({
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              opacity: pressed ? 0.5 : 1,
            })}
          >
            <Text variant='display'>{country.flag}</Text>
            <HugeiconsIcon
              icon={ArrowDown01Icon}
              size={20}
              color={bodyColor}
              strokeWidth={1.5}
            />
          </Pressable>

          <Text variant='field' lightColor={muted} style={{ marginLeft: 10 }}>
            {country.dial}
          </Text>

          <TextInput
            value={formatPhone(phone)}
            onChangeText={setPhone}
            keyboardType='phone-pad'
            textContentType='telephoneNumber'
            autoFocus
            selectionColor={primary}
            accessibilityLabel='Phone number'
            style={{
              flex: 1,
              marginLeft: 10,
              paddingVertical: 0,
              // A raw TextInput can't take a Text variant, so the kit's
              // Subtitle / S1 - M lands here directly.
              fontSize: 16,
              lineHeight: 24,
              fontFamily: FONTS.medium,
              color: bodyColor,
            }}
          />

          {phone.length > 0 ? (
            <Pressable
              onPress={() => setPhone('')}
              accessibilityRole='button'
              accessibilityLabel='Clear phone number'
              hitSlop={8}
              style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
            >
              <HugeiconsIcon
                icon={CancelCircleIcon}
                size={20}
                color={muted}
                strokeWidth={1.5}
              />
            </Pressable>
          ) : null}
        </View>

        <View style={{ height: 1, backgroundColor: muted, marginTop: 16 }} />

        <View
          style={{
            marginTop: 48,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <Text variant='bodySm'>{altPrompt}</Text>
          <Pressable
            onPress={onAltPress}
            hitSlop={8}
            accessibilityRole='link'
            accessibilityLabel={altLabel}
            style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
          >
            <Text variant='action' lightColor={primary}>
              {altLabel}
            </Text>
          </Pressable>
        </View>
      </View>

      <View style={{ flex: 1 }} />

      <View style={{ paddingHorizontal: 16, alignItems: 'center' }}>
        {showTerms ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text variant='micro' lightColor={bodyColor}>
              By signing up, you accept our
            </Text>
            <Link href='/sign-up/terms' asChild>
              <Pressable hitSlop={8}>
                <Text variant='micro' lightColor={primary}>
                  Terms & Conditions
                </Text>
              </Pressable>
            </Link>
          </View>
        ) : null}

        <Button
          disabled={!canSubmit}
          onPress={onSubmit}
          style={{
            marginTop: showTerms ? 16 : 0,
            width: '100%',
            borderRadius: RADIUS.md,
          }}
        >
          {submitLabel}
        </Button>
      </View>

      <AvoidKeyboard offset={16} />
    </SafeAreaView>
  );
}
