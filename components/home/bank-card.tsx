import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { BankCard as BankCardModel } from '@/constants/home-data';
import { useColor } from '@/hooks/use-color';
import { RADIUS } from '@/theme/globals';
import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

/** Figma: the card is 311 x 80 with 12pt corners, art 44 x 28 inside it. */
export const CARD_HEIGHT = 80;
const ART_WIDTH = 44;
const ART_HEIGHT = 28;

export function BankCard({
  card,
  balance,
  width,
}: {
  card: BankCardModel;
  /** Formatted by the caller, which is the one holding the ledger. */
  balance: string;
  width: number;
}) {
  const onCard = useColor('primaryForeground');
  // Success / 100 — the kit tints the amount rather than using plain white.
  const amountColor = useColor('successSubtle');

  return (
    <View
      accessibilityRole='summary'
      accessibilityLabel={`${card.label} ending ${card.last4}, ${balance}`}
      style={{
        width,
        height: CARD_HEIGHT,
        borderRadius: RADIUS.md,
        backgroundColor: card.background,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        gap: 12,
      }}
    >
      {/* The card art: a gradient chip-card in miniature. */}
      <View
        style={{
          width: ART_WIDTH,
          height: ART_HEIGHT,
          borderRadius: 4,
          overflow: 'hidden',
          justifyContent: 'space-between',
          padding: 4,
        }}
      >
        <LinearGradient
          colors={card.artGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <View
          style={{
            width: 10,
            height: 7,
            borderRadius: 2,
            backgroundColor: '#FFE7AB',
          }}
        />
        <Image
          source={card.scheme}
          style={{ width: 14, height: 8, alignSelf: 'flex-end' }}
          contentFit='contain'
        />
      </View>

      <View style={{ flex: 1 }}>
        <Text variant='body' lightColor={onCard}>
          {card.label}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Text variant='body' lightColor={onCard}>
            ••••
          </Text>
          <Text variant='body' lightColor={onCard}>
            {card.last4}
          </Text>
        </View>
      </View>

      <Text variant='body' lightColor={amountColor}>
        {balance}
      </Text>
    </View>
  );
}
