import { useColor } from '@/hooks/use-color';
import MaterialIcons from '@expo/vector-icons/Feather';
// `Icon`, `Label`, `Badge` and `VectorIcon` are statics on `NativeTabs.Trigger`
// rather than top-level exports of this module — they were removed as named
// exports in expo-router 57 and importing them by name throws at runtime.
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { Platform } from 'react-native';

const { Icon, Label, VectorIcon } = NativeTabs.Trigger;

/**
 * The kit draws Cards / Accounts / Cashback / Savings as chips inside the home
 * screen (271:1158–271:1165). They are the app's native tab bar instead, so the
 * platform owns the selection affordance and the home screen keeps that space.
 *
 * Order and naming follow how a bank is actually used rather than the kit:
 * accounts lead, and Cashback is a Loan tab. `(accounts)` is the group, so it
 * owns "/" and is what the app opens on.
 */
export default function TabsLayout() {
  // The tab bar has its own pair of tokens: idle tabs are the muted grey, the
  // selected one is the brand blue.
  const tabIconDefault = useColor('tabIconDefault');
  const tabIconSelected = useColor('tabIconSelected');

  return (
    <NativeTabs
      minimizeBehavior='onScrollDown'
      labelStyle={{
        default: { color: tabIconDefault },
        selected: { color: tabIconSelected },
      }}
      iconColor={{
        default: tabIconDefault,
        selected: tabIconSelected,
      }}
      labelVisibilityMode='labeled'
      disableTransparentOnScrollEdge={true}
    >
      <NativeTabs.Trigger name='(accounts)'>
        {Platform.select({
          ios: <Icon sf='building.columns.fill' />,
          android: (
            <Icon src={<VectorIcon family={MaterialIcons} name='layers' />} />
          ),
        })}
        <Label>Accounts</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name='cards'>
        {Platform.select({
          ios: <Icon sf='creditcard.fill' />,
          android: (
            <Icon src={<VectorIcon family={MaterialIcons} name='credit-card' />} />
          ),
        })}
        <Label>Cards</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name='loan'>
        {Platform.select({
          ios: <Icon sf='dollarsign.circle.fill' />,
          android: (
            <Icon src={<VectorIcon family={MaterialIcons} name='dollar-sign' />} />
          ),
        })}
        <Label>Loan</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name='savings'>
        {Platform.select({
          ios: <Icon sf='chart.line.uptrend.xyaxis' />,
          android: (
            <Icon src={<VectorIcon family={MaterialIcons} name='trending-up' />} />
          ),
        })}
        <Label>Savings</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
