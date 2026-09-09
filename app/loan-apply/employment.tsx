import { StepProgress } from '@/components/loan/step-progress';
import { UploadCard } from '@/components/loan/upload-card';
import { AvoidKeyboard } from '@/components/ui/avoid-keyboard';
import { Button } from '@/components/ui/button';
import { ScrollView } from '@/components/ui/scroll-view';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { useColor } from '@/hooks/use-color';
import { selectCanAssess, useLoanStore } from '@/stores/loan-store';
import { FONTS } from '@/theme/fonts';
import { RADIUS } from '@/theme/globals';
import File01Icon from '@hugeicons-pro/core-stroke-rounded/File01Icon';
import * as DocumentPicker from 'expo-document-picker';
import { router } from 'expo-router';
import { TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const GUTTER = 16;

/** A labelled numeric field, in the kit's white-panel language. */
function Field({
  label,
  value,
  onChangeText,
  placeholder,
  prefix,
  suffix,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  prefix?: string;
  suffix?: string;
}) {
  const surface = useColor('background');
  const bodyColor = useColor('secondaryForeground');
  const muted = useColor('textMuted');
  const primary = useColor('primary');

  return (
    <View style={{ gap: 8 }}>
      <Text variant='caption'>{label}</Text>
      <View
        style={{
          height: 56,
          paddingHorizontal: GUTTER,
          borderRadius: RADIUS.md,
          backgroundColor: surface,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
        }}
      >
        {prefix ? <Text variant='body' lightColor={muted}>{prefix}</Text> : null}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={muted}
          keyboardType='number-pad'
          selectionColor={primary}
          accessibilityLabel={label}
          style={{
            flex: 1,
            paddingVertical: 0,
            fontSize: 17,
            fontFamily: FONTS.medium,
            color: bodyColor,
          }}
        />
        {suffix ? <Text variant='caption'>{suffix}</Text> : null}
      </View>
    </View>
  );
}

export default function EmploymentStep() {
  const payslip = useLoanStore((state) => state.payslip);
  const setPayslip = useLoanStore((state) => state.setPayslip);
  const monthlyIncome = useLoanStore((state) => state.monthlyIncome);
  const setMonthlyIncome = useLoanStore((state) => state.setMonthlyIncome);
  const monthsEmployed = useLoanStore((state) => state.monthsEmployed);
  const setMonthsEmployed = useLoanStore((state) => state.setMonthsEmployed);
  const ready = useLoanStore(selectCanAssess);

  const canvas = useColor('canvas');

  const pick = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['application/pdf', 'image/*'],
      copyToCacheDirectory: true,
    });
    if (result.canceled) return;

    const asset = result.assets[0];
    setPayslip({ name: asset.name, uri: asset.uri });
  };

  return (
    <View style={{ flex: 1, backgroundColor: canvas }}>
      <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1 }}>
        <ScreenHeader title='Proof of employment' />

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingHorizontal: GUTTER,
            paddingTop: 16,
            paddingBottom: 24,
          }}
          keyboardShouldPersistTaps='handled'
          showsVerticalScrollIndicator={false}
        >
          <StepProgress step={2} total={3} />

          <Text variant='caption' style={{ marginTop: 24 }}>
            Add your most recent payment slip. Your income and time in
            employment set how much we can offer and at what rate.
          </Text>

          <View style={{ marginTop: 24, gap: 24 }}>
            <UploadCard
              icon={File01Icon}
              title='Payment slip'
              description='PDF or photo of your latest slip'
              document={payslip}
              onPress={pick}
            />

            <Field
              label='Net monthly income'
              value={monthlyIncome}
              onChangeText={setMonthlyIncome}
              placeholder='0'
              prefix='$'
            />

            <Field
              label='Time in employment'
              value={monthsEmployed}
              onChangeText={setMonthsEmployed}
              placeholder='0'
              suffix='months'
            />
          </View>
        </ScrollView>

        <Button
          disabled={!ready}
          onPress={() => router.push('/loan-apply/assessing')}
          style={{ marginHorizontal: GUTTER, borderRadius: RADIUS.md }}
        >
          Submit application
        </Button>

        <AvoidKeyboard offset={16} />
      </SafeAreaView>
    </View>
  );
}
