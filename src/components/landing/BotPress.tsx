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

    // Handle auto-open and event listeners
    const handleInitialized = () => {
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

    // Show/hide the entire webchat container
    const hideWebchat = () => {
      const chatContainer = document.querySelector('.bpChatContainer');
      const fabWrapper = document.querySelector('.bpFabWrapper');
      const messagePreview = document.querySelector('#message-preview-root');
      
      if (chatContainer) chatContainer.style.display = shouldShowBot ? 'block' : 'none';
      if (fabWrapper) fabWrapper.style.display = shouldShowBot ? 'block' : 'none';
      if (messagePreview) messagePreview.style.display = shouldShowBot ? 'block' : 'none';
    };

    // Wait for DOM to be ready
    setTimeout(hideWebchat, 100);

    // Register listeners
    if (window.botpress) {
      window.botpress.on('webchat:initialized', handleInitialized);
      
      if (shouldShowBot && window.location.hash === '#ask') {
        setTimeout(() => window.botpress.open(), 500);
      }
    }
    
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [currentPath, shouldShowBot]);

  return null;
};

export default BotPress;