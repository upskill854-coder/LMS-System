import { View } from "react-native";
import { ResizeMode, Video } from "expo-av";

interface Props {
  uri: string;
}

export function VideoPlayer({ uri }: Props) {
  return (
    <View className="bg-black rounded-2xl overflow-hidden" style={{ aspectRatio: 16 / 9 }}>
      <Video
        source={{ uri }}
        style={{ width: "100%", height: "100%" }}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
      />
    </View>
  );
}
