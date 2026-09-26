import { ActivityIndicator, Pressable, Text } from "react-native";

interface Props {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "danger";
}

export function PrimaryButton({
  label,
  onPress,
  loading,
  disabled,
  variant = "primary",
}: Props) {
  const bg =
    variant === "primary"
      ? "bg-primary"
      : variant === "danger"
      ? "bg-error"
      : "bg-white border border-border";
  const textColor = variant === "secondary" ? "text-text" : "text-white";

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      className={`${bg} rounded-xl py-4 items-center justify-center ${
        disabled || loading ? "opacity-60" : ""
      }`}
    >
      {loading ? (
        <ActivityIndicator color={variant === "secondary" ? "#0F172A" : "#fff"} />
      ) : (
        <Text className={`${textColor} font-semibold text-base`}>{label}</Text>
      )}
    </Pressable>
  );
}
