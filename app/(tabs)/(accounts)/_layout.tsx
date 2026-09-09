import { Stack } from 'expo-router';

/** Screens in this tab draw their own headers. */
export default function AccountsLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
