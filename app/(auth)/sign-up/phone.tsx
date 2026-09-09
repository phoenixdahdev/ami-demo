import { PhoneEntryScreen } from '@/components/auth/phone-entry-screen';
import { router } from 'expo-router';

/** Figma 349:2383 (empty) and 367:3307 (filled). */
export default function SignUpPhoneScreen() {
  return (
    <PhoneEntryScreen
      title='Welcome to FinTech'
      altPrompt='If you have an account'
      altLabel='Log in'
      onAltPress={() => router.replace('/log-in/phone')}
      submitLabel='Sign up'
      onSubmit={() => router.push('/sign-up/verify')}
      showTerms
    />
  );
}
