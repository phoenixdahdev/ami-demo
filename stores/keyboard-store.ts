import {
  Dimensions,
  Keyboard,
  Platform,
  type KeyboardEvent,
} from 'react-native';
import { create } from 'zustand';

type KeyboardState = {
  keyboardHeight: number;
  isKeyboardVisible: boolean;
  keyboardAnimationDuration: number;
};

/**
 * There is only ever one keyboard, so its metrics are one store with one set of
 * listeners — attached below when this module is first imported — rather than a
 * fresh subscription per mounted consumer.
 *
 * Written to imperatively via `setState`; nothing but the listeners should.
 */
export const useKeyboardStore = create<KeyboardState>(() => ({
  keyboardHeight: 0,
  isKeyboardVisible: false,
  keyboardAnimationDuration: 0,
}));

// Kept across events so a rotation can fall back to the last real height.
let previousHeight = 0;

// iOS reports before the animation runs, which is what lets content move in
// step with the keyboard; Android only reports after it has finished.
const showEvent =
  Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
const hideEvent =
  Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

Keyboard.addListener(showEvent, (event: KeyboardEvent) => {
  const { height } = event.endCoordinates;

  // Heights of 0 do show up, and acting on one collapses the layout mid-show.
  if (!height || height <= 0) return;

  previousHeight = height;
  useKeyboardStore.setState({
    keyboardHeight: height,
    isKeyboardVisible: true,
    keyboardAnimationDuration: event.duration || 250,
  });
});

Keyboard.addListener(hideEvent, (event: KeyboardEvent) => {
  useKeyboardStore.setState({
    keyboardHeight: 0,
    isKeyboardVisible: false,
    // iOS provides a duration, Android often does not.
    keyboardAnimationDuration:
      event.duration || (Platform.OS === 'ios' ? 250 : 200),
  });
});

// Rotation and split screen change the keyboard's height under us. iOS in
// landscape is the case worth correcting: its keyboard is much shorter than the
// portrait one we measured.
Dimensions.addEventListener('change', () => {
  if (!useKeyboardStore.getState().isKeyboardVisible) return;
  if (previousHeight <= 0) return;

  const { height, width } = Dimensions.get('window');
  if (Platform.OS === 'ios' && width > height) {
    useKeyboardStore.setState({
      keyboardHeight: Math.min(previousHeight, height * 0.4),
    });
  }
});
