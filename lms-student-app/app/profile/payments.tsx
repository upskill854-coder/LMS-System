import { FlatList, Text, View } from "react-native";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { paymentService } from "@/services/payment.service";
import { EmptyState, ErrorState, LoadingSkeletonCard } from "@/components/StateViews";
import { Payment } from "@/types";

const STATUS_STYLES: Record<Payment["status"], string> = {
  SUCCESS: "bg-success/10 text-success",
  PENDING: "bg-warning/10 text-warning",
  FAILED: "bg-error/10 text-error",
};

export default function PaymentHistory() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["payments", "me"],
    queryFn: paymentService.getPaymentHistory,
  });

  return (
    <View className="flex-1 bg-background pt-14 px-5">
      <Text className="text-text text-xl font-bold mb-4">My Payments</Text>

      {isLoading && (
        <>
          <LoadingSkeletonCard />
          <LoadingSkeletonCard />
        </>
      )}

      {isError && <ErrorState message="Couldn't load payment history." onRetry={refetch} />}

      {data?.length === 0 && <EmptyState title="No payments yet" />}

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="bg-card border border-border rounded-2xl p-4 mb-3">
            <View className="flex-row justify-between items-start mb-1">
              <Text className="text-text font-semibold flex-1">{item.courseTitle}</Text>
              <View className={`px-2 py-1 rounded-full ${STATUS_STYLES[item.status]}`}>
                <Text className={`text-[10px] font-semibold ${STATUS_STYLES[item.status].split(" ")[1]}`}>
                  {item.status}
                </Text>
              </View>
            </View>
            <Text className="text-text font-bold">₹{item.amount}</Text>
            <Text className="text-muted text-xs mt-1">
              {format(new Date(item.createdAt), "MMM d, yyyy • h:mm a")}
            </Text>
            <Text className="text-muted text-xs mt-0.5">Txn ID: {item.transactionId}</Text>
          </View>
        )}
      />
    </View>
  );
}
