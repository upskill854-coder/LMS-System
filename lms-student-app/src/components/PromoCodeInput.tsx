import { useState } from "react";
import { Pressable, Text, TextInput, View, ActivityIndicator } from "react-native";

interface Props {
  value: string;
  onChangeText: (v: string) => void;
  onApply: () => Promise<void>;
  errorMessage?: string | null;
}

export function PromoCodeInput({ value, onChangeText, onApply, errorMessage }: Props) {
  const [applying, setApplying] = useState(false);

  const handleApply = async () => {
    if (!value.trim()) return;
    setApplying(true);
    try {
      await onApply();
    } finally {
      setApplying(false);
    }
  };

  return (
    <View className="mb-4">
      <Text className="text-muted text-sm mb-1.5">Promo Code</Text>
      <View className="flex-row gap-2">
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder="Enter code"
          autoCapitalize="characters"
          placeholderTextColor="#94A3B8"
          className={`flex-1 border rounded-xl px-4 py-3 text-text bg-white ${
            errorMessage ? "border-error" : "border-border"
          }`}
        />
        <Pressable
          onPress={handleApply}
          disabled={applying || !value.trim()}
          className="bg-primary rounded-xl px-5 items-center justify-center"
          style={{ opacity: applying || !value.trim() ? 0.6 : 1 }}
        >
          {applying ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white font-semibold">APPLY</Text>
          )}
        </Pressable>
      </View>
      {errorMessage ? <Text className="text-error text-xs mt-1">{errorMessage}</Text> : null}
    </View>
  );
}
