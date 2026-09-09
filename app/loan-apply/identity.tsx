import { UploadCard } from '@/components/loan/upload-card';
import { StepProgress } from '@/components/loan/step-progress';
import { Button } from '@/components/ui/button';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { useColor } from '@/hooks/use-color';
import { useLoanStore } from '@/stores/loan-store';
import { RADIUS } from '@/theme/globals';
import Image01Icon from '@hugeicons-pro/core-stroke-rounded/Image01Icon';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const GUTTER = 16;

export default function IdentityStep() {
  const idDocument = useLoanStore((state) => state.idDocument);
  const setIdDocument = useLoanStore((state) => state.setIdDocument);

  const canvas = useColor('canvas');
  const bodyColor = useColor('secondaryForeground');

  const pick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });
    if (result.canceled) return;

    const asset = result.assets[0];
    setIdDocument({
      name: asset.fileName ?? 'ID document.jpg',
      uri: asset.uri,
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: canvas }}>
      <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1 }}>
        <ScreenHeader title='Verify your identity' />

        <View style={{ paddingHorizontal: GUTTER, marginTop: 16 }}>
          <StepProgress step={1} total={3} />

          <Text variant='caption' style={{ marginTop: 24 }}>
            Add a photo of a government ID — passport, driving licence or
            national ID. We use it to confirm who you are before we lend.
          </Text>

          <View style={{ marginTop: 24 }}>
            <UploadCard
              icon={Image01Icon}
              title='Photo ID'
              description='Passport, licence or national ID'
              document={idDocument}
              onPress={pick}
            />
          </View>
        </View>

        <View style={{ flex: 1 }} />

        <Button
          disabled={!idDocument}
          onPress={() => router.push('/loan-apply/employment')}
          style={{ marginHorizontal: GUTTER, borderRadius: RADIUS.md }}
        >
          Continue
        </Button>
      </SafeAreaView>
    </View>
  );
}
