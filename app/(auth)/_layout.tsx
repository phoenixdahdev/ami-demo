import { Stack } from 'expo-router';

/**
 * The auth flow (onboarding, sign up, log in): full-bleed brand screens with
 * no navigator chrome, each drawing its own back arrow.
 *
 * Two screens are presented rather than pushed — the country picker is a sheet
 * in the kit (356:2714) and is shared by both flows, and the terms are a modal
 * reached from the sign-up phone step.
 */
export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name='onboarding' />
      <Stack.Screen name='unlock' />
      <Stack.Screen name='sign-up/phone' />
      <Stack.Screen name='sign-up/verify' />
      <Stack.Screen name='sign-up/create-pin' />
      <Stack.Screen name='sign-up/confirm-pin' />
      <Stack.Screen name='log-in/phone' />
      <Stack.Screen name='log-in/verify' />

      <Stack.Screen
        name='sign-up/terms'
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen
        name='country-code'
        options={{
          presentation: 'formSheet',
          sheetGrabberVisible: true,
          sheetAllowedDetents: [0.95],
        }}
      />
    </Stack>
  );
}
