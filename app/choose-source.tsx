import { SegmentedControl } from "@/components/ui/segmented-control";
import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import { Account, ACCOUNTS, OTHER_SOURCES } from "@/constants/accounts-data";
import { useColor } from "@/hooks/use-color";
import { useHaptics } from "@/hooks/use-haptics";
import { useAccountsStore } from "@/stores/accounts-store";
import { FONTS } from "@/theme/fonts";
import CheckmarkCircle02Icon from "@hugeicons-pro/core-solid-rounded/CheckmarkCircle02Icon";
import CancelCircleIcon from "@hugeicons-pro/core-stroke-rounded/CancelCircleIcon";
import Search01Icon from "@hugeicons-pro/core-stroke-rounded/Search01Icon";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, TextInput } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/**
 * "Choose source" — Figma 661:7724.
 *
 * Structure matters here: a fixed header (close, title, search, filter) and a
 * `flex: 1` list below it. The list must be flex-bounded or it lays out over
 * the header instead of scrolling under it.
 */
const GUTTER = 16;
const FLAG = 32;

type Filter = "ewallet" | "card" | "account";

function SourceRow({
  flag,
  title,
  subtitle,
  selected,
  onPress,
}: {
  flag: string;
  title: string;
  subtitle: string;
  selected?: boolean;
  onPress: () => void;
}) {
  const success = useColor("green");
  const canvas = useColor("canvas");

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: !!selected }}
      accessibilityLabel={`${title}, ${subtitle}`}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        gap: GUTTER,
        paddingVertical: 10,
        opacity: pressed ? 0.6 : 1,
      })}
    >
      <View
        style={{
          width: FLAG,
          height: FLAG,
          borderRadius: FLAG / 2,
          backgroundColor: canvas,
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <Text variant="subtitle">{flag}</Text>
      </View>

      <View style={{ flex: 1 }}>
        <Text variant="body" numberOfLines={1}>
          {title}
        </Text>
        <Text variant="caption" numberOfLines={1}>
          {subtitle}
        </Text>
      </View>

      {selected ? (
        <HugeiconsIcon icon={CheckmarkCircle02Icon} size={24} color={success} />
      ) : null}
    </Pressable>
  );
}

export default function ChooseSourceScreen() {
  const selectedId = useAccountsStore((state) => state.selectedId);
  const select = useAccountsStore((state) => state.select);
  const feedback = useHaptics();
  const insets = useSafeAreaInsets();

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("ewallet");

  // `View` defaults to a transparent background, so a sheet has to paint its
  // own or the screen underneath shows through.
  const surface = useColor("background");
  const text = useColor("text");
  const muted = useColor("textMuted");
  const primary = useColor("primary");
  // iOS search fields are a translucent grey, not a theme surface.
  const searchFill = "rgba(118, 118, 128, 0.12)";

  const needle = query.trim().toLowerCase();

  const recent = useMemo(() => {
    if (!needle) return ACCOUNTS;
    return ACCOUNTS.filter((account) =>
      [account.name, account.currency, account.currencyName, account.balance]
        .join(" ")
        .toLowerCase()
        .includes(needle),
    );
  }, [needle]);

  const others = useMemo(() => {
    if (!needle) return OTHER_SOURCES;
    return OTHER_SOURCES.filter((option) =>
      `${option.name} ${option.currency}`.toLowerCase().includes(needle),
    );
  }, [needle]);

  const choose = (account: Account) => {
    feedback("selection");
    select(account.id);
    router.back();
  };

  // Nothing to select in "Other" yet — these are currencies you don't hold.
  const preview = () => feedback("warning");

  const empty = recent.length === 0 && others.length === 0;

  return (
    <View style={{ flex: 1, backgroundColor: surface, overflow: 'hidden' }}>
      {/* ── Fixed header ──────────────────────────────────────────────── */}
      <View style={{ paddingTop: 12, paddingHorizontal: GUTTER }}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Close"
          style={({ pressed }) => ({
            width: 24,
            height: 24,
            opacity: pressed ? 0.5 : 1,
          })}
        >
          <HugeiconsIcon
            icon={CancelCircleIcon}
            size={24}
            color={text}
            strokeWidth={1.5}
          />
        </Pressable>

        <Text variant="title" style={{ marginTop: 12 }}>
          Choose source
        </Text>

        <View
          style={{
            marginTop: 16,
            paddingHorizontal: 8,
            paddingVertical: 7,
            borderRadius: 10,
            backgroundColor: searchFill,
            flexDirection: "row",
            alignItems: "center",
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
            placeholder="Search source"
            placeholderTextColor={muted}
            autoCorrect={false}
            selectionColor={primary}
            accessibilityLabel="Search sources"
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

        <View style={{ marginTop: 16 }}>
          <SegmentedControl<Filter>
            value={filter}
            onChange={setFilter}
            options={[
              { value: "ewallet", label: "Ewallet" },
              { value: "card", label: "Card" },
              { value: "account", label: "Account" },
            ]}
          />
        </View>
      </View>

      <ScrollView
        // `flex: 1` bounds it to the space under the header; without that it
        // lays out at its content height and spills past the sheet. The
        // spacing lives in the content container rather than a margin, which
        // would come out of that same flex basis.
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: GUTTER,
          paddingTop: 8,
          // A sheet gets no safe-area inset of its own, so the last row would
          // sit under the home indicator.
          paddingBottom: insets.bottom + 24,
        }}
        // The search field is inside the sheet: let the keyboard inset the
        // list instead of covering the rows.
        automaticallyAdjustKeyboardInsets
        contentInsetAdjustmentBehavior='never'
        keyboardShouldPersistTaps='handled'
        keyboardDismissMode='on-drag'
        showsVerticalScrollIndicator={false}
      >
        {recent.length > 0 ? (
          <>
            <Text variant="caption" style={{ marginTop: 16, marginBottom: 4 }}>
              Recently used
            </Text>
            {recent.map((account) => (
              <SourceRow
                key={account.id}
                flag={account.flag}
                title={account.name}
                subtitle={`Balance: ${account.balance} ${account.currency}`}
                selected={account.id === selectedId}
                onPress={() => choose(account)}
              />
            ))}
          </>
        ) : null}

        {others.length > 0 ? (
          <>
            <Text variant="caption" style={{ marginTop: 24, marginBottom: 4 }}>
              Other
            </Text>
            {others.map((option) => (
              <SourceRow
                key={option.id}
                flag={option.flag}
                title={option.name}
                subtitle={option.currency}
                onPress={preview}
              />
            ))}
          </>
        ) : null}

        {empty ? (
          <Text
            variant="caption"
            style={{ marginTop: 32, textAlign: "center" }}
          >
            No sources match “{query}”
          </Text>
        ) : null}
      </ScrollView>
    </View>
  );
}
