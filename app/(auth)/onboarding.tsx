import { Button } from '@/components/ui/button';
import { Image } from '@/components/ui/image';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { useColor } from '@/hooks/use-color';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';

/**
 * Figma: FinTech kit, node 332:2086 — a 375x812 frame.
 *
 * Everything here is expressed as a fraction of that frame's width so the
 * composition holds its proportions on wider and narrower phones, rather than
 * pinning the illustration to absolute pixels that only look right on a 375pt
 * device.
 */
const FRAME_WIDTH = 375;

const GLOBE = 263 / FRAME_WIDTH;
const RINGS_SIZE = 434 / FRAME_WIDTH;
const RINGS_LEFT = 106 / FRAME_WIDTH;
const RINGS_TOP = -70 / FRAME_WIDTH;

/**
 * The backdrop motif: three concentric circles at 4% white, bleeding off the
 * top-right corner. Values are the frame's exported SVG verbatim — drawn with
 * react-native-svg rather than shipped as a raster so it stays clean at any
 * screen size and costs nothing in the bundle.
 */
function Rings({ width, color }: { width: number; color: string }) {
  const size = width * RINGS_SIZE;

  return (
    <Svg
      width={size}
      height={size}
      viewBox='0 0 434 434'
      style={{
        position: 'absolute',
        left: width * RINGS_LEFT,
        top: width * RINGS_TOP,
      }}
      pointerEvents='none'
    >
      <Circle cx={217} cy={217} r={217} fill={color} fillOpacity={0.04} />
      <Circle cx={217} cy={217} r={157} fill={color} fillOpacity={0.04} />
      <Circle cx={217} cy={217} r={87} fill={color} fillOpacity={0.04} />
    </Svg>
  );
}

export default function OnboardingScreen() {
  const { width } = useWindowDimensions();

  const backdrop = useColor('brandVivid');
  const onBrand = useColor('primaryForeground');

  return (
    <View style={{ flex: 1, backgroundColor: backdrop }}>
      {/* White status bar content: this screen is always on brand blue. */}
      <StatusBar style='light' />

      <Rings width={width} color={onBrand} />

      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        {/* The frame puts 122pt between the status bar and the globe, and
            197pt between the copy and the buttons. Weighted flex rather than
            fixed margins, so a taller phone distributes the extra height the
            way the frame distributes it. */}
        <View style={{ flex: 122 }} />

        <Image
          source={require('../../assets/images/onboarding-globe.webp')}
          variant='default'
          width={width * GLOBE}
          height={width * GLOBE}
          contentFit='contain'
          showLoadingIndicator={false}
          accessibilityLabel='A globe orbited by currency markers'
          containerStyle={{
            alignSelf: 'center',
            backgroundColor: 'transparent',
          }}
        />

        <Text
          variant='title'
          lightColor={onBrand}
          style={{ marginTop: 24, paddingHorizontal: 24 }}
        >
          Onboarding text will be here
        </Text>

        <View style={{ flex: 197 }} />

        <View
          style={{
            flexDirection: 'row',
            gap: 17,
            paddingHorizontal: 16,
            paddingBottom: 16,
          }}
        >
          <Button
            variant='inverse'
            style={{ flex: 1 }}
            onPress={() => router.push('/log-in/phone')}
          >
            Log in
          </Button>
          <Button
            variant='ink'
            style={{ flex: 1 }}
            onPress={() => router.push('/sign-up/phone')}
          >
            Sign up
          </Button>
        </View>
      </SafeAreaView>
    </View>
  );
}
