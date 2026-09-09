import { useColorScheme } from "@/hooks/use-color-scheme";
import { ThemeProvider } from "@/providers/theme-provider";
import { Colors } from "@/theme/colors";
import { FONT_ASSETS } from "@/theme/fonts";
import { osName } from "expo-device";
import { useFonts } from "expo-font";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import * as NavigationBar from "expo-navigation-bar";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { setBackgroundColorAsync } from "expo-system-ui";
import { useEffect } from "react";
import { Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";

SplashScreen.setOptions({
  duration: 200,
  fade: true,
});

// Hold the splash screen until Google Sans Flex is registered, so the first
// frame is already in the right typeface rather than reflowing out of the
// system font. Rejects only if the splash has already gone; nothing to do then.
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts(FONT_ASSETS);

  useEffect(() => {
    // A font that fails to load is not worth a blank app — fall through to the
    // system face rather than sitting on the splash forever.
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
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
 * Split out to keep `RootLayout` to the mount tree. `useColorScheme()` reads
 * the mode store rather than context, so this no longer has to sit inside
 * `ThemeProvider` to see the user's choice — it only has to re-render when the
 * scheme changes, which the store subscription takes care of.
 */
function RootNavigator() {
  const colorScheme = useColorScheme() || "light";

  useEffect(() => {
    if (Platform.OS === "android") {
      NavigationBar.setStyle(colorScheme === "light" ? "dark" : "light");
    }
  }, [colorScheme]);

  useEffect(() => {
    setBackgroundColorAsync(
      colorScheme === "dark" ? Colors.dark.background : Colors.light.background,
    );
  }, [colorScheme]);

  return (
    <>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} animated />

      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="transfer" options={{ headerShown: false }} />
        <Stack.Screen name="loan-apply" options={{ headerShown: false }} />
        <Stack.Screen
          name="choose-source"
          options={{
            headerShown: false,
            presentation: "formSheet",
            sheetGrabberVisible: false,
            sheetAllowedDetents: [0.9],
          }}
        />

        <Stack.Screen
          name="sheet"
          options={{
            headerShown: false,
            sheetGrabberVisible: true,
            sheetAllowedDetents: [0.4, 0.7, 1],
            contentStyle: {
              backgroundColor: isLiquidGlassAvailable()
                ? "transparent"
                : colorScheme === "dark"
                  ? Colors.dark.card
                  : Colors.light.card,
            },
            headerTransparent: Platform.OS === "ios" ? true : false,
            headerLargeTitle: false,
            title: "",
            presentation:
              Platform.OS === "ios"
                ? isLiquidGlassAvailable() && osName !== "iPadOS"
                  ? "formSheet"
                  : "modal"
                : "modal",
            sheetInitialDetentIndex: 0,
            headerStyle: {
              backgroundColor:
                Platform.OS === "ios"
                  ? "transparent"
                  : colorScheme === "dark"
                    ? Colors.dark.card
                    : Colors.light.card,
            },
            headerBlurEffect: isLiquidGlassAvailable()
              ? undefined
              : colorScheme === "dark"
                ? "dark"
                : "light",
          }}
        />
        <Stack.Screen name="+not-found" />
      </Stack>
    </>
  );
}
