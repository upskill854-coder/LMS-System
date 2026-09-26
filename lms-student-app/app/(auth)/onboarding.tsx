import { useRef, useState } from "react";
import { Dimensions, FlatList, Text, View } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorageFallback from "@/utils/localFlag";
import { PrimaryButton } from "@/components/PrimaryButton";

const { width } = Dimensions.get("window");

const SLIDES = [
  { title: "Learn From Anywhere", subtitle: "Access every course and lesson right from your phone." },
  { title: "Attend Live Classes", subtitle: "Watch your teacher live and ask questions in real time." },
  { title: "Track Your Progress", subtitle: "See exactly how far you've come in every course." },
];

export default function Onboarding() {
  const router = useRouter();
  const listRef = useRef<FlatList>(null);
  const [index, setIndex] = useState(0);

  const finish = async () => {
    await AsyncStorageFallback.setOnboardingComplete();
    router.replace("/(auth)/login");
  };

  const next = () => {
    if (index < SLIDES.length - 1) {
      listRef.current?.scrollToIndex({ index: index + 1 });
      setIndex(index + 1);
    } else {
      finish();
    }
  };

  return (
    <View className="flex-1 bg-background">
      <FlatList
        ref={listRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.title}
        onMomentumScrollEnd={(e) =>
          setIndex(Math.round(e.nativeEvent.contentOffset.x / width))
        }
        renderItem={({ item }) => (
          <View style={{ width }} className="flex-1 items-center justify-center px-8">
            <Text className="text-text text-2xl font-bold text-center mb-3">
              {item.title}
            </Text>
            <Text className="text-muted text-base text-center">{item.subtitle}</Text>
          </View>
        )}
      />
      <View className="flex-row justify-center mb-6">
        {SLIDES.map((_, i) => (
          <View
            key={i}
            className={`h-2 w-2 rounded-full mx-1 ${
              i === index ? "bg-primary" : "bg-border"
            }`}
          />
        ))}
      </View>
      <View className="px-6 pb-8 flex-row justify-between items-center">
        <Text onPress={finish} className="text-muted font-medium">
          Skip
        </Text>
        <View style={{ width: 160 }}>
          <PrimaryButton
            label={index === SLIDES.length - 1 ? "Get Started" : "Next"}
            onPress={next}
          />
        </View>
      </View>
    </View>
  );
}
