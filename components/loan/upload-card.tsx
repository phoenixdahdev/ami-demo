import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { useColor } from '@/hooks/use-color';
import { useHaptics } from '@/hooks/use-haptics';
import { UploadedDocument } from '@/stores/loan-store';
import { RADIUS } from '@/theme/globals';
import CheckmarkCircle02Icon from '@hugeicons-pro/core-solid-rounded/CheckmarkCircle02Icon';
import { HugeiconsIcon, IconSvgElement } from '@hugeicons/react-native';
import { Pressable } from 'react-native';

/**
 * A document slot: empty it invites a pick, filled it shows what was attached
 * and offers to replace it.
 */
export function UploadCard({
  icon,
  title,
  description,
  document,
  onPress,
}: {
  icon: IconSvgElement;
  title: string;
  description: string;
  document: UploadedDocument | null;
  onPress: () => void;
}) {
  const surface = useColor('background');
  const border = useColor('border');
  const primary = useColor('primary');
  const green = useColor('green');
  const bodyColor = useColor('secondaryForeground');
  const feedback = useHaptics();

  const filled = !!document;

  return (
    <Pressable
      onPress={() => {
        feedback('impact-light');
        onPress();
      }}
      accessibilityRole='button'
      accessibilityLabel={
        filled
          ? `${title} attached: ${document.name}. Replace`
          : `Attach ${title}`
      }
      style={({ pressed }) => ({
        padding: 20,
        borderRadius: RADIUS.lg,
        backgroundColor: surface,
        borderWidth: filled ? 0 : 1,
        borderStyle: filled ? 'solid' : 'dashed',
        borderColor: border,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        opacity: pressed ? 0.6 : 1,
      })}
    >
      <HugeiconsIcon
        icon={filled ? CheckmarkCircle02Icon : icon}
        size={28}
        color={filled ? green : primary}
        strokeWidth={1.5}
      />

      <View style={{ flex: 1 }}>
        <Text variant='body' lightColor={bodyColor}>
          {title}
        </Text>
        <Text variant='caption' numberOfLines={1}>
          {filled ? document.name : description}
        </Text>
      </View>

      <Text variant='body' lightColor={primary}>
        {filled ? 'Change' : 'Add'}
      </Text>
    </Pressable>
  );
}
