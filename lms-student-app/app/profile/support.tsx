import { StaticInfoScreen } from "@/components/StaticInfoScreen";

export default function Support() {
  return (
    <StaticInfoScreen
      title="Help & Support"
      body={
        "Need help with your courses, live classes, or payments?\n\n" +
        "Replace this placeholder with your support content, or wire it to a real " +
        "helpdesk/FAQ endpoint from the backend (e.g. GET /support/articles) so the " +
        "content stays editable without an app update."
      }
    />
  );
}
