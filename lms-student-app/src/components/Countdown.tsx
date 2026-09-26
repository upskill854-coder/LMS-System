import { useEffect, useState } from "react";
import { Text } from "react-native";

interface Props {
  target: Date;
  className?: string;
}

function formatRemaining(ms: number): string {
  if (ms <= 0) return "Starting now";
  const totalMinutes = Math.floor(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export function Countdown({ target, className }: Props) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(interval);
  }, []);

  const remaining = target.getTime() - now;

  return (
    <Text className={className ?? "text-muted text-sm"}>
      Class starts in {formatRemaining(remaining)}
    </Text>
  );
}
