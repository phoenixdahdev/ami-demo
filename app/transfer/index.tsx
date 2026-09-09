import { ScrollView } from '@/components/ui/scroll-view';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import {
  MY_HANDLE,
  TRANSFER_FILTERS,
  TRANSFER_QUICK_ACTIONS,
} from '@/constants/transfer-data';
import { useColor } from '@/hooks/use-color';
import { useHaptics } from '@/hooks/use-haptics';
import { FONTS } from '@/theme/fonts';
import { RADIUS } from '@/theme/globals';
import Calendar03Icon from '@hugeicons-pro/core-solid-rounded/Calendar03Icon';
import CheckmarkSquare01Icon from '@hugeicons-pro/core-solid-rounded/CheckmarkSquare01Icon';
import LinkSquare01Icon from '@hugeicons-pro/core-solid-rounded/LinkSquare01Icon';
import QrCodeIcon from '@hugeicons-pro/core-stroke-rounded/QrCodeIcon';
import Search01Icon from '@hugeicons-pro/core-stroke-rounded/Search01Icon';
import UserGroupIcon from '@hugeicons-pro/core-stroke-rounded/UserGroupIcon';
import { HugeiconsIcon, IconSvgElement } from '@hugeicons/react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/** Figma 431:4374. */
const GUTTER = 16;

const ACTION_ICONS: Record<string, IconSvgElement> = {
  scheduled: Calendar03Icon,
  'split-bill': CheckmarkSquare01Icon,
  'payment-link': LinkSquare01Icon,
};

export default function TransferScreen() {
  const [query, setQuery] = useState('');
  const feedback = useHaptics();

  const canvas = useColor('canvas');
  const surface = useColor('background');
  const bodyColor = useColor('secondaryForeground');
  const muted = useColor('textMuted');
  const primary = useColor('primary');
  const link = useColor('brandVivid');
  const violet = useColor('violet');
  const onViolet = useColor('primaryForeground');
  const text = useColor('text');
  // iOS search fields are a translucent grey, not a theme surface.
  const searchFill = 'rgba(118, 118, 128, 0.12)';

  return (
    <View style={{ flex: 1, backgroundColor: canvas }}>
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <ScreenHeader
          title='Transfer'
          trailing={
            <Pressable
              hitSlop={12}
              accessibilityRole='button'
              accessibilityLabel='Scan a code'
              style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
            >
              <HugeiconsIcon
                icon={QrCodeIcon}
                size={24}
                color={text}
                strokeWidth={1.5}
              />
            </Pressable>
          }
        />

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 40 }}
          keyboardShouldPersistTaps='handled'
          showsVerticalScrollIndicator={false}
        >
          {/* The kit sets the handle level with the title, on the right. */}
          <Text
            variant='body'
            lightColor={primary}
            style={{
              marginTop: -34,
              marginRight: GUTTER,
              textAlign: 'right',
            }}
          >
            {MY_HANDLE}
          </Text>

          <View
            style={{
              marginTop: 16,
              marginHorizontal: GUTTER,
              paddingHorizontal: 8,
              paddingVertical: 7,
              borderRadius: 10,
              backgroundColor: searchFill,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <HugeiconsIcon
              icon={Search01Icon}
              size={16}
              color={muted}
              strokeWidth={2}
            />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder='Search @tag, phone'
              placeholderTextColor={muted}
              autoCorrect={false}
              selectionColor={primary}
              accessibilityLabel='Search people'
              style={{
                flex: 1,
                paddingVertical: 0,
                fontSize: 17,
                lineHeight: 22,
                fontFamily: FONTS.regular,
                color: text,
              }}
            />
          </View>

          {/* Friends / Anipay counters */}
          <View
            style={{
              marginTop: 16,
              marginHorizontal: GUTTER,
              flexDirection: 'row',
              gap: 8,
            }}
          >
            {TRANSFER_FILTERS.map((filter) => (
              <Pressable
                key={filter.id}
                onPress={() => feedback('selection')}
                accessibilityRole='button'
                accessibilityLabel={`${filter.label}, ${filter.count}`}
                style={({ pressed }) => ({
                  height: 40,
                  paddingHorizontal: 12,
                  borderRadius: RADIUS.sm,
                  backgroundColor: surface,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                  opacity: pressed ? 0.6 : 1,
                })}
              >
                <HugeiconsIcon
                  icon={UserGroupIcon}
                  size={18}
                  color={primary}
                  strokeWidth={2}
                />
                <Text variant='body' lightColor={bodyColor}>
                  {filter.label}
                </Text>
                <Text variant='caption'>·</Text>
                <Text variant='body' lightColor={bodyColor}>
                  {filter.count}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Contact permission promo */}
          <View
            style={{
              marginTop: 24,
              marginHorizontal: GUTTER,
              padding: 24,
              borderRadius: RADIUS.lg,
              backgroundColor: violet,
              overflow: 'hidden',
            }}
          >
            <Text variant='body' lightColor={onViolet}>
              Enable contact permission
            </Text>
            <Text
              variant='body'
              lightColor='rgba(255, 255, 255, 0.48)'
              style={{ marginTop: 4 }}
            >
              To allow free and instant payments
            </Text>

            <Pressable
              onPress={() => feedback('success')}
              accessibilityRole='button'
              accessibilityLabel='Allow contact permission'
              style={({ pressed }) => ({
                marginTop: 16,
                alignSelf: 'flex-start',
                paddingHorizontal: 20,
                height: 36,
                borderRadius: RADIUS.sm,
                backgroundColor: surface,
                alignItems: 'center',
                justifyContent: 'center',
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <Text variant='body' lightColor={bodyColor}>
                Allow
              </Text>
            </Pressable>
          </View>

          <Text
            variant='body'
            lightColor={bodyColor}
            style={{ marginTop: 24, marginHorizontal: 24 }}
          >
            Quick actions
          </Text>

          <View
            style={{
              marginTop: 12,
              marginHorizontal: GUTTER,
              paddingVertical: 24,
              paddingHorizontal: GUTTER,
              borderRadius: RADIUS.lg,
              backgroundColor: surface,
              gap: 24,
            }}
          >
            {TRANSFER_QUICK_ACTIONS.map((action) => (
              <Pressable
                key={action.id}
                onPress={() => feedback('impact-light')}
                accessibilityRole='button'
                accessibilityLabel={`${action.title}. ${action.description}`}
                style={({ pressed }) => ({
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 16,
                  opacity: pressed ? 0.6 : 1,
                })}
              >
                <HugeiconsIcon
                  icon={ACTION_ICONS[action.id]}
                  size={24}
                  color={primary}
                />
                <View style={{ flex: 1 }}>
                  <Text variant='body' lightColor={bodyColor}>
                    {action.title}
                  </Text>
                  <Text variant='caption'>{action.description}</Text>
                </View>
              </Pressable>
            ))}

            <Pressable
              onPress={() => feedback('impact-light')}
              accessibilityRole='button'
              accessibilityLabel='See more quick actions'
              style={({ pressed }) => ({
                alignSelf: 'center',
                opacity: pressed ? 0.5 : 1,
              })}
            >
              <Text variant='body' lightColor={link}>
                See more
              </Text>
            </Pressable>
          </View>

          {/* The flow's entry point: the kit reaches Send from a contact row. */}
          <Pressable
            onPress={() => {
              feedback('selection');
              router.push('/transfer/send');
            }}
            accessibilityRole='button'
            accessibilityLabel='Send money to Alvin Klein'
            style={({ pressed }) => ({
              marginTop: 24,
              marginHorizontal: GUTTER,
              padding: GUTTER,
              borderRadius: RADIUS.lg,
              backgroundColor: surface,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              opacity: pressed ? 0.6 : 1,
            })}
          >
            <Text variant='body' lightColor={bodyColor}>
              Send to Alvin Klein
            </Text>
            <Text variant='body' lightColor={primary}>
              Send
            </Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
