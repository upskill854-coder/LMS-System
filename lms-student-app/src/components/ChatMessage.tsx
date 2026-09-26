import { Text, View } from "react-native";
import { format } from "date-fns";
import { ChatMessage as ChatMessageType } from "@/types";

interface Props {
  message: ChatMessageType;
  isOwn: boolean;
}

export function ChatMessageBubble({ message, isOwn }: Props) {
  const isStaff = message.senderRole !== "STUDENT";

  return (
    <View className={`mb-2 ${isOwn ? "items-end" : "items-start"}`}>
      <View
        className={`max-w-[80%] rounded-2xl px-3 py-2 ${
          isStaff ? "bg-primary/10" : isOwn ? "bg-primary" : "bg-card border border-border"
        }`}
      >
        <Text
          className={`text-xs font-semibold mb-0.5 ${
            isStaff ? "text-primary" : isOwn ? "text-white/90" : "text-muted"
          }`}
        >
          {message.senderName} {isStaff ? "· Teacher" : ""}
        </Text>
        <Text className={isOwn && !isStaff ? "text-white text-sm" : "text-text text-sm"}>
          {message.message}
        </Text>
      </View>
      <Text className="text-muted text-[10px] mt-0.5">
        {format(new Date(message.createdAt), "h:mm a")}
      </Text>
    </View>
  );
}
