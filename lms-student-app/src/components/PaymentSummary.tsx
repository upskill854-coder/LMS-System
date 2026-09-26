import { Text, View } from "react-native";
import { PromoValidationResult } from "@/types";

interface Props {
  currency: string;
  originalAmount: number;
  promoResult: PromoValidationResult | null;
}

export function PaymentSummary({ currency, originalAmount, promoResult }: Props) {
  const payable = promoResult?.valid ? promoResult.payableAmount : originalAmount;

  return (
    <View className="bg-card border border-border rounded-2xl p-4">
      <Row label="Original Price" value={`${currency} ${originalAmount}`} />
      {promoResult?.valid && (
        <Row label="Discount" value={`- ${currency} ${promoResult.discountAmount}`} valueColor="text-success" />
      )}
      <View className="h-px bg-border my-2" />
      <Row label="Payable" value={`${currency} ${payable}`} bold />
    </View>
  );
}

function Row({
  label,
  value,
  bold,
  valueColor,
}: {
  label: string;
  value: string;
  bold?: boolean;
  valueColor?: string;
}) {
  return (
    <View className="flex-row justify-between py-1">
      <Text className={`text-sm ${bold ? "text-text font-semibold" : "text-muted"}`}>{label}</Text>
      <Text className={`text-sm ${bold ? "text-text font-bold text-base" : valueColor ?? "text-text"}`}>
        {value}
      </Text>
    </View>
  );
}
