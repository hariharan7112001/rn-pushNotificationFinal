import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useRef,
    ReactNode,
  } from "react";
  import * as Notifications from "expo-notifications";
  import { registerPushNotificationsAsync } from "@/utils/RegisterPushNotificationsAsync";
  
  // 1. Context type definition
  interface NotificationContextType {
    expoPushToken: string | null;
    notification: Notifications.Notification | null;
    error: Error | null;
  }
  
  // 2. Create the Notification Context
  const NotificationContext = createContext<NotificationContextType | undefined>(
    undefined
  );
  
  // 3. Hook to use the context
  export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
      throw new Error(
        "useNotification must be used within a NotificationProvider"
      );
    }
    return context;
  };
  
  // 4. Provider props
  interface NotificationProviderProps {
    children: ReactNode;
  }
  
  // 5. Main Provider Component
  export const NotificationProvider: React.FC<NotificationProviderProps> = ({
    children,
  }) => {
    const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
    const [notification, setNotification] =
      useState<Notifications.Notification | null>(null);
    const [error, setError] = useState<Error | null>(null);
  
    // ✅ Use ReturnType to infer listener types — avoids deprecated Subscription type
    const notificationListener = useRef<
      ReturnType<typeof Notifications.addNotificationReceivedListener> | null
    >(null);
    const responseListener = useRef<
      ReturnType<typeof Notifications.addNotificationResponseReceivedListener> | null
    >(null);
  
    useEffect(() => {
      // Register for push notifications and get Expo token
      registerPushNotificationsAsync().then(
        (token) => setExpoPushToken(token as string),
        (err) => setError(err)
      );
  
      // Add notification received listener
      notificationListener.current =
        Notifications.addNotificationReceivedListener((notification) => {
          console.log("🔔 Notification Received: ", notification);
          setNotification(notification);
        });
  
      // Add notification response listener
      responseListener.current =
        Notifications.addNotificationResponseReceivedListener((response) => {
          console.log(
            "🔔 Notification Response: ",
            JSON.stringify(response, null, 2),
            JSON.stringify(response.notification.request.content.data, null, 2)
          );
          // Handle tap actions here if needed
        });
  
      // Cleanup listeners on unmount
      return () => {
        if (notificationListener.current) {
          notificationListener.current.remove(); // Clean up properly
        }
        if (responseListener.current) {
          responseListener.current.remove();
        }
      };
    }, []);
  
    return (
      <NotificationContext.Provider
        value={{ expoPushToken, notification, error }}
      >
        {children}
      </NotificationContext.Provider>
    );
  };
  