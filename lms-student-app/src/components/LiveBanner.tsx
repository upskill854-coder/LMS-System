import { Pressable, Text, View } from "react-native";

interface Props {
  isLive: boolean;
  title: string;
  subtitle: string;
  onJoin?: () => void;
}

export function LiveBanner({ isLive, title, subtitle, onJoin }: Props) {
  if (!isLive) {
    return (
      <View className="bg-card border border-border rounded-2xl p-4 mb-4">
        <Text className="text-muted text-xs mb-1">Next class</Text>
        <Text className="text-text font-semibold">{title}</Text>
        <Text className="text-muted text-sm mt-1">{subtitle}</Text>
      </View>
    );
  }

  return (
    <View className="bg-live/10 border border-live rounded-2xl p-4 mb-4">
      <View className="flex-row items-center mb-1">
        <View className="w-2 h-2 rounded-full bg-live mr-2" />
        <Text className="text-live font-bold text-xs">LIVE NOW</Text>
      </View>
      <Text className="text-text font-semibold text-base">{title}</Text>
      <Text className="text-muted text-sm mt-1 mb-3">{subtitle}</Text>
      <Pressable onPress={onJoin} className="bg-live rounded-xl py-3 items-center">
        <Text className="text-white font-semibold">JOIN LIVE CLASS</Text>
      </Pressable>
    </View>
  );
}
