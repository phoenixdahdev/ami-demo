import { Stack } from 'expo-router';

/** The home screen draws its own header, so the navigator supplies none. */
export default function CardsLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
