// firebase-messaging-sw.js
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
);

const params = new URLSearchParams(self.location.search);
const configString = params.get("config");

if (configString) {
  const firebaseConfig = JSON.parse(decodeURIComponent(configString));
  firebase.initializeApp(firebaseConfig);
  const messaging = firebase.messaging();

  messaging.onBackgroundMessage((payload) => {
    console.log("[SW] Message received: ", payload);

    // Đọc từ notification object
    const notificationTitle = payload.notification?.title || "CareerHub";
    const notificationBody = payload.notification?.body;
    const notificationLink = payload.data?.url || self.location.origin;

    const timestamp = Date.now();
    const iconPath = `/career192.png?v=${timestamp}`;

    const notificationOptions = {
      body: notificationBody,
      icon: iconPath,
      badge: iconPath,
      data: {
        url: notificationLink,
        timestamp: payload.data?.timestamp,
        test: payload.data?.test,
      },
      tag: `notif-${timestamp}`,
      timestamp: timestamp,
      renotify: true,
    };

    // ✅ Return này sẽ OVERRIDE notification mặc định của Firebase
    return self.registration.showNotification(
      notificationTitle,
      notificationOptions
    );
  });
}

// ✅ THÊM LISTENER NÀY: Chặn Firebase show notification mặc định
self.addEventListener('push', function(event) {
  // Lấy data từ push event
  const payload = event.data ? event.data.json() : {};
  
  console.log('[SW] Push event intercepted:', payload);
  
  // Nếu có notification object, chặn Firebase xử lý
  if (payload.notification) {
    event.stopImmediatePropagation();
  }
}, true); // ✅ Quan trọng: capture phase = true

self.addEventListener("notificationclick", function (event) {
  console.log("[SW] Notification click received.");
  event.notification.close();
  
  const urlToOpen = event.notification.data?.url || "/";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then(function (clientList) {
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url.includes(self.location.origin) && "focus" in client) {
            return client.focus().then((focusedClient) => {
              if (urlToOpen !== "/") {
                return focusedClient.navigate(urlToOpen);
              }
              return focusedClient;
            });
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});