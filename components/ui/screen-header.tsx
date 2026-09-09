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
  /** Sits opposite the back arrow — a scan button, an @tag, and so on. */
  trailing?: React.ReactNode;
  onBack?: () => void;
};

/**
 * The kit's headline block (430:4370/430:4371): the arrow 10pt under the status
 * bar with an optional trailing control opposite it, the title 16pt below, and
 * a subtitle 8pt under that.
 */
export function ScreenHeader({ title, subtitle, trailing, onBack }: Props) {
  const text = useColor('text');

  return (
    <View style={{ paddingHorizontal: 16 }}>
      <View
        style={{
          marginTop: 10,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
      <Pressable
        onPress={onBack ?? (() => router.back())}
        accessibilityRole='button'
        accessibilityLabel='Go back'
        hitSlop={12}
        style={({ pressed }) => ({
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
        {trailing}
      </View>

      <Text variant='title' style={{ marginTop: 16 }}>
        {title}
      </Text>

      {subtitle ? <View style={{ marginTop: 8 }}>{subtitle}</View> : null}
    </View>
  );
}
