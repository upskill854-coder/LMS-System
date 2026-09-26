import { useEffect, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  View,
  Pressable,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { classService } from "@/services/class.service";
import { liveService } from "@/services/live.service";
import { getSocket, joinLiveChat, leaveLiveChat } from "@/services/socket";
import { extractApiErrorMessage } from "@/services/apiClient";
import { useAuthStore } from "@/store/authStore";
import { LiveVideoPlayer } from "@/components/LiveVideoPlayer";
import { ChatMessageBubble } from "@/components/ChatMessage";
import { Countdown } from "@/components/Countdown";
import { VideoPlayer } from "@/components/VideoPlayer";
import { LiveSessionToken, ChatMessage } from "@/types";

export default function LiveClass() {
  const { classId } = useLocalSearchParams<{ classId: string }>();
  const router = useRouter();
  const student = useAuthStore((s) => s.student);

  const [session, setSession] = useState<LiveSessionToken | null>(null);
  const [joinError, setJoinError] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [connected, setConnected] = useState(false);
  const listRef = useRef<FlatList>(null);

  const { data: classInfo, isLoading } = useQuery({
    queryKey: ["class", classId],
    queryFn: () => classService.getClassById(classId),
    enabled: !!classId,
    refetchInterval: 15_000,
  });

  useEffect(() => {
    if (classInfo?.status !== "LIVE") return;

    let socketRef: Awaited<ReturnType<typeof joinLiveChat>> | null = null;

    (async () => {
      try {
        const liveSession = await liveService.joinClass(classId);
        setSession(liveSession);

        const s = await joinLiveChat(classId);
        socketRef = s;

        s.on("connect", () => setConnected(true));
        s.on("disconnect", () => setConnected(false));
        s.on("chat:message", (msg: ChatMessage) => {
          setMessages((prev) => [...prev, msg]);
          requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
        });
        s.on("chat:history", (history: ChatMessage[]) => setMessages(history));
      } catch (error) {
        setJoinError(extractApiErrorMessage(error));
      }
    })();

    return () => {
      leaveLiveChat(classId);
      liveService.leaveClass(classId).catch(() => {});
      socketRef?.off("chat:message");
      socketRef?.off("chat:history");
    };
  }, [classInfo?.status, classId]);

  const sendMessage = async () => {
    if (!draft.trim()) return;
    try {
      const s = await getSocket();
      s.emit("chat:send", { classId, message: draft.trim() });
      setDraft("");
    } catch {
      Toast.show({ type: "error", text1: "Couldn't send message. Check your connection." });
    }
  };

  if (isLoading || !classInfo) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <Text className="text-muted">Loading class...</Text>
      </View>
    );
  }

  if (classInfo.status === "CANCELLED") {
    return (
      <View className="flex-1 bg-background items-center justify-center px-8">
        <Text className="text-error font-semibold text-lg mb-2">Class Cancelled</Text>
        <Text className="text-muted text-sm text-center">
          {classInfo.topic} has been cancelled. Check your schedule for updates.
        </Text>
      </View>
    );
  }

  if (classInfo.status === "UPCOMING") {
    return (
      <View className="flex-1 bg-background items-center justify-center px-8">
        <Text className="text-text font-semibold text-lg mb-2 text-center">{classInfo.topic}</Text>
        <Countdown target={new Date(`${classInfo.date}T${classInfo.startTime}`)} className="text-muted text-base" />
      </View>
    );
  }

  if (classInfo.status === "ENDED") {
    return (
      <View className="flex-1 bg-background items-center justify-center px-8">
        <Text className="text-text font-semibold text-lg mb-2 text-center">Class ended</Text>
        {classInfo.recordingUrl ? (
          <View className="w-full mt-3">
            <VideoPlayer uri={classInfo.recordingUrl} />
          </View>
        ) : (
          <Text className="text-muted text-sm text-center">
            No recording is available for this class.
          </Text>
        )}
      </View>
    );
  }

  // status === "LIVE"
  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View className="pt-14 px-4 pb-2 flex-row items-center gap-2">
        <Pressable onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color="#0F172A" />
        </Pressable>
        <View className="w-2 h-2 rounded-full bg-live" />
        <Text className="text-live font-bold text-xs">LIVE</Text>
        <View className="flex-1">
          <Text className="text-text font-semibold" numberOfLines={1}>
            {classInfo.topic}
          </Text>
        </View>
      </View>
      <Text className="text-muted text-xs px-4 mb-2">Teacher: {classInfo.teacherName}</Text>

      <View className="px-4">
        {session ? (
          <LiveVideoPlayer session={session} />
        ) : joinError ? (
          <View className="bg-error/10 border border-error rounded-2xl p-4">
            <Text className="text-error text-sm">{joinError}</Text>
          </View>
        ) : (
          <View
            className="bg-black rounded-2xl items-center justify-center"
            style={{ aspectRatio: 16 / 9 }}
          >
            <Text className="text-white/60 text-sm">Connecting to live class...</Text>
          </View>
        )}
      </View>

      <View className="flex-1 mt-3 px-4">
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ChatMessageBubble message={item} isOwn={item.senderId === student?.id} />
          )}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        />
        {!connected && (
          <Text className="text-warning text-xs mb-1">Reconnecting to chat...</Text>
        )}
      </View>

      <View className="flex-row items-center gap-2 px-4 py-3 border-t border-border">
        <TextInput
          value={draft}
          onChangeText={setDraft}
          placeholder="Send a message..."
          placeholderTextColor="#94A3B8"
          className="flex-1 border border-border rounded-full px-4 py-2.5 text-text bg-white"
          onSubmitEditing={sendMessage}
        />
        <Pressable onPress={sendMessage} className="bg-primary rounded-full w-10 h-10 items-center justify-center">
          <Ionicons name="send" size={16} color="#fff" />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
