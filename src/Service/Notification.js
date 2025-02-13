import notifee, { AndroidImportance } from "@notifee/react-native";
import messaging from "@react-native-firebase/messaging";
import { common } from "../Common/Common";
import { navigationRef } from "./Hook/navigationRef";

export const requestPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;
};

export const createNotificationChannel = async () => {
  const channelId = await notifee.createChannel({
    id: "default",
    name: "Default Channel",
    importance: AndroidImportance.HIGH,
  });
  return channelId;
};

export const displayNotification = async (title, body) => {
  await notifee.displayNotification({
    title,
    body,
    android: {
      channelId,
      smallIcon: "ic_launcher",
      pressAction: { id: "open-app" },
    },
  });
};

// Get FCM Token
export const getFcmToken = async () => {
  try {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      return fcmToken;
    } else {
      return null;
    }
  } catch (error) {
    console.log("Error getting FCM token:", error);
  }
};

// Initialize Notifications
export const initializeNotification = () => {
  requestPermission();
  getFcmToken();

  messaging().onMessage(async (remoteMessage) => {
    console.log("📩 Foreground Notification: ", remoteMessage);
    displayNotification(
      remoteMessage?.notification?.title || common.title,
      remoteMessage?.notification?.body || ""
    );
  });

  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log("📩 Background/Killed Notification: ", remoteMessage);
    displayNotification(
      remoteMessage?.notification?.title || common.title,
      remoteMessage?.notification?.body || ""
    );
  });

  messaging().onNotificationOpenedApp((remoteMessage) => {
    console.log(
      "🔄 App Opened from Background by Notification:",
      remoteMessage
    );
    handleNotificationPress(remoteMessage);
  });

  messaging()
    .getInitialNotification()
    .then((remoteMessage) => {
      if (remoteMessage) {
        console.log(
          "🔄 App Opened from Killed State by Notification:",
          remoteMessage
        );
        handleNotificationPress(remoteMessage);
      }
    });
};

const handleNotificationPress = (remoteMessage) => {
  if (!remoteMessage?.data) return;

  if (navigationRef.isReady()) {
    navigationRef.navigate("Fabric-Orders", remoteMessage.data.screen);
  } else {
    console.log("🚨 Navigation not ready.");
  }
};
