import { Text, View } from "react-native";
import { PrimaryButton } from "./PrimaryButton";

export function EmptyState({
  title,
  subtitle,
  actionLabel,
  onAction,
}: {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <View className="items-center justify-center py-16 px-6">
      <Text className="text-text font-semibold text-base mb-1 text-center">{title}</Text>
      {subtitle ? (
        <Text className="text-muted text-sm text-center mb-4">{subtitle}</Text>
      ) : null}
      {actionLabel && onAction ? (
        <View className="w-full mt-2">
          <PrimaryButton label={actionLabel} onPress={onAction} />
        </View>
      ) : null}
    </View>
  );
}

export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <View className="items-center justify-center py-16 px-6">
      <Text className="text-error font-semibold text-base mb-1 text-center">
        Something went wrong
      </Text>
      <Text className="text-muted text-sm text-center mb-4">{message}</Text>
      {onRetry ? (
        <View className="w-full mt-2">
          <PrimaryButton label="Try Again" onPress={onRetry} />
        </View>
      ) : null}
    </View>
  );
}

export function LoadingSkeletonCard() {
  return (
    <View className="bg-card rounded-2xl border border-border mb-4 h-44 overflow-hidden">
      <View className="bg-border h-28 w-full" />
      <View className="p-4">
        <View className="bg-border h-4 w-3/4 rounded mb-2" />
        <View className="bg-border h-3 w-1/2 rounded" />
      </View>
    </View>
  );
}
