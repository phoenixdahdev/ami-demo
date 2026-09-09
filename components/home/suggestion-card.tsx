import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { Suggestion } from '@/constants/home-data';
import { useColor } from '@/hooks/use-color';
import { RADIUS } from '@/theme/globals';
import ArrowRight01Icon from '@hugeicons-pro/core-stroke-rounded/ArrowRight01Icon';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { Image } from 'expo-image';
import { Pressable } from 'react-native';

/** Figma 271:1229 — 270 x 250, 16pt corners, 2pt white border. */
export const SUGGESTION_WIDTH = 270;
const SUGGESTION_HEIGHT = 250;

export function SuggestionCard({ item }: { item: Suggestion }) {
  const border = useColor('background');
  const bodyColor = useColor('secondaryForeground');

  return (
    <Pressable
      accessibilityRole='button'
      accessibilityLabel={item.title}
      style={({ pressed }) => ({
        width: SUGGESTION_WIDTH,
        height: SUGGESTION_HEIGHT,
        borderRadius: RADIUS.lg,
        borderWidth: 2,
        borderColor: border,
        backgroundColor: item.background,
        padding: 24,
        overflow: 'hidden',
        opacity: pressed ? 0.9 : 1,
      })}
    >
      <Text variant='body' lightColor={bodyColor} style={{ width: 174 }}>
        {item.title}
      </Text>

      {/* The illustration sits behind the arrow, bleeding off the card. */}
      <Image
        source={require('../../assets/images/suggestion-phone.webp')}
        style={{ position: 'absolute', left: 78, top: 87, width: 85, height: 124 }}
        contentFit='contain'
      />
      <Image
        source={require('../../assets/images/suggestion-frog.webp')}
        style={{ position: 'absolute', left: 165, top: 144, width: 60, height: 40 }}
        contentFit='contain'
      />

      <View
        style={{
          position: 'absolute',
          left: 24,
          bottom: 24,
          width: 30,
          height: 30,
          borderRadius: 15,
          backgroundColor: border,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <HugeiconsIcon
          icon={ArrowRight01Icon}
          size={16}
          color={bodyColor}
          strokeWidth={2}
        />
      </View>
    </Pressable>
  );
}
