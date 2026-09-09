import { BankCard, CARD_HEIGHT } from "@/components/home/bank-card";
import { HomeHeader } from "@/components/home/home-header";
import { QuickActions } from "@/components/home/quick-actions";
import { SuggestionCard } from "@/components/home/suggestion-card";
import { TodoChip } from "@/components/home/todo-chip";
import { TransactionRow } from "@/components/home/transaction-row";
import { ScrollView } from "@/components/ui/scroll-view";
import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import { CARDS, SUGGESTIONS, TODOS } from "@/constants/home-data";
import { useBottomTabOverflow } from "@/hooks/use-bottom-tab-overflow";
import { useColor } from "@/hooks/use-color";
import { formatMoney } from "@/lib/money";
import { useAuthStore } from "@/stores/auth-store";
import {
  accountByLast4,
  selectTotalBalance,
  useLedgerStore,
} from "@/stores/ledger-store";
import { RADIUS } from "@/theme/globals";
import Alert01Icon from "@hugeicons-pro/core-solid-rounded/Alert01Icon";
import ArrowDown01Icon from "@hugeicons-pro/core-stroke-rounded/ArrowDown01Icon";
import MoreHorizontalCircle01Icon from "@hugeicons-pro/core-stroke-rounded/MoreHorizontalCircle01Icon";
import Settings01Icon from "@hugeicons-pro/core-stroke-rounded/Settings01Icon";
import UnfoldMoreIcon from "@hugeicons-pro/core-stroke-rounded/UnfoldMoreIcon";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { useState } from "react";
import { Pressable, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const GUTTER = 16;

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const profile = useAuthStore((state) => state.profile);
  const tabBar = useBottomTabOverflow();

  const accounts = useLedgerStore((state) => state.accounts);
  const transactions = useLedgerStore((state) => state.transactions);
  const total = useLedgerStore(selectTotalBalance);

  const [todos, setTodos] = useState(TODOS);

  const canvas = useColor("canvas");
  const surface = useColor("background");
  const bodyColor = useColor("secondaryForeground");
  const muted = useColor("textMuted");
  const warning = useColor("warning");
  const divider = useColor("secondary");
  const brandTint = useColor("brandTint");
  const indigo = useColor("indigo");
  const cardWidth = width - 64;

  return (
    <View style={{ flex: 1, backgroundColor: canvas }}>
      <SafeAreaView edges={["top"]}>
        <HomeHeader name={profile.name} />
      </SafeAreaView>

      <ScrollView
        contentContainerStyle={{ paddingBottom: tabBar + 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── The account panel ─────────────────────────────────────────── */}
        <View
          style={{
            marginTop: GUTTER,
            paddingTop: GUTTER,
            paddingBottom: GUTTER,
            backgroundColor: surface,
            borderRadius: RADIUS.lg,
          }}
        >
          <View
            style={{
              paddingHorizontal: GUTTER,
              flexDirection: "row",
              alignItems: "flex-start",
            }}
          >
            <View style={{ flex: 1 }}>
              <Text variant="title" lightColor={bodyColor}>
                Returned balance:
              </Text>
              <View
                style={{
                  marginTop: 4,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Text variant="subtitle" lightColor={bodyColor}>
                  {formatMoney(total)}
                </Text>
                <HugeiconsIcon icon={Alert01Icon} size={20} color={warning} />
              </View>
            </View>

            <Pressable
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Show all cards"
              style={({ pressed }) => ({
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                opacity: pressed ? 0.5 : 1,
              })}
            >
              <Text variant="subtitle" lightColor={bodyColor}>
                All cards
              </Text>
              <HugeiconsIcon
                icon={ArrowDown01Icon}
                size={24}
                color={bodyColor}
                strokeWidth={1.5}
              />
            </Pressable>
          </View>

          <View style={{ marginTop: 24 }}>
            <View
              style={{
                position: "absolute",
                top: 0,
                alignSelf: "center",
                width: cardWidth - 32,
                height: CARD_HEIGHT,
                borderRadius: RADIUS.md,
                backgroundColor: brandTint,
              }}
            />
            <View
              style={{
                position: "absolute",
                top: 8,
                alignSelf: "center",
                width: cardWidth - 16,
                height: CARD_HEIGHT,
                borderRadius: RADIUS.md,
                backgroundColor: indigo,
              }}
            />

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToInterval={cardWidth + GUTTER}
              decelerationRate="fast"
              contentContainerStyle={{
                paddingHorizontal: 32,
                gap: GUTTER,
                paddingTop: 16,
              }}
            >
              {CARDS.map((card) => {
                // The card and the account are the same money — the last four
                // digits are what ties them together.
                const account = accountByLast4(accounts, card.last4);
                return (
                  <BankCard
                    key={card.id}
                    card={card}
                    balance={formatMoney(
                      account?.balance ?? 0,
                      account?.symbol ?? "$",
                    )}
                    width={cardWidth}
                  />
                );
              })}
            </ScrollView>
          </View>

          <View style={{ marginTop: 40 }}>
            <QuickActions />
          </View>

          <View
            style={{
              height: 1,
              backgroundColor: divider,
              marginTop: 15,
              marginHorizontal: GUTTER,
            }}
          />

          <Text
            variant="body"
            lightColor={bodyColor}
            style={{ margin: GUTTER }}
          >
            Transactions
          </Text>

          <View style={{ paddingHorizontal: 28, gap: 16 }}>
            {transactions.slice(0, 4).map((item) => (
              <TransactionRow key={item.id} item={item} />
            ))}
          </View>

          <Pressable
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Show more transactions"
            style={({ pressed }) => ({
              marginTop: 12,
              alignSelf: "center",
              width: 28,
              height: 28,
              borderRadius: 14,
              backgroundColor: surface,
              alignItems: "center",
              justifyContent: "center",
              opacity: pressed ? 0.5 : 1,
            })}
          >
            <HugeiconsIcon
              icon={UnfoldMoreIcon}
              size={16}
              color={muted}
              strokeWidth={2}
            />
          </Pressable>
        </View>

        {/* ── To do ─────────────────────────────────────────────────────── */}
        {todos.length > 0 ? (
          <>
            <Text
              variant="body"
              lightColor={bodyColor}
              style={{ marginTop: 32, marginHorizontal: GUTTER }}
            >
              To do
            </Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: GUTTER,
                paddingTop: 16,
                gap: 12,
              }}
            >
              {todos.map((item) => (
                <TodoChip
                  key={item.id}
                  item={item}
                  onDismiss={() =>
                    setTodos((current) =>
                      current.filter((todo) => todo.id !== item.id),
                    )
                  }
                />
              ))}
            </ScrollView>
          </>
        ) : null}

        {/* ── Suggestions ───────────────────────────────────────────────── */}
        <Text
          variant="body"
          lightColor={bodyColor}
          style={{ marginTop: 32, marginHorizontal: GUTTER }}
        >
          Suggestions
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: GUTTER,
            paddingTop: 16,
            gap: 16,
          }}
        >
          {SUGGESTIONS.map((item) => (
            <SuggestionCard key={item.id} item={item} />
          ))}
        </ScrollView>

        <Pressable
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Configure"
          style={({ pressed }) => ({
            marginTop: 32,
            alignSelf: "center",
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            opacity: pressed ? 0.5 : 1,
          })}
        >
          <HugeiconsIcon
            icon={Settings01Icon}
            size={20}
            color={bodyColor}
            strokeWidth={1.5}
          />
          {/* The kit's label reads "Congifure" — corrected here. */}
          <Text variant="body" lightColor={bodyColor}>
            Configure
          </Text>
        </Pressable>
      </ScrollView>

      {/* 277:1601 — floats over the list, anchored to the right edge. */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="More"
        style={({ pressed }) => ({
          position: "absolute",
          right: GUTTER,
          bottom: tabBar + 24,
          width: 48,
          height: 48,
          borderRadius: 24,
          backgroundColor: surface,
          alignItems: "center",
          justifyContent: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
          elevation: 4,
          opacity: pressed ? 0.8 : 1,
        })}
      >
        <HugeiconsIcon
          icon={MoreHorizontalCircle01Icon}
          size={24}
          color={bodyColor}
          strokeWidth={1.5}
        />
      </Pressable>
    </View>
  );
}
