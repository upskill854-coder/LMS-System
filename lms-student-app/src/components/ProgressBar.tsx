import { View, Text } from "react-native";

interface Props {
  percent: number;
  showLabel?: boolean;
}

export function ProgressBar({ percent, showLabel = true }: Props) {
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <View>
      {showLabel && (
        <Text className="text-xs text-muted mb-1">{clamped}% complete</Text>
      )}
      <View className="h-2 rounded-full bg-border overflow-hidden">
        <View
          className="h-2 rounded-full bg-primary"
          style={{ width: `${clamped}%` }}
        />
      </View>
    </View>
  );
}
