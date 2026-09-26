import { StaticInfoScreen } from "@/components/StaticInfoScreen";

export default function Terms() {
  return (
    <StaticInfoScreen
      title="Terms & Conditions"
      body={
        "Replace this placeholder with your organization's actual terms & conditions, " +
        "or fetch it from the backend (e.g. GET /legal/terms) so legal changes never " +
        "require an app store release."
      }
    />
  );
}
