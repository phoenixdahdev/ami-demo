import { useColorScheme } from '@/hooks/use-color-scheme';
import { useHydrated } from '@/hooks/use-hydrated';
import { ThemeProvider } from '@/providers/theme-provider';
import { useAuthStore } from '@/stores/auth-store';
import { Colors } from '@/theme/colors';
import { FONT_ASSETS } from '@/theme/fonts';
import { useFonts } from 'expo-font';
import * as NavigationBar from 'expo-navigation-bar';
import { router, Stack, useRootNavigationState, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { setBackgroundColorAsync } from 'expo-system-ui';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

SplashScreen.setOptions({
  duration: 200,
  fade: true,
});

// Hold the splash screen until Google Sans Flex is registered and the stores
// have read the phone, so the first frame is already in the right typeface and
// already at the right screen. Rejects only if the splash has already gone;
// nothing to do then.
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts(FONT_ASSETS);
  const hydrated = useHydrated();

  // A font that fails to load is not worth a blank app — fall through to the
  // system face rather than sitting on the splash forever.
  const ready = (fontsLoaded || fontError) && hydrated;

  if (!ready) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <RootNavigator />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

/**
 * Sends each launch to the screen that matches the session, and only then lets
 * go of the splash.
 *
 * Three states, and the app has to tell them apart before anything renders:
 * nobody has signed up here, someone has but the app is locked, or the session
 * is open. The check runs on every navigation as well as on boot, so a sign-out
 * from deep inside the app lands back on onboarding without the screen it came
 * from having to know where that is.
 */
function useSessionRoute() {
  const segments = useSegments();
  const navigationState = useRootNavigationState();

  const isSignedIn = useAuthStore((state) => state.isSignedIn);
  const isUnlocked = useAuthStore((state) => state.isUnlocked);
  // A primitive, so this doesn't re-render on every keystroke into the PIN pad.
  const hasPin = useAuthStore((state) => state.pin.length > 0);

  useEffect(() => {
    // `router` throws if the navigator hasn't mounted yet.
    if (!navigationState?.key) return;

    const inAuth = segments[0] === '(auth)';

    if (!isSignedIn) {
      if (!inAuth) router.replace('/onboarding');
    } else if (!isUnlocked) {
      // Somewhere inside the auth flow is already the right place to be —
      // "Forgot PIN" leads there, and bouncing it back to the lock screen
      // would make that link do nothing.
      if (!inAuth) router.replace(hasPin ? '/unlock' : '/log-in/phone');
    } else if (inAuth) {
      router.replace('/');
    }

    // Only now: the redirect above is queued, so the splash never lifts on a
    // screen the session is about to leave.
    SplashScreen.hideAsync().catch(() => {});
  }, [hasPin, isSignedIn, isUnlocked, navigationState?.key, segments]);
}

/**
 * Split out to keep `RootLayout` to the mount tree. `useColorScheme()` reads
 * the mode store rather than context, so this no longer has to sit inside
 * `ThemeProvider` to see the user's choice — it only has to re-render when the
 * scheme changes, which the store subscription takes care of.
 */
function RootNavigator() {
  const colorScheme = useColorScheme() || 'light';

  useSessionRoute();

  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setStyle(colorScheme === 'light' ? 'dark' : 'light');
    }
  }, [colorScheme]);

  useEffect(() => {
    setBackgroundColorAsync(
      colorScheme === 'dark' ? Colors.dark.background : Colors.light.background
    );
  }, [colorScheme]);

  return (
    <>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} animated />

      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
        <Stack.Screen name='(auth)' options={{ headerShown: false }} />
        <Stack.Screen name='transfer' options={{ headerShown: false }} />
        <Stack.Screen name='loan-apply' options={{ headerShown: false }} />
        <Stack.Screen
          name='choose-source'
          options={{
            headerShown: false,
            presentation: 'formSheet',
            sheetGrabberVisible: false,
            sheetAllowedDetents: [0.9],
          }}
        />
        <Stack.Screen
          name='profile'
          options={{
            headerShown: false,
            presentation: 'formSheet',
            sheetGrabberVisible: true,
            sheetAllowedDetents: [0.5],
          }}
        />

        <Stack.Screen name='+not-found' />
      </Stack>
    </>
  );
}
