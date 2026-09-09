import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { useColor } from '@/hooks/use-color';

/** "Step 2 of 3" plus a bar, so the flow says how long it is. */
export function StepProgress({ step, total }: { step: number; total: number }) {
  const track = useColor('secondary');
  const fill = useColor('primary');

  return (
    <View style={{ gap: 8 }}>
      <Text variant='caption'>
        Step {step} of {total}
      </Text>
      <View
        accessibilityRole='progressbar'
        accessibilityValue={{ min: 0, max: total, now: step }}
        style={{
          height: 4,
          borderRadius: 2,
          backgroundColor: track,
          overflow: 'hidden',
        }}
      >
        <View
          style={{
            width: `${(step / total) * 100}%`,
            height: '100%',
            backgroundColor: fill,
          }}
        />
      </View>
    </View>
  );
}
