import { ActivityIndicator, Image, Text, View } from "react-native";

export default function Splash() {
  return (
    <View className="flex-1 bg-primary items-center justify-center px-8">
      <Image
        source={require("../assets/images/icon.png")}
        style={{ width: 96, height: 96, borderRadius: 20, marginBottom: 20 }}
      />
      <Text className="text-white text-2xl font-bold mb-1">
        {process.env.EXPO_PUBLIC_APP_NAME ?? "LMS Student"}
      </Text>
      <Text className="text-white/80 text-sm mb-8">Learn. Practice. Grow.</Text>
      <ActivityIndicator color="#fff" />
    </View>
  );
}
