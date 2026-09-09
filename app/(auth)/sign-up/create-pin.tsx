import { PinScreen } from '@/components/auth/pin-screen';
import { useAuthStore } from '@/stores/auth-store';
import { router } from 'expo-router';

/** Figma 361:3248. */
export default function CreatePinScreen() {
  const setPin = useAuthStore((state) => state.setPin);

  return (
    <PinScreen
      title='Create PIN'
      onComplete={(pin) => {
        setPin(pin);
        router.push('/sign-up/confirm-pin');
        return true;
      }}
    />
  );
}
