import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { useColor } from '@/hooks/use-color';
import { useHaptics } from '@/hooks/use-haptics';
import { RADIUS } from '@/theme/globals';
import ArrowRight01Icon from '@hugeicons-pro/core-stroke-rounded/ArrowRight01Icon';
import MoreHorizontalCircle01Icon from '@hugeicons-pro/core-stroke-rounded/MoreHorizontalCircle01Icon';
import Wallet01Icon from '@hugeicons-pro/core-stroke-rounded/Wallet01Icon';
import { HugeiconsIcon, IconSvgElement } from '@hugeicons/react-native';
import { router } from 'expo-router';
import { Pressable } from 'react-native';

/** Figma 41:131 / 271:1178 — 40pt tall, Basic / 200 fill, 8pt corners. */
const HEIGHT = 40;

export type ActionTone = 'neutral' | 'brand';

export type QuickAction = {
  icon: IconSvgElement;
  /** Omit for a trailing "more" button, which sizes to its icon. */
  label?: string;
  onPress?: () => void;
};

/** What the Cards frame draws. */
export const DEFAULT_ACTIONS: QuickAction[] = [
  { icon: Wallet01Icon, label: 'Add money' },
  {
    icon: ArrowRight01Icon,
    label: 'Transfer',
    onPress: () => router.push('/transfer'),
  },
  { icon: MoreHorizontalCircle01Icon },
];

function Action({ action, tone }: { action: QuickAction; tone: ActionTone }) {
  const neutralFill = useColor('card');
  const neutralInk = useColor('text');
  const brandFill = useColor('brandSubtle');
  const brandInk = useColor('primary');
  const feedback = useHaptics();

  const isBrand = tone === 'brand';
  const fill = isBrand ? brandFill : neutralFill;
  const ink = isBrand ? brandInk : neutralInk;
  const { icon, label, onPress } = action;

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
        // Brand pills centre their contents; the kit's grey ones sit icon-left.
        justifyContent: !label || isBrand ? 'center' : 'flex-start',
        paddingHorizontal: label ? 10 : 0,
        gap: 6,
        opacity: pressed ? 0.6 : 1,
      })}
    >
      <HugeiconsIcon
        icon={icon}
        size={isBrand ? 20 : 24}
        color={ink}
        strokeWidth={isBrand ? 2 : 1.5}
      />
      {label ? (
        <Text variant='body' lightColor={ink} numberOfLines={1}>
          {label}
        </Text>
      ) : null}
    </Pressable>
  );
}

/**
 * The row of account actions.
 *
 * `neutral` is the kit's grey-on-white treatment, which the Cards frame draws.
 * `brand` is the tinted-blue pill from the reference the Accounts balance panel
 * follows.
 */
export function QuickActions({
  actions = DEFAULT_ACTIONS,
  tone = 'neutral',
  gutter = 16,
}: {
  actions?: QuickAction[];
  tone?: ActionTone;
  gutter?: number;
}) {
  return (
    <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: gutter }}>
      {actions.map((action, index) => (
        <Action
          key={action.label ?? `more-${index}`}
          action={action}
          tone={tone}
        />
      ))}
    </View>
  );
}
