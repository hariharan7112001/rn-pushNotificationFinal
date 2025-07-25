import { useNotification } from "@/context/NotificationContext";
import { useEffect } from "react";
import { Text, View } from "react-native";

export default function Index() {
  const { expoPushToken, notification, error } = useNotification();
  useEffect(() => {
    if (expoPushToken) {
      console.log("im tryingg to send")
      fetch("http://10.0.0.5:3001/api/expo-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: expoPushToken, 
        }),
      });
    }
  }, [expoPushToken]);
  
  console.log(notification,"from index")
  if (error){
    return <Text>Error: {error.message}</Text>
  }
  console.log(JSON.stringify(notification, null, 2));
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
      
    >
      <Text>Expo Push Token: {expoPushToken}</Text>
      <Text>Notification Title: {notification?.request.content.title}</Text>
      <Text>Notification Body: {notification?.request.content.body}</Text>
      <Text>Notification Data: {JSON.stringify(notification?.request.content.data)}</Text>
      {/* <Text>Notification: {JSON.stringify(notification, null, 2)}</Text> */}
      {/* <Text>Error: {error?.message}</Text> */}
    </View>
  );
}
