import { useEffect, useRef } from "react";
import { getToken, onMessage } from "firebase/messaging";
import { firebaseConfig, messaging } from "@/lib/firebase";
import { useToast } from "@/components/ui/use-toast";
import { updatePushToken } from "@/api/endpoints/users.api";

// Helper: Get device info
let cachedDeviceId: string | null = null;
function getDeviceId(): string {
  if (!cachedDeviceId) {
    cachedDeviceId = `web-${Date.now()}-${Math.random()
      .toString(36)
      .substring(7)}`;
  }
  return cachedDeviceId;
}

const UnifiedPushHandler = () => {
  const { toast } = useToast();
  const isInitialized = useRef(false);

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    const initializePushNotifications = async () => {
    //   if (isInitialized.current) return;
      isInitialized.current = true;

      try {
        if (!("serviceWorker" in navigator)) return;

        if (!messaging) {
          console.log("Messaging instance not found");
          return;
        }

        const configStr = encodeURIComponent(JSON.stringify(firebaseConfig));

        const registration = await navigator.serviceWorker.register(
          `/firebase-messaging-sw.js?config=${configStr}`
        );

        console.log(
          "✅ Service Worker registered with scope:",
          registration.scope
        );

        const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;

        const fcmToken = await getToken(messaging, {
          vapidKey: vapidKey,
          serviceWorkerRegistration: registration,
        });
          console.log("🔥 FCM Token:", fcmToken);


        if (fcmToken) {
          console.log("🔥 FCM Token:", fcmToken);

          await updatePushToken({
            token: fcmToken,
            platform: "fcm",
            deviceId: getDeviceId(),
            deviceName: navigator.userAgent,
          });
        }
      } catch (error) {
        console.log("❌ Push init failed:", error);
      }
    };

    if (messaging) {
      unsubscribe = onMessage(messaging, (payload) => {
        console.log("📬 Foreground Message:", payload);

        const { title, body, icon } = payload.notification || {};

        toast({
          title: title || "Thông báo mới",
          description: body,
        });

        if (Notification.permission === "granted") {
          new Notification(title || "CareerHub", {
            body: body,
            icon: icon || "/career192.png",
          });
        }
      });
    }

    initializePushNotifications();

    return () => {
      if (unsubscribe) unsubscribe();
      isInitialized.current = false;
    };
  }, [toast, messaging]);

  return <></>;
};

export default UnifiedPushHandler;
