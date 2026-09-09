import {
  BackspaceKeyIcon,
  FaceIdKeyIcon,
} from '@/components/auth/keypad-icons';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { useColor } from '@/hooks/use-color';
import { useHaptics } from '@/hooks/use-haptics';
import { Pressable } from 'react-native';

/** Figma: 3 x 4 grid, rows 80pt apart, columns centred on quarters. */
const ROW_HEIGHT = 80;

type Props = {
  onDigit: (digit: string) => void;
  onBackspace: () => void;
  onBiometric?: () => void;
  disabled?: boolean;
  haptic?: boolean;
};

type KeyProps = {
  onPress: () => void;
  disabled?: boolean;
  label?: string;
  accessibilityLabel: string;
  children?: React.ReactNode;
};

function Key({
  onPress,
  disabled,
  label,
  accessibilityLabel,
  children,
}: KeyProps) {
  const digitColor = useColor('secondaryForeground');

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole='button'
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => ({
        flex: 1,
        height: ROW_HEIGHT,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: pressed ? 0.4 : 1,
      })}
    >
      {label ? (
        <Text variant='title' lightColor={digitColor}>
          {label}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
}

/**
 * The PIN keypad from the Create / Confirm PIN frames: bare digits on white,
 * with Face ID and backspace flanking the zero. No key backgrounds — the kit
 * draws the numerals alone.
 */
export function PinPad({
  onDigit,
  onBackspace,
  onBiometric,
  disabled,
  haptic = true,
}: Props) {
  const feedback = useHaptics(haptic);
  const iconColor = useColor('secondaryForeground');

  const press = (action: () => void, intent: 'tick' | 'impact-light') => () => {
    feedback(intent);
    action();
  };

  return (
    <View>
      {[
        ['1', '2', '3'],
        ['4', '5', '6'],
        ['7', '8', '9'],
      ].map((row) => (
        <View key={row[0]} style={{ flexDirection: 'row' }}>
          {row.map((digit) => (
            <Key
              key={digit}
              label={digit}
              accessibilityLabel={digit}
              disabled={disabled}
              onPress={press(() => onDigit(digit), 'tick')}
            />
          ))}
        </View>
      ))}

      <View style={{ flexDirection: 'row' }}>
        <Key
          accessibilityLabel='Use Face ID'
          disabled={disabled || !onBiometric}
          onPress={press(() => onBiometric?.(), 'impact-light')}
        >
          {onBiometric ? <FaceIdKeyIcon color={iconColor} /> : null}
        </Key>

        <Key
          label='0'
          accessibilityLabel='0'
          disabled={disabled}
          onPress={press(() => onDigit('0'), 'tick')}
        />

        <Key
          accessibilityLabel='Delete'
          disabled={disabled}
          onPress={press(onBackspace, 'impact-light')}
        >
          <BackspaceKeyIcon color={iconColor} />
        </Key>
      </View>
    </View>
  );
}
