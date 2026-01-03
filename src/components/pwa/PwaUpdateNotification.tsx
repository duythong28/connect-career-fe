import { useEffect, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { RefreshCw } from 'lucide-react';

const PwaUpdateNotification = () => {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered:', r);
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
  });

  const [showUpdate, setShowUpdate] = useState(false);

  useEffect(() => {
    if (needRefresh) {
      setShowUpdate(true);
    }
  }, [needRefresh]);

  const handleUpdate = () => {
    updateServiceWorker(true);
    setShowUpdate(false);
  };

  const handleDismiss = () => {
    setShowUpdate(false);
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  if (!showUpdate && !offlineReady) return null;

  return (
        <div className="fixed top-4 right-4 z-50 max-w-sm animate-slide-down">
      {offlineReady && !needRefresh && (
        <div className="bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3">
          <div className="flex-1">
            <p className="font-medium">App is ready for offline use</p>
            <p className="text-sm text-green-100">You can use the app without internet</p>
          </div>
          <button
            onClick={handleDismiss}
            className="text-white hover:bg-green-600 rounded p-1"
          >
            ✕
          </button>
        </div>
      )}

      {showUpdate && needRefresh && (
        <div className="bg-blue-600 text-white px-4 py-3 rounded-lg shadow-lg">
          <div className="flex items-start gap-3">
            <RefreshCw className="w-5 h-5 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium mb-1">A new version is available!</p>
              <p className="text-sm text-blue-100 mb-3">
                Update to experience the latest features
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleUpdate}
                  className="px-3 py-1.5 bg-white text-blue-600 rounded font-medium hover:bg-blue-50 transition-colors text-sm"
                >
                  Update now
                </button>
                <button
                  onClick={handleDismiss}
                  className="px-3 py-1.5 bg-blue-700 text-white rounded hover:bg-blue-800 transition-colors text-sm"
                >
                  Later
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PwaUpdateNotification;