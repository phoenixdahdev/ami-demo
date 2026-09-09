import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import { useColor } from "@/hooks/use-color";
import FavouriteIcon from "@hugeicons-pro/core-stroke-rounded/FavouriteIcon";
import Notification03Icon from "@hugeicons-pro/core-stroke-rounded/Notification03Icon";
import TradeUpIcon from "@hugeicons-pro/core-stroke-rounded/TradeUpIcon";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { IconSvgElement } from "@hugeicons/react-native";
import { Pressable } from "react-native";

export function HomeHeader({ name }: { name: string }) {
  const iconColor = useColor("secondaryForeground");

  const actions: { icon: IconSvgElement; label: string }[] = [
    { icon: TradeUpIcon, label: "Insights" },
    { icon: FavouriteIcon, label: "Favourites" },
    { icon: Notification03Icon, label: "Notifications" },
  ];

  return (
    <View
      style={{
        height: 56,
        paddingHorizontal: 16,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
      }}
    >
      <Avatar size={32}>
        <AvatarImage source={require("../../assets/images/user-avatar.webp")} />
      </Avatar>

      <Text variant="subtitle" style={{ flex: 1 }}>
        {name}
      </Text>

      {actions.map(({ icon, label }) => (
        <Pressable
          key={label}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={label}
          style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, padding: 4 })}
        >
          <HugeiconsIcon
            icon={icon}
            size={24}
            color={iconColor}
            strokeWidth={1.5}
          />
        </Pressable>
      ))}
    </View>
  );
}
