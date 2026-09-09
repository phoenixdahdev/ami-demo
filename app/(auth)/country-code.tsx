import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { COUNTRIES, Country } from '@/constants/countries';
import { useColor } from '@/hooks/use-color';
import { useHaptics } from '@/hooks/use-haptics';
import { useAuthStore } from '@/stores/auth-store';
import { FONTS } from '@/theme/fonts';
import { RADIUS } from '@/theme/globals';
import CheckmarkCircle02Icon from '@hugeicons-pro/core-solid-rounded/CheckmarkCircle02Icon';
import Search01Icon from '@hugeicons-pro/core-stroke-rounded/Search01Icon';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, TextInput } from 'react-native';

/** Figma 356:2714, and 359:2988 with the search focused. */
export default function CountryCodeScreen() {
  const selected = useAuthStore((state) => state.country);
  const setCountry = useAuthStore((state) => state.setCountry);
  const feedback = useHaptics();

  const [query, setQuery] = useState('');

  const text = useColor('text');
  const muted = useColor('textMuted');
  const success = useColor('green');
  const primary = useColor('primary');
  // iOS search fields are a translucent grey, not a theme surface.
  const searchFill = 'rgba(118, 118, 128, 0.12)';

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return COUNTRIES;

    return COUNTRIES.filter(
      (country) =>
        country.name.toLowerCase().includes(needle) ||
        country.dial.includes(needle)
    );
  }, [query]);

  const choose = (country: Country) => {
    feedback('selection');
    setCountry(country);
    router.back();
  };

  return (
    <View style={{ flex: 1, paddingTop: 24 }}>
      <Text variant='screenTitle' style={{ paddingHorizontal: 16 }}>
        Country code
      </Text>

      <View
        style={{
          marginTop: 24,
          marginHorizontal: 16,
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
          placeholder='Search'
          placeholderTextColor={muted}
          autoCorrect={false}
          selectionColor={primary}
          accessibilityLabel='Search countries'
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

      <FlatList
        data={results}
        keyExtractor={(country) => country.code}
        keyboardShouldPersistTaps='handled'
        contentContainerStyle={{ paddingVertical: 16, paddingHorizontal: 16 }}
        renderItem={({ item }) => {
          const isSelected = item.code === selected.code;

          return (
            <Pressable
              onPress={() => choose(item)}
              accessibilityRole='button'
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={`${item.name} ${item.dial}`}
              style={({ pressed }) => ({
                height: 56,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 16,
                opacity: pressed ? 0.5 : 1,
              })}
            >
              <Text variant='screenTitle'>{item.flag}</Text>
              <Text variant='field' style={{ flex: 1 }}>
                {item.name} ({item.dial})
              </Text>
              {isSelected ? (
                <HugeiconsIcon
                  icon={CheckmarkCircle02Icon}
                  size={24}
                  color={success}
                />
              ) : null}
            </Pressable>
          );
        }}
        ListEmptyComponent={
          <Text
            variant='bodySm'
            lightColor={muted}
            style={{ textAlign: 'center', marginTop: 24 }}
          >
            No countries match “{query}”
          </Text>
        }
        style={{ borderRadius: RADIUS.md }}
      />
    </View>
  );
}
