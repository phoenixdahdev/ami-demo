import { View } from '@/components/ui/view';
import { useColor } from '@/hooks/use-color';

/** Figma: four 16pt dots across 136pt, so 24pt apart. */
const DOT = 16;
const GAP = 24;

type Props = {
  length: number;
  filled: number;
  /** Paints the filled dots red for the "Incorrect PIN" state. */
  error?: boolean;
};

export function PinDots({ length, filled, error }: Props) {
  const idle = useColor('outline');
  const active = useColor('primary');
  const danger = useColor('red');

  return (
    <View
      accessibilityRole='progressbar'
      accessibilityLabel={`${filled} of ${length} digits entered`}
      style={{ flexDirection: 'row', gap: GAP, justifyContent: 'center' }}
    >
      {Array.from({ length }, (_, index) => {
        const isFilled = index < filled;

        return (
          <View
            key={index}
            style={{
              width: DOT,
              height: DOT,
              borderRadius: DOT / 2,
              backgroundColor: isFilled
                ? error
                  ? danger
                  : active
                : 'transparent',
              borderWidth: isFilled ? 0 : 1.5,
              borderColor: idle,
            }}
          />
        );
      })}
    </View>
  );
}
