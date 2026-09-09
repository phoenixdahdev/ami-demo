import { PinScreen } from '@/components/auth/pin-screen';
import { useHaptics } from '@/hooks/use-haptics';
import { startSimulation } from '@/lib/simulation';
import { useAuthStore } from '@/stores/auth-store';
import { router } from 'expo-router';
import { useState } from 'react';

/** Figma 386:3896, and 386:3950 for the mismatch. */
export default function ConfirmPinScreen() {
  const confirmPin = useAuthStore((state) => state.confirmPin);
  const feedback = useHaptics();

  const [error, setError] = useState<string | null>(null);

  return (
    <PinScreen
      title='Confirm PIN'
      error={error}
      onComplete={(pin) => {
        if (confirmPin(pin)) {
          feedback('success');
          // End of sign up, and the start of everything else: this opens the
          // accounts and writes the first balances to the phone.
          startSimulation();
          router.replace('/');
          return true;
        }

        feedback('error');
        setError('Incorrect PIN');
        return false;
      }}
    />
  );
}
