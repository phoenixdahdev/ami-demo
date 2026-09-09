import { useColor } from '@/hooks/use-color';
import { Stack } from 'expo-router';

/**
 * The transfer flow: hub -> amount -> review -> confirmation. Presented over
 * the tabs so it owns the screen, with the confirmation as a small sheet the
 * way the kit draws it (563:5693).
 */
export default function TransferLayout() {
  const surface = useColor('background');

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name='index' />
      <Stack.Screen name='send' />
      <Stack.Screen name='review' />
      <Stack.Screen
        name='done'
        options={{
          presentation: 'formSheet',
          contentStyle: { backgroundColor: surface },
          sheetGrabberVisible: false,
          sheetAllowedDetents: [0.3],
          gestureEnabled: false,
        }}
      />
    </Stack>
  );
}
