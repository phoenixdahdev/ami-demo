import { Icon } from '@/components/ui/icon';
import { useColor } from '@/hooks/use-color';
import { Tabs } from 'expo-router';
import { CreditCard, Layers, Percent, TrendingUp } from 'lucide-react-native';

/** Web has no native tab bar, so this mirrors `_layout.tsx` with JS tabs. */
export default function WebTabsLayout() {
  const active = useColor('tabIconSelected');
  const inactive = useColor('tabIconDefault');

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: active,
        tabBarInactiveTintColor: inactive,
      }}
    >
      <Tabs.Screen
        name='(cards)'
        options={{
          title: 'Cards',
          tabBarIcon: ({ color }) => (
            <Icon name={CreditCard} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='accounts'
        options={{
          title: 'Accounts',
          tabBarIcon: ({ color }) => (
            <Icon name={Layers} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='cashback'
        options={{
          title: 'Cashback',
          tabBarIcon: ({ color }) => (
            <Icon name={Percent} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='savings'
        options={{
          title: 'Savings',
          tabBarIcon: ({ color }) => (
            <Icon name={TrendingUp} size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
