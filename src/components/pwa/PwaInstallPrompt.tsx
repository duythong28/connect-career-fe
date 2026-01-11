// src/components/pwa/PwaInstallPrompt.tsx
import { useEffect, useState } from "react";
import { X, Download, Smartphone } from "lucide-react";
import { useLocation } from "react-router-dom";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const PWA_DISMISSED_KEY = "pwa-install-dismissed";

const PwaInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

  useEffect(() => {
    // Check if already installed as PWA
    const isInStandaloneMode = () =>
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone ||
      document.referrer.includes("android-app://");

    setIsStandalone(isInStandaloneMode());

    // Check iOS
    const checkIOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(checkIOS);

    if (localStorage.getItem(PWA_DISMISSED_KEY) === "true") {
      return;
    }

    // Listen for beforeinstallprompt (Android/Desktop)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);

      if (!isInStandaloneMode()) {
        setShowPrompt(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Show iOS prompt if iOS and not installed
    if (checkIOS && !isInStandaloneMode()) {
      setShowPrompt(true);
    }

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      console.log("User accepted the install prompt");
    } else {
      console.log("User dismissed the install prompt");
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    localStorage.setItem(PWA_DISMISSED_KEY, "true");
    setShowPrompt(false);
  };

  if (isStandalone || !showPrompt) return null;

  return currentPath == "/" ? (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg animate-slide-up duration-500">
      <div className="max-w-4xl mx-auto flex items-start gap-4">
        <div className="flex-shrink-0">
          <Smartphone className="w-8 h-8" />
        </div>

        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-1">Install CareerHub App</h3>

          {isIOS ? (
            <p className="text-sm text-blue-100 mb-3">
              Tap the{" "}
              <span className="inline-flex items-center px-1.5 py-0.5 mx-1 bg-white/20 rounded">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                </svg>
              </span>{" "}
              share button and select "Add to Home Screen" to install
            </p>
          ) : (
            <p className="text-sm text-blue-100 mb-3">
              Get faster access and receive instant job notifications!
            </p>
          )}

          {!isIOS && deferredPrompt && (
            <button
              onClick={handleInstallClick}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
            >
              <Download className="w-4 h-4" />
              Install now
            </button>
          )}
        </div>

        <button
          onClick={handleDismiss}
          className="flex-shrink-0 p-1 hover:bg-white/10 rounded-full transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  ) : null;
};

export default PwaInstallPrompt;
