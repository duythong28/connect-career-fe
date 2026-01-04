// UnifiedPushHandler.tsx - CHỈ đăng ký token, KHÔNG show notification
import { useEffect } from "react";
import { getToken, deleteToken } from "firebase/messaging"; // ❌ BỎ onMessage
import { firebaseConfig, messaging } from "@/lib/firebase";
import { updatePushToken } from "@/api/endpoints/users.api";
import { useAuth } from "@/hooks/useAuth";

let cachedDeviceId: string | null = null;
function getDeviceId(): string {
  if (!cachedDeviceId) {
    const storageKey = "device_unique_id";
    const storedId = localStorage.getItem(storageKey);

    if (storedId) {
      cachedDeviceId = storedId;
    } else {
      cachedDeviceId = `web-${Date.now()}-${Math.random()
        .toString(36)
        .substring(7)}`;
      localStorage.setItem(storageKey, cachedDeviceId);
    }
  }
  return cachedDeviceId;
}

const UnifiedPushHandler = () => {
  const { user } = useAuth();

  useEffect(() => {
    const handlePushNotifications = async () => {
      if (!messaging || !("serviceWorker" in navigator)) return;

      try {
        if (user) {
          console.log("🔔 Initializing Push for User:", user.id);

          const configStr = encodeURIComponent(JSON.stringify(firebaseConfig));
          const registration = await navigator.serviceWorker.register(
            `/firebase-messaging-sw.js?config=${configStr}&t=${Date.now()}`,
            { updateViaCache: 'none' }
          );

          await registration.update();

          const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;

          const fcmToken = await getToken(messaging, {
            vapidKey: vapidKey,
            serviceWorkerRegistration: registration,
          });

          if (fcmToken) {
            await updatePushToken({
              token: fcmToken,
              platform: "fcm",
              deviceId: getDeviceId(),
              deviceName: navigator.userAgent,
            });
            console.log("✅ Push token updated:", fcmToken);
          }

        } else {
          console.log("🚫 No user found, cleaning up push token...");
          await deleteToken(messaging);
        }
      } catch (error) {
        console.error("❌ Push notification error:", error);
      }
    };

    handlePushNotifications();
  }, [user]);

  return <></>;
};

export default UnifiedPushHandler;