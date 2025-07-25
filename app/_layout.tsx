import { Stack } from "expo-router";
import { NotificationProvider } from "@/context/NotificationContext";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowAlert: true,
  }),
});
export default function RootLayout() {
  return (
    <NotificationProvider>
      <Stack />
    </NotificationProvider>
  );
}
