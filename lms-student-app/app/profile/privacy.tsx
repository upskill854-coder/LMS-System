import { StaticInfoScreen } from "@/components/StaticInfoScreen";

export default function Privacy() {
  return (
    <StaticInfoScreen
      title="Privacy Policy"
      body={
        "Replace this placeholder with your organization's actual privacy policy, " +
        "or fetch it from the backend (e.g. GET /legal/privacy-policy) so legal " +
        "changes never require an app store release."
      }
    />
  );
}
