import { BrowserRouter as Router } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { queryClient } from "@/lib/queryClient";
import { AppRoutes } from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import { AppLayout } from "./components/layout/AppLayout";
import { OrganizationProvider } from "./context/OrganizationContext";
import { ChatProvider } from "./context/ChatContext";
import { ChatIcon } from "./components/chat/ChatIcon";
import { ChatSearchModal } from "./components/chat/ChatSearchModal";
import { ChatBoxManager } from "./components/chat/ChatBoxManager";
import { CallManager } from "./components/chat/CallManager";
import "@stream-io/video-react-sdk/dist/css/styles.css";

import PwaInstallPrompt from "./components/pwa/PwaInstallPrompt";
import PwaUpdateNotification from "./components/pwa/PwaUpdateNotification";
import UnifiedPushHandler from "./components/notifications/UnifiedPushHandler";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <OrganizationProvider>
            <ChatProvider>
              <AppLayout>
                <AppRoutes />
              </AppLayout>
              {/* <ChatIcon /> */}
              <ChatSearchModal />
              <ChatBoxManager />
              <CallManager />
              
              {/* PWA & Notifications */}
              <UnifiedPushHandler />
              <PwaInstallPrompt />
              <PwaUpdateNotification />
              
              <Toaster />
            </ChatProvider>
          </OrganizationProvider>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;