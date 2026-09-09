import { AuthScreenHeader } from '@/components/auth/screen-header';
import { ScrollView } from '@/components/ui/scroll-view';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { useColor } from '@/hooks/use-color';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * Figma 361:3145. The body copy is the kit's own placeholder text — swap it
 * for real terms before this ships anywhere near a store.
 */
const BODY =
  'Feugiat mattis pellentesque elit nulla. Laoreet massa ultrices tempor magna quis ultrices commodo a, sed. Eu pharetra amet enim aliquam libero posuere in vitae. Id at nulla ut quis pellentesque pulvinar turpis urna. Ut amet risus enim massa, cursus enim dictum. Aliquam quam eleifend nunc diam. Viverra viverra tristique felis tempus aliquet ornare erat scelerisque. Vitae aenean elementum malesuada mattis convallis volutpat. Pharetra vel nibh nulla mauris aliquet ultrices proin tempor amet. Neque placerat nisl ac neque. Eget ridiculus sagittis duis pellentesque scelerisque in platea mus in.';

export default function TermsScreen() {
  const bodyColor = useColor('secondaryForeground');

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <AuthScreenHeader title='Terms & Conditions' />

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 24,
          paddingBottom: 48,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* The kit sets this body at 16/28 rather than the 16/24 of `field`. */}
        <Text variant='field' lightColor={bodyColor} style={{ lineHeight: 28 }}>
          {BODY}
        </Text>

        <View style={{ marginTop: 32 }}>
          <Text variant='sectionTitle'>Privacy</Text>
          <Text
            variant='field'
            lightColor={bodyColor}
            style={{ marginTop: 16, lineHeight: 28 }}
          >
            {BODY}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
