import { useKeyboardStore } from '@/stores/keyboard-store';

interface UseKeyboardHeightReturn {
  keyboardHeight: number;
  isKeyboardVisible: boolean;
  keyboardAnimationDuration: number;
}

/**
 * Current keyboard metrics, read from the single global subscription in
 * `@/stores/keyboard-store` — mounting ten of these costs one set of listeners,
 * not ten.
 *
 * Each field is selected separately on purpose: zustand compares a selector's
 * result by identity, so returning `{ ...state }` from one selector would
 * re-render on every store write.
 */
export const useKeyboardHeight = (): UseKeyboardHeightReturn => {
  const keyboardHeight = useKeyboardStore((state) => state.keyboardHeight);
  const isKeyboardVisible = useKeyboardStore(
    (state) => state.isKeyboardVisible
  );
  const keyboardAnimationDuration = useKeyboardStore(
    (state) => state.keyboardAnimationDuration
  );

  return { keyboardHeight, isKeyboardVisible, keyboardAnimationDuration };
};
