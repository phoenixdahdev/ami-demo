import { OtpVerifyScreen } from '@/components/auth/otp-verify-screen';
import { resumeSimulation } from '@/lib/simulation';
import { router } from 'expo-router';

/**
 * Figma 498:4569 (counting down), 498:4580 (resend available), 498:4591
 * (filled), 498:4611 (autofilled from Messages) and 498:4625 (verifying).
 *
 * Logging in has no PIN step — a verified code ends the flow.
 */
export default function LogInVerifyScreen() {
  return (
    <OtpVerifyScreen
      onVerified={() => {
        // Opens the session, and opens the accounts if this device has never
        // had any — someone can arrive here without signing up first.
        resumeSimulation();
        router.replace('/');
      }}
    />
  );
}
