import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const BotPress = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const shouldShowBot = ["/", "/pricing", "/how-it-work"].includes(currentPath);

  useEffect(() => {
    // Load scripts if not already loaded
    if (!window.botpress) {
      const script1 = document.createElement("script");
      script1.src = "https://cdn.botpress.cloud/webchat/v3.5/inject.js";
      const script2 = document.createElement("script");
      script2.src = "https://files.bpcontent.cloud/2026/01/18/06/20260118063916-YHK3X1YP.js";
      
      script1.onload = () => {
        document.body.appendChild(script2);
      };
      
      document.body.appendChild(script1);
    }

    // Function to show/hide webchat
    const toggleWebchat = () => {
      const chatContainer = document.querySelector('.bpChatContainer');
      const fabWrapper = document.querySelector('.bpFabWrapper');
      const messagePreview = document.querySelector('#message-preview-root');
      
      if (chatContainer) chatContainer.style.display = shouldShowBot ? 'block' : 'none';
      if (fabWrapper) fabWrapper.style.display = shouldShowBot ? 'block' : 'none';
      if (messagePreview) messagePreview.style.display = shouldShowBot ? 'block' : 'none';
      
      // Return true if all elements were found
      return !!(chatContainer && fabWrapper);
    };

    // Keep trying to hide/show until elements are found
    let attemptCount = 0;
    const maxAttempts = 50; // Try for ~5 seconds
    const intervalId = setInterval(() => {
      const found = toggleWebchat();
      attemptCount++;
      
      if (found || attemptCount >= maxAttempts) {
        clearInterval(intervalId);
      }
    }, 100);

    // Handle auto-open
    const handleInitialized = () => {
      toggleWebchat(); // Ensure visibility is set
      if (shouldShowBot) {
        setTimeout(() => {
          window.botpress?.open();
        }, 500);
      }
    };

    const handleHashChange = () => {
      if (window.location.hash === '#ask' && shouldShowBot) {
        window.botpress?.open();
      }
    };

    // Register listeners
    if (window.botpress) {
      window.botpress.on('webchat:initialized', handleInitialized);
      if (shouldShowBot && window.location.hash === '#ask') {
        setTimeout(() => window.botpress.open(), 500);
      }
    }

    window.addEventListener('hashchange', handleHashChange);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [currentPath, shouldShowBot]);

  return null;
};

export default BotPress;