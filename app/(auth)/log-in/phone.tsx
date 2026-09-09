import { PhoneEntryScreen } from '@/components/auth/phone-entry-screen';
import { router } from 'expo-router';

/** Figma 332:2100 (empty) and 344:2244 (filled). */
export default function LogInPhoneScreen() {
  return (
    <PhoneEntryScreen
      title='Welcome back'
      altPrompt='If you have no account'
      altLabel='Sign up'
      onAltPress={() => router.replace('/sign-up/phone')}
      submitLabel='Log in'
      onSubmit={() => router.push('/log-in/verify')}
    />
  );
}
