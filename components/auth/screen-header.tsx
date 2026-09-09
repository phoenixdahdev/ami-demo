import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { useColor } from '@/hooks/use-color';
import ArrowLeft01Icon from '@hugeicons-pro/core-stroke-rounded/ArrowLeft01Icon';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { router } from 'expo-router';
import { Pressable } from 'react-native';

type Props = {
  title: string;
  /** A node rather than a string: the OTP screen colours the number inline. */
  subtitle?: React.ReactNode;
  onBack?: () => void;
};

/**
 * Back arrow, title and subtitle, positioned as every auth frame in the kit
 * does it: arrow 10pt under the status bar, title 16pt below that, subtitle 8pt
 * below the title.
 */
export function AuthScreenHeader({ title, subtitle, onBack }: Props) {
  const text = useColor('text');

  return (
    <View style={{ paddingHorizontal: 16 }}>
      <Pressable
        onPress={onBack ?? (() => router.back())}
        accessibilityRole='button'
        accessibilityLabel='Go back'
        hitSlop={12}
        style={({ pressed }) => ({
          marginTop: 10,
          width: 24,
          height: 24,
          opacity: pressed ? 0.5 : 1,
        })}
      >
        <HugeiconsIcon
          icon={ArrowLeft01Icon}
          size={24}
          color={text}
          strokeWidth={1.5}
        />
      </Pressable>

      <Text variant='screenTitle' style={{ marginTop: 16 }}>
        {title}
      </Text>

      {subtitle ? <View style={{ marginTop: 8 }}>{subtitle}</View> : null}
    </View>
  );
}
