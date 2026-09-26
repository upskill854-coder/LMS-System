import { View } from "react-native";
import { WebView } from "react-native-webview";
import { LiveSessionToken } from "@/types";

interface Props {
  session: LiveSessionToken;
}

// Renders the WebRTC provider's hosted viewer page inside a WebView.
// The backend-issued token only grants viewer rights — no camera/mic
// permissions are ever requested on the device.
export function LiveVideoPlayer({ session }: Props) {
  const viewerUrl = `${session.wsUrl}?room=${encodeURIComponent(
    session.roomId
  )}&token=${encodeURIComponent(session.token)}&role=viewer`;

  return (
    <View className="bg-black rounded-2xl overflow-hidden" style={{ aspectRatio: 16 / 9 }}>
      <WebView
        source={{ uri: viewerUrl }}
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        // Explicitly disable device media capture — students are viewers only.
        mediaCapturePermissionGrantType="deny"
        style={{ flex: 1, backgroundColor: "#000" }}
      />
    </View>
  );
}
