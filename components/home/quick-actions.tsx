import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { useColor } from '@/hooks/use-color';
import { useHaptics } from '@/hooks/use-haptics';
import { RADIUS } from '@/theme/globals';
import ArrowRight01Icon from '@hugeicons-pro/core-stroke-rounded/ArrowRight01Icon';
import MoreHorizontalCircle01Icon from '@hugeicons-pro/core-stroke-rounded/MoreHorizontalCircle01Icon';
import Wallet01Icon from '@hugeicons-pro/core-stroke-rounded/Wallet01Icon';
import { HugeiconsIcon, IconSvgElement } from '@hugeicons/react-native';
import { Pressable } from 'react-native';

/** Figma 41:131 / 271:1178 — 40pt tall, Basic / 200 fill, 8pt corners. */
const HEIGHT = 40;

function Action({
  icon,
  label,
  onPress,
}: {
  icon: IconSvgElement;
  label?: string;
  onPress?: () => void;
}) {
  const fill = useColor('card');
  const iconColor = useColor('text');
  const feedback = useHaptics();

  return (
    <Pressable
      onPress={() => {
        feedback('impact-light');
        onPress?.();
      }}
      accessibilityRole='button'
      accessibilityLabel={label ?? 'More actions'}
      style={({ pressed }) => ({
        flex: label ? 1 : undefined,
        width: label ? undefined : 44,
        height: HEIGHT,
        borderRadius: RADIUS.sm,
        backgroundColor: fill,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: label ? 'flex-start' : 'center',
        paddingHorizontal: label ? 12 : 0,
        gap: 8,
        opacity: pressed ? 0.6 : 1,
      })}
    >
      <HugeiconsIcon
        icon={icon}
        size={24}
        color={iconColor}
        strokeWidth={1.5}
      />
      {label ? <Text variant='action'>{label}</Text> : null}
    </Pressable>
  );
}

export function QuickActions() {
  return (
    <View style={{ flexDirection: 'row', gap: 16, paddingHorizontal: 16 }}>
      <Action icon={Wallet01Icon} label='Add money' />
      <Action icon={ArrowRight01Icon} label='Transfer' />
      <Action icon={MoreHorizontalCircle01Icon} />
    </View>
  );
}
