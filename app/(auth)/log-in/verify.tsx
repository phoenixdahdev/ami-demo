import { OtpVerifyScreen } from '@/components/auth/otp-verify-screen';
import { useAuthStore } from '@/stores/auth-store';
import { router } from 'expo-router';

/**
 * Figma 498:4569 (counting down), 498:4580 (resend available), 498:4591
 * (filled), 498:4611 (autofilled from Messages) and 498:4625 (verifying).
 *
 * Logging in has no PIN step — a verified code ends the flow.
 */
export default function LogInVerifyScreen() {
  const signIn = useAuthStore((state) => state.signIn);

  return (
    <OtpVerifyScreen
      onVerified={() => {
        signIn();
        router.replace('/');
      }}
    />
  );
}
