import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { useColor } from '@/hooks/use-color';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * Stands in for a tab whose design hasn't landed yet, rather than shipping an
 * empty screen that looks broken.
 */
export function SectionPlaceholder({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  const canvas = useColor('canvas');
  const muted = useColor('textMuted');

  return (
    <View style={{ flex: 1, backgroundColor: canvas }}>
      <SafeAreaView
        edges={['top']}
        style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 }}
      >
        <Text variant='screenTitle' style={{ textAlign: 'center' }}>
          {title}
        </Text>
        <Text
          variant='bodySm'
          lightColor={muted}
          style={{ textAlign: 'center', marginTop: 8 }}
        >
          {description}
        </Text>
      </SafeAreaView>
    </View>
  );
}
