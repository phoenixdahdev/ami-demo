import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { Transaction } from '@/constants/home-data';
import { useColor } from '@/hooks/use-color';
import { Image } from 'expo-image';

/** Figma 51:136 — 44pt logo, merchant over category, amount over date. */
export function TransactionRow({ item }: { item: Transaction }) {
  const muted = useColor('textMuted');
  const strong = useColor('foreground');

  return (
    <View
      accessibilityRole='summary'
      accessibilityLabel={`${item.merchant}, ${item.category}, ${item.amount}, ${item.date}`}
      style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}
    >
      <Image
        source={item.logo}
        style={{ width: 44, height: 44, borderRadius: 22 }}
        contentFit='contain'
      />

      <View style={{ flex: 1 }}>
        <Text variant='bodySm' lightColor={strong}>
          {item.merchant}
        </Text>
        <Text variant='micro' lightColor={muted}>
          {item.category}
        </Text>
      </View>

      <View style={{ alignItems: 'flex-end' }}>
        <Text variant='action' lightColor={strong}>
          {item.amount}
        </Text>
        <Text variant='micro' lightColor={muted}>
          {item.date}
        </Text>
      </View>
    </View>
  );
}
