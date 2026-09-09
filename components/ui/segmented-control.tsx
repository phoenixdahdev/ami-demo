import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { useColor } from '@/hooks/use-color';
import { useHaptics } from '@/hooks/use-haptics';
import { Pressable } from 'react-native';

/**
 * An iOS segmented control, following Figma 661:7740 — a track at
 * rgba(118,118,128,0.12) with 8pt corners, 2pt of padding, and a white thumb
 * carrying a hairline border.
 *
 * The frame's track is 32pt, sized for its 14pt labels. Ours are 17pt, which
 * would push the thumb taller than the track it sits in, so the track is 40.
 *
 * Not the kit's `Tabs`: that one is a pill-shaped, swipeable tab bar with its
 * own content carousel. This is a filter control.
 */
const TRACK_HEIGHT = 40;
const TRACK_FILL = 'rgba(118, 118, 128, 0.12)';
const THUMB_BORDER = 'rgba(0, 0, 0, 0.04)';
const SEPARATOR = 'rgba(60, 60, 67, 0.36)';

export type SegmentedOption<T extends string> = {
  value: T;
  label: string;
};

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
}) {
  const ink = useColor('secondaryForeground');
  const thumb = useColor('background');
  const feedback = useHaptics();

  const selectedIndex = options.findIndex((option) => option.value === value);

  return (
    <View
      accessibilityRole='tablist'
      style={{
        height: TRACK_HEIGHT,
        borderRadius: 8,
        backgroundColor: TRACK_FILL,
        flexDirection: 'row',
        padding: 2,
      }}
    >
      {options.map((option, index) => {
        const isSelected = index === selectedIndex;
        // iOS draws a hairline between two neighbours only when neither of
        // them is the selected segment.
        const showSeparator =
          index < options.length - 1 &&
          index !== selectedIndex &&
          index + 1 !== selectedIndex;

        return (
          <Pressable
            key={option.value}
            onPress={() => {
              if (isSelected) return;
              feedback('selection');
              onChange(option.value);
            }}
            accessibilityRole='tab'
            accessibilityState={{ selected: isSelected }}
            accessibilityLabel={option.label}
            style={{
              flex: 1,
              borderRadius: 6,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: isSelected ? thumb : 'transparent',
              borderWidth: isSelected ? 0.5 : 0,
              borderColor: THUMB_BORDER,
            }}
          >
            <Text variant='body' lightColor={ink} numberOfLines={1}>
              {option.label}
            </Text>

            {showSeparator ? (
              <View
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '21%',
                  bottom: '21%',
                  width: 0.5,
                  backgroundColor: SEPARATOR,
                }}
              />
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );
}
