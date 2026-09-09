import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { Spinner } from '@/components/ui/spinner';
import { useColor } from '@/hooks/use-color';
import { useHaptics } from '@/hooks/use-haptics';
import { toMajor } from '@/lib/money';
import { selectAccount, useLedgerStore } from '@/stores/ledger-store';
import { useLoanStore } from '@/stores/loan-store';
import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * Runs the model. The wait is theatre; the decision underneath is the real
 * arithmetic in `lib/loan-risk`, over what the applicant actually supplied.
 */
export default function AssessingStep() {
  const runAssessment = useLoanStore((state) => state.runAssessment);
  const account = useLedgerStore(selectAccount);
  const feedback = useHaptics();

  // The balance we hold for them is one of the model's inputs. The model works
  // in whole currency units; the ledger keeps minor ones.
  const balance = toMajor(account.balance);
  const started = useRef(false);

  const canvas = useColor('canvas');

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    (async () => {
      const assessment = await runAssessment(balance);
      feedback(assessment.approved ? 'success' : 'warning');
      router.replace('/loan-apply/offer');
    })();
  }, [balance, feedback, runAssessment]);

  return (
    <View style={{ flex: 1, backgroundColor: canvas }}>
      <SafeAreaView
        edges={['top', 'bottom']}
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 32,
          gap: 24,
        }}
      >
        <Spinner size='lg' />

        <Text variant='subtitle' style={{ textAlign: 'center' }}>
          Assessing your application
        </Text>
        <Text variant='caption' style={{ textAlign: 'center' }}>
          Checking your documents, income and history with us. This takes a
          few seconds.
        </Text>
      </SafeAreaView>
    </View>
  );
}
