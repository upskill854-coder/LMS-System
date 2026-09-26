import { ScrollView, Text } from "react-native";

interface Props {
  title: string;
  body: string;
}

export function StaticInfoScreen({ title, body }: Props) {
  return (
    <ScrollView className="flex-1 bg-background" contentContainerStyle={{ padding: 20, paddingTop: 60 }}>
      <Text className="text-text text-xl font-bold mb-4">{title}</Text>
      <Text className="text-muted text-sm leading-6">{body}</Text>
    </ScrollView>
  );
}
