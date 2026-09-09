import { Text } from '@/components/ui/text';
import { useColor } from '@/hooks/use-color';
import { useHaptics } from '@/hooks/use-haptics';
import { CORNERS, FONT_SIZE } from '@/theme/globals';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {
  Keyboard,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  TextInput,
  TextInputKeyPressEventData,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

export interface InputOTPProps extends Omit<
  TextInputProps,
  'style' | 'value' | 'onChangeText'
> {
  /** Number of OTP digits */
  length?: number;
  /** Current OTP value */
  value?: string;
  /** Called when OTP value changes */
  onChangeText?: (value: string) => void;
  /** Called when OTP is complete */
  onComplete?: (value: string) => void;
  /** Error message to display */
  error?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Container style */
  containerStyle?: ViewStyle;
  /** Individual slot style */
  slotStyle?: ViewStyle;
  /** Error style */
  errorStyle?: TextStyle;
  /** Whether to mask the input (show dots instead of numbers) */
  masked?: boolean;
  /**
   * While masked, how long the digit just typed stays legible before it turns
   * into a dot. 0 masks immediately. Ignored when `masked` is false.
   */
  revealMs?: number;
  /** Separator component between slots */
  separator?: React.ReactNode;
  /**
   * Render `separator` only after every Nth slot rather than between all of
   * them — a 6-digit code drawn as 3 + 3 uses `groupSize={3}`.
   */
  groupSize?: number;
  /** Whether to show cursor in active slot */
  showCursor?: boolean;
  /** Whether to trigger haptic feedback when the code is complete */
  haptic?: boolean;
}

export interface InputOTPRef {
  focus: () => void;
  blur: () => void;
  clear: () => void;
  getValue: () => string;
}

export const InputOTP = forwardRef<InputOTPRef, InputOTPProps>(
  (
    {
      length = 6,
      value = '',
      onChangeText,
      onComplete,
      error,
      disabled = false,
      containerStyle,
      slotStyle,
      errorStyle,
      masked = false,
      revealMs = 800,
      separator,
      groupSize,
      showCursor = true,
      haptic = true,
      onFocus,
      onBlur,
      ...textInputProps
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    // The one masked slot still showing its digit, as iOS does when a code is
    // typed or autofilled. -1 once it has settled back to a dot.
    const [revealedIndex, setRevealedIndex] = useState(-1);
    const revealTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    // Length at the previous keystroke, so deleting doesn't flash the digit
    // before the one just removed.
    const previousLength = useRef(0);
    const inputRef = useRef<TextInput>(null);
    const refocusTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    // Android dismisses the keyboard (back button, swipe down) without blurring
    // the input, so tracking it is the only way to tell "still typing" from
    // "focused, keyboard gone" when a slot is pressed. See focusInput below.
    const keyboardVisible = useRef(false);
    const feedback = useHaptics(haptic);

    useEffect(() => {
      const subscriptions =
        Platform.OS === 'android'
          ? [
              Keyboard.addListener('keyboardDidShow', () => {
                keyboardVisible.current = true;
              }),
              Keyboard.addListener('keyboardDidHide', () => {
                keyboardVisible.current = false;
              }),
            ]
          : [];

      return () => {
        subscriptions.forEach((subscription) => subscription.remove());
        if (refocusTimeout.current) clearTimeout(refocusTimeout.current);
      };
    }, []);

    const focusInput = useCallback(() => {
      // On Android the input stays focused after the keyboard is dismissed and
      // no onBlur fires, which makes focus() a no-op — the keyboard never comes
      // back. Cycling blur -> focus reopens it. Guarded on the keyboard being
      // down so pressing a slot mid-entry doesn't flash the keyboard closed.
      if (
        Platform.OS === 'android' &&
        !keyboardVisible.current &&
        inputRef.current?.isFocused()
      ) {
        inputRef.current.blur();
        if (refocusTimeout.current) clearTimeout(refocusTimeout.current);
        refocusTimeout.current = setTimeout(() => {
          inputRef.current?.focus();
        }, 50);
        return;
      }

      inputRef.current?.focus();
    }, []);

    // Theme colors
    const cardColor = useColor('card');
    const textColor = useColor('text');
    const muted = useColor('textMuted');
    const borderColor = useColor('border');
    const primary = useColor('primary');
    const danger = useColor('red');
    const background = useColor('background');

    // Normalize value to ensure it doesn't exceed length
    const normalizedValue = value.slice(0, length);

    // Calculate active index based on current value
    const currentActiveIndex = Math.min(normalizedValue.length, length - 1);

    // Expose methods via ref
    useImperativeHandle(ref, () => ({
      focus: focusInput,
      blur: () => {
        if (refocusTimeout.current) clearTimeout(refocusTimeout.current);
        inputRef.current?.blur();
      },
      clear: () => {
        onChangeText?.('');
        setActiveIndex(0);
      },
      getValue: () => normalizedValue,
    }));

    const handleChangeText = useCallback(
      (text: string) => {
        // Only allow numeric input
        const cleanText = text.replace(/[^0-9]/g, '');
        const limitedText = cleanText.slice(0, length);

        onChangeText?.(limitedText);
        setActiveIndex(Math.min(limitedText.length, length - 1));

        const grew = limitedText.length > previousLength.current;
        previousLength.current = limitedText.length;

        if (masked && revealMs > 0 && grew) {
          setRevealedIndex(limitedText.length - 1);
          if (revealTimer.current) clearTimeout(revealTimer.current);
          revealTimer.current = setTimeout(
            () => setRevealedIndex(-1),
            revealMs
          );
        }

        // Call onComplete when OTP is fully entered.
        // Deliberately the only haptic here: the system keyboard already emits
        // its own key click, so a per-keystroke buzz would double up on the one
        // interaction the user repeats `length` times.
        if (limitedText.length === length) {
          feedback('success');
          onComplete?.(limitedText);
        }
      },
      [length, onChangeText, onComplete, feedback, masked, revealMs]
    );

    // Nothing should fire after the field goes away.
    useEffect(
      () => () => {
        if (revealTimer.current) clearTimeout(revealTimer.current);
      },
      []
    );

    const handleKeyPress = useCallback(
      (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
        const { key } = e.nativeEvent;

        if (key === 'Backspace' && normalizedValue.length > 0) {
          const newValue = normalizedValue.slice(0, -1);
          onChangeText?.(newValue);
          setActiveIndex(Math.max(0, newValue.length));
        }
      },
      [normalizedValue, onChangeText]
    );

    const handleFocus = useCallback(
      (e: any) => {
        setIsFocused(true);
        setActiveIndex(normalizedValue.length);
        onFocus?.(e);
      },
      [normalizedValue.length, onFocus]
    );

    const handleBlur = useCallback(
      (e: any) => {
        setIsFocused(false);
        onBlur?.(e);
      },
      [onBlur]
    );

    const handleSlotPress = useCallback(() => {
      if (!disabled) {
        focusInput();
      }
    }, [disabled, focusInput]);

    // Generate slots
    const slots = Array.from({ length }, (_, index) => {
      const hasValue = index < normalizedValue.length;
      const isActive = isFocused && index === currentActiveIndex;
      const displayValue = hasValue
        ? masked && index !== revealedIndex
          ? '•'
          : normalizedValue[index]
        : '';

      return (
        <React.Fragment key={index}>
          <Pressable
            onPress={handleSlotPress}
            disabled={disabled}
            accessibilityRole='keyboardkey'
            accessibilityLabel={
              hasValue
                ? `Digit ${index + 1} of ${length}, ${masked ? 'filled' : normalizedValue[index]}`
                : `Digit ${index + 1} of ${length}, empty`
            }
            accessibilityState={{ disabled, selected: isActive }}
            style={[
              {
                width: 58,
                height: 58,
                borderRadius: CORNERS,
                borderWidth: 1,
                borderColor: error
                  ? danger
                  : isActive
                    ? primary
                    : hasValue
                      ? borderColor
                      : borderColor,
                backgroundColor: disabled ? muted + '20' : cardColor,
                justifyContent: 'center',
                alignItems: 'center',
                opacity: disabled ? 0.6 : 1,
              },
              slotStyle,
            ]}
          >
            <Text
              style={{
                fontSize: FONT_SIZE + 2,
                fontWeight: '600',
                color: error ? danger : hasValue ? textColor : muted,
              }}
            >
              {displayValue}
            </Text>

            {/* Cursor */}
            {showCursor && isActive && !hasValue && (
              <View
                style={{
                  position: 'absolute',
                  width: 2,
                  height: 20,
                  backgroundColor: primary,
                  opacity: isFocused ? 1 : 0,
                }}
              />
            )}
          </Pressable>

          {/* Separator */}
          {separator && index < length - 1 &&
            (!groupSize || (index + 1) % groupSize === 0) && (
            <View style={{ marginHorizontal: 4 }}>{separator}</View>
          )}
        </React.Fragment>
      );
    });

    const renderContent = () => (
      <View style={containerStyle}>
        {/* Hidden TextInput for handling input */}
        <TextInput
          ref={inputRef}
          value={normalizedValue}
          onChangeText={handleChangeText}
          onKeyPress={handleKeyPress}
          onFocus={handleFocus}
          onBlur={handleBlur}
          keyboardType='numeric'
          maxLength={length}
          editable={!disabled}
          selectionColor='transparent'
          textContentType='oneTimeCode'
          autoComplete='one-time-code'
          style={{
            position: 'absolute',
            left: -9999,
            opacity: 0,
          }}
          {...textInputProps}
        />

        {/* OTP Slots */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: separator ? 0 : 8,
          }}
        >
          {slots}
        </View>

        {/* Error Message */}
        {error && (
          <Text
            style={[
              {
                textAlign: 'center',
                marginTop: 8,
                fontSize: 14,
                color: danger,
              },
              errorStyle,
            ]}
          >
            {error}
          </Text>
        )}
      </View>
    );

    return renderContent();
  }
);

InputOTP.displayName = 'InputOTP';

// Optional: Export a preset with separator
export const InputOTPWithSeparator = forwardRef<
  InputOTPRef,
  Omit<InputOTPProps, 'separator'>
>((props, ref) => (
  <InputOTP
    ref={ref}
    separator={
      <Text style={{ fontSize: 18, color: useColor('textMuted') }}>-</Text>
    }
    {...props}
  />
));

InputOTPWithSeparator.displayName = 'InputOTPWithSeparator';
