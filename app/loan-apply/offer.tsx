import { Button } from '@/components/ui/button';
import { ScrollView } from '@/components/ui/scroll-view';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { useColor } from '@/hooks/use-color';
import { useHaptics } from '@/hooks/use-haptics';
import { BAND_LABEL, money, TERMS_MONTHS } from '@/lib/loan-risk';
import { selectQuote, useLoanStore } from '@/stores/loan-store';
import { RADIUS } from '@/theme/globals';
import { router } from 'expo-router';
import { Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const GUTTER = 16;

/** A label with its value on the right — the kit's review row. */
function Row({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  const bodyColor = useColor('secondaryForeground');
  const text = useColor('text');

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
      }}
    >
      <Text variant='caption'>{label}</Text>
      <Text
        variant={strong ? 'subtitle' : 'body'}
        lightColor={strong ? text : bodyColor}
      >
        {value}
      </Text>
    </View>
  );
}

function Panel({ children }: { children: React.ReactNode }) {
  const surface = useColor('background');

  return (
    <View
      style={{
        marginTop: 12,
        padding: GUTTER,
        borderRadius: RADIUS.lg,
        backgroundColor: surface,
        gap: 12,
      }}
    >
      {children}
    </View>
  );
}

export default function OfferStep() {
  const assessment = useLoanStore((state) => state.assessment);
  const principal = useLoanStore((state) => state.principal);
  const setPrincipal = useLoanStore((state) => state.setPrincipal);
  const termMonths = useLoanStore((state) => state.termMonths);
  const setTermMonths = useLoanStore((state) => state.setTermMonths);
  const accept = useLoanStore((state) => state.accept);
  const decline = useLoanStore((state) => state.decline);
  const offer = useLoanStore(selectQuote);
  const feedback = useHaptics();

  const canvas = useColor('canvas');
  const surface = useColor('background');
  const green = useColor('green');
  const muted = useColor('textMuted');
  const primary = useColor('primary');
  const brandSubtle = useColor('brandSubtle');
  const bodyColor = useColor('secondaryForeground');

  // Declined: no offer to show, only the reason and a way out.
  if (!assessment?.approved || !offer) {
    return (
      <View style={{ flex: 1, backgroundColor: canvas }}>
        <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1 }}>
          <ScreenHeader title='Your application' />

          <View style={{ paddingHorizontal: GUTTER, marginTop: 16 }}>
            <Text variant='caption'>
              We can’t offer you a loan right now. Your score of{' '}
              {assessment?.score ?? 0} is below what we can lend against — most
              often that means a short time in employment or income we can’t
              yet cover. You can apply again once either changes.
            </Text>
          </View>

          <View style={{ flex: 1 }} />

          <Button
            onPress={() => {
              decline();
              router.dismissAll();
              router.replace('/loan');
            }}
            style={{ marginHorizontal: GUTTER, borderRadius: RADIUS.md }}
          >
            Back to Loan
          </Button>
        </SafeAreaView>
      </View>
    );
  }

  const steps = Math.max(1, Math.round(assessment.maxAmount / 4 / 50) * 50);

  return (
    <View style={{ flex: 1, backgroundColor: canvas }}>
      <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1 }}>
        <ScreenHeader title='Your offer' />

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingHorizontal: GUTTER,
            paddingTop: 8,
            paddingBottom: 24,
          }}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={{
              padding: 20,
              borderRadius: RADIUS.lg,
              backgroundColor: surface,
              alignItems: 'center',
            }}
          >
            <Text variant='caption'>You can borrow up to</Text>
            <Text variant='heading' style={{ marginTop: 4 }}>
              {money(assessment.maxAmount)}
            </Text>

            <View
              style={{
                marginTop: 12,
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: RADIUS.pill,
                backgroundColor: brandSubtle,
              }}
            >
              <Text variant='caption' lightColor={primary}>
                Risk band {assessment.band} · {BAND_LABEL[assessment.band]} ·
                score {assessment.score}
              </Text>
            </View>
          </View>

          {/* Amount */}
          <Panel>
            <Row label='Amount' value={money(principal)} strong />
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <Pressable
                onPress={() => {
                  feedback('selection');
                  setPrincipal(Math.max(steps, principal - steps));
                }}
                accessibilityRole='button'
                accessibilityLabel='Borrow less'
                style={({ pressed }) => ({
                  flex: 1,
                  height: 40,
                  borderRadius: RADIUS.sm,
                  backgroundColor: brandSubtle,
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: pressed ? 0.6 : 1,
                })}
              >
                <Text variant='body' lightColor={primary}>
                  −{money(steps)}
                </Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  feedback('selection');
                  setPrincipal(
                    Math.min(assessment.maxAmount, principal + steps)
                  );
                }}
                accessibilityRole='button'
                accessibilityLabel='Borrow more'
                style={({ pressed }) => ({
                  flex: 1,
                  height: 40,
                  borderRadius: RADIUS.sm,
                  backgroundColor: brandSubtle,
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: pressed ? 0.6 : 1,
                })}
              >
                <Text variant='body' lightColor={primary}>
                  +{money(steps)}
                </Text>
              </Pressable>
            </View>
          </Panel>

          {/* Term */}
          <Panel>
            <Row label='Repay over' value={`${termMonths} months`} />
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {TERMS_MONTHS.map((term) => {
                const active = term === termMonths;
                return (
                  <Pressable
                    key={term}
                    onPress={() => {
                      feedback('selection');
                      setTermMonths(term);
                    }}
                    accessibilityRole='button'
                    accessibilityState={{ selected: active }}
                    accessibilityLabel={`${term} months`}
                    style={({ pressed }) => ({
                      flex: 1,
                      height: 40,
                      borderRadius: RADIUS.sm,
                      backgroundColor: active ? primary : brandSubtle,
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: pressed ? 0.6 : 1,
                    })}
                  >
                    <Text
                      variant='body'
                      lightColor={active ? surface : primary}
                    >
                      {term}m
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </Panel>

          {/* What it costs */}
          <Panel>
            <Row
              label='Monthly payment'
              value={money(offer.monthlyPayment)}
              strong
            />
            <Row label='Interest rate' value={`${offer.aprPercent}% APR`} />
            <Row label='Total interest' value={money(offer.totalInterest)} />
            <Row
              label='Credit-life insurance'
              value={`${money(offer.insurance)} (${assessment.insuranceRatePercent}%)`}
            />
            <Row label='Total repayable' value={money(offer.totalRepayable)} />
          </Panel>

          <Panel>
            <Text variant='caption'>
              The insurance premium is financed with the loan and clears the
              balance if you die or become permanently disabled. Repaying early
              reduces the interest you pay.
            </Text>
          </Panel>

          <Text variant='caption' style={{ marginTop: 16 }}>
            Your score came from: {assessment.factors
              .filter((f) => f.points > 0)
              .map((f) => `${f.label} +${f.points}`)
              .join(', ')}.
          </Text>
        </ScrollView>

        <View style={{ paddingHorizontal: GUTTER, gap: 8 }}>
          <Button
            onPress={() => {
              feedback('success');
              accept();
              router.dismissAll();
              router.replace('/loan');
            }}
            style={{ borderRadius: RADIUS.md }}
          >
            Accept {money(principal)}
          </Button>

          <Button
            variant='ghost'
            onPress={() => {
              decline();
              router.dismissAll();
              router.replace('/loan');
            }}
            textStyle={{ color: muted }}
          >
            No thanks
          </Button>
        </View>
      </SafeAreaView>
    </View>
  );
}
