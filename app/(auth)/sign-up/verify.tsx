import { OtpVerifyScreen } from '@/components/auth/otp-verify-screen';
import { router } from 'expo-router';

/**
 * Figma 356:2589 (counting down), 461:4443 (resend available),
 * 356:2488 (filled) and 373:3756 (verifying).
 */
export default function SignUpVerifyScreen() {
  return <OtpVerifyScreen onVerified={() => router.push('/sign-up/create-pin')} />;
}
