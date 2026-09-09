import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { TodoItem } from '@/constants/home-data';
import { useColor } from '@/hooks/use-color';
import { useHaptics } from '@/hooks/use-haptics';
import CancelCircleIcon from '@hugeicons-pro/core-solid-rounded/CancelCircleIcon';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { Image } from 'expo-image';
import { Pressable } from 'react-native';

/** Figma 271:1218 — white pill, 40pt avatar, dismiss on the right. */
export function TodoChip({
  item,
  onDismiss,
}: {
  item: TodoItem;
  onDismiss: () => void;
}) {
  const surface = useColor('background');
  const muted = useColor('textMuted');
  const feedback = useHaptics();

  return (
    <View
      style={{
        backgroundColor: surface,
        borderRadius: 24,
        paddingLeft: 4,
        paddingRight: 12,
        paddingVertical: 4,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
      }}
    >
      <Image
        source={item.avatar}
        style={{ width: 40, height: 40, borderRadius: 20 }}
        contentFit='cover'
      />

      <Text variant='micro' style={{ width: 80 }}>
        {item.label}
      </Text>

      <Pressable
        onPress={() => {
          feedback('impact-light');
          onDismiss();
        }}
        hitSlop={8}
        accessibilityRole='button'
        accessibilityLabel={`Dismiss: ${item.label}`}
        style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
      >
        <HugeiconsIcon icon={CancelCircleIcon} size={20} color={muted} />
      </Pressable>
    </View>
  );
}
