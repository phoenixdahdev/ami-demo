import { HomeHeader } from '@/components/home/home-header';
import { Button } from '@/components/ui/button';
import { ScrollView } from '@/components/ui/scroll-view';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { useBottomTabOverflow } from '@/hooks/use-bottom-tab-overflow';
import { useColor } from '@/hooks/use-color';
import { BAND_LABEL, money } from '@/lib/loan-risk';
import { formatMoney, toMinor } from '@/lib/money';
import { useAuthStore } from '@/stores/auth-store';
import {
  canAfford,
  selectAccount,
  useLedgerStore,
} from '@/stores/ledger-store';
import { buildQuote, useLoanStore } from '@/stores/loan-store';
import { RADIUS } from '@/theme/globals';
import CheckmarkCircle02Icon from '@hugeicons-pro/core-solid-rounded/CheckmarkCircle02Icon';
import File01Icon from '@hugeicons-pro/core-stroke-rounded/File01Icon';
import Image01Icon from '@hugeicons-pro/core-stroke-rounded/Image01Icon';
import Money01Icon from '@hugeicons-pro/core-stroke-rounded/Money01Icon';
import { HugeiconsIcon, IconSvgElement } from '@hugeicons/react-native';
import { router } from 'expo-router';
import { useMemo } from 'react';
import { Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const GUTTER = 16;

const STEPS: { icon: IconSvgElement; title: string; body: string }[] = [
  {
    icon: Image01Icon,
    title: 'Verify your identity',
    body: 'A photo of a government ID.',
  },
  {
    icon: File01Icon,
    title: 'Prove your employment',
    body: 'Your latest payment slip, income and time in the job.',
  },
  {
    icon: Money01Icon,
    title: 'Get your offer',
    body: 'We score it and show the rate, insurance and repayments.',
  },
];

function Panel({ children }: { children: React.ReactNode }) {
  const surface = useColor('background');

  return (
    <View
      style={{
        marginTop: 12,
        marginHorizontal: GUTTER,
        padding: 20,
        borderRadius: RADIUS.lg,
        backgroundColor: surface,
        gap: 16,
      }}
    >
      {children}
    </View>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  const bodyColor = useColor('secondaryForeground');

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
      <Text variant='body' lightColor={bodyColor}>
        {value}
      </Text>
    </View>
  );
}

export default function LoanScreen() {
  const profile = useAuthStore((state) => state.profile);
  const status = useLoanStore((state) => state.status);
  const assessment = useLoanStore((state) => state.assessment);
  const principal = useLoanStore((state) => state.principal);
  // Memoised rather than selected: `buildQuote` returns a fresh object, which
  // a zustand selector would re-render on forever.
  const termMonths = useLoanStore((state) => state.termMonths);
  const offer = useMemo(
    () => buildQuote(assessment, principal, termMonths),
    [assessment, principal, termMonths]
  );
  const settle = useLoanStore((state) => state.settle);
  const disbursedTo = useLoanStore((state) => state.disbursedTo);
  const accounts = useLedgerStore((state) => state.accounts);
  const fallback = useLedgerStore(selectAccount);
  const tabBar = useBottomTabOverflow();

  const canvas = useColor('canvas');
  const primary = useColor('primary');
  const green = useColor('green');
  const bodyColor = useColor('secondaryForeground');

  const isActive = status === 'active' && offer;

  // The account the money landed in is the account it comes back out of.
  const payoutAccount =
    accounts.find((account) => account.id === disbursedTo) ?? fallback;
  // Settling early clears the principal and the financed premium, not the
  // interest that would have accrued over the months left.
  const payoff = offer ? toMinor(offer.principal + offer.insurance) : 0;
  const canSettle = canAfford(payoutAccount, payoff);

  return (
    <View style={{ flex: 1, backgroundColor: canvas }}>
      <SafeAreaView edges={['top']}>
        <HomeHeader name={profile.name} />
      </SafeAreaView>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: tabBar + 40 }}
        showsVerticalScrollIndicator={false}
      >
        {isActive ? (
          <>
            <Panel>
              <View style={{ alignItems: 'center', gap: 4 }}>
                <HugeiconsIcon
                  icon={CheckmarkCircle02Icon}
                  size={32}
                  color={green}
                />
                <Text variant='caption'>Your loan</Text>
                <Text variant='heading'>{money(principal)}</Text>
              </View>
            </Panel>

            <Panel>
              <Row
                label='Monthly payment'
                value={money(offer.monthlyPayment)}
              />
              <Row label='Repay over' value={`${offer.termMonths} months`} />
              <Row label='Interest rate' value={`${offer.aprPercent}% APR`} />
              <Row label='Insurance' value={money(offer.insurance)} />
              <Row
                label='Total repayable'
                value={money(offer.totalRepayable)}
              />
              {assessment ? (
                <Row
                  label='Risk band'
                  value={`${assessment.band} · ${BAND_LABEL[assessment.band]}`}
                />
              ) : null}
              <Row label='Paid into' value={payoutAccount.name} />
            </Panel>

            <View style={{ marginTop: 24, paddingHorizontal: GUTTER }}>
              <Button
                variant='ghost'
                onPress={() =>
                  Alert.alert(
                    'Settle this loan?',
                    `${formatMoney(
                      payoff,
                      payoutAccount.symbol
                    )} comes out of ${payoutAccount.name} and the loan closes.`,
                    [
                      { text: 'Cancel', style: 'cancel' },
                      { text: 'Settle', onPress: settle },
                    ]
                  )
                }
                disabled={!canSettle}
                textStyle={{ color: bodyColor }}
              >
                {canSettle
                  ? `Settle and close · ${formatMoney(payoff, payoutAccount.symbol)}`
                  : `Needs ${formatMoney(payoff, payoutAccount.symbol)} to settle`}
              </Button>
            </View>
          </>
        ) : (
          <>
            <Panel>
              <Text variant='caption'>Borrowing</Text>
              <Text variant='title'>
                Get a decision in about a minute
              </Text>
              <Text variant='caption'>
                Add two documents and we’ll score your application, then show
                you the rate, the insurance and exactly what you’d repay before
                you commit to anything.
              </Text>

              <Button
                onPress={() => router.push('/loan-apply/identity')}
                style={{ borderRadius: RADIUS.md }}
              >
                {status === 'collecting' ? 'Continue application' : 'Apply for a loan'}
              </Button>
            </Panel>

            <Text
              variant='body'
              lightColor={bodyColor}
              style={{ marginTop: 32, marginHorizontal: 24 }}
            >
              How it works
            </Text>

            <Panel>
              {STEPS.map((step, index) => (
                <View
                  key={step.title}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}
                >
                  <HugeiconsIcon
                    icon={step.icon}
                    size={24}
                    color={primary}
                    strokeWidth={1.5}
                  />
                  <View style={{ flex: 1 }}>
                    <Text variant='body' lightColor={bodyColor}>
                      {index + 1}. {step.title}
                    </Text>
                    <Text variant='caption'>{step.body}</Text>
                  </View>
                </View>
              ))}
            </Panel>
          </>
        )}
      </ScrollView>
    </View>
  );
}
