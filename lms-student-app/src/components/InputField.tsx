import { Text, TextInput, TextInputProps, View } from "react-native";

interface Props extends TextInputProps {
  label: string;
  error?: string;
}

export function InputField({ label, error, ...rest }: Props) {
  return (
    <View className="mb-4">
      <Text className="text-muted text-sm mb-1.5">{label}</Text>
      <TextInput
        placeholderTextColor="#94A3B8"
        className={`border rounded-xl px-4 py-3 text-text text-base bg-white ${
          error ? "border-error" : "border-border"
        }`}
        {...rest}
      />
      {error ? <Text className="text-error text-xs mt-1">{error}</Text> : null}
    </View>
  );
}
